/* ═══════════════════════════════════════════════════════════════════
   TechForge — Siembra de la base de datos
   Inserta (o actualiza) los 12 artículos de seed-data.js en PostgreSQL.
   Uso:  node seed.js
   ═══════════════════════════════════════════════════════════════════ */
const { Client } = require('pg');
require('dotenv').config();

const { images, articles } = require('./seed-data.js');

const db = new Client({
  user:     process.env.DB_USER     || 'postgres',
  host:     process.env.DB_HOST     || 'localhost',
  database: process.env.DB_NAME     || 'techforge_db',
  password: process.env.DB_PASSWORD || '',
  port:     parseInt(process.env.DB_PORT) || 5432,
});

// Misma distribución de antigüedad que el frontend de respaldo:
// 2 de hoy, 1 de ayer, 1 de hace 2 días por categoría.
const dayOffset = [0, 0, 1, 2];

async function ensureSchema() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      category VARCHAR(50) NOT NULL,
      summary TEXT,
      content_html TEXT NOT NULL,
      image_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await db.query(`ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_url TEXT;`);
  await db.query(`CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);`);
  await db.query(`CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);`);
}

async function seed() {
  await db.connect();
  console.log('🐘 Conectado a PostgreSQL.');
  await ensureSchema();

  const perCat = {};
  let count = 0;

  for (const a of articles) {
    const n   = perCat[a.category] || 0;
    perCat[a.category] = n + 1;

    const off       = dayOffset[n] !== undefined ? dayOffset[n] : n;
    const createdAt = new Date(Date.now() - off * 86400000);
    const imgArr    = images[a.category] || [];
    const imageUrl  = a.image_url || (imgArr.length ? imgArr[n % imgArr.length] : null);

    await db.query(
      `INSERT INTO posts (title, slug, category, summary, content_html, image_url, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (slug) DO UPDATE SET
         title        = EXCLUDED.title,
         category     = EXCLUDED.category,
         summary      = EXCLUDED.summary,
         content_html = EXCLUDED.content_html,
         image_url    = EXCLUDED.image_url,
         created_at   = EXCLUDED.created_at;`,
      [a.title, a.slug, a.category, a.summary, a.content_html, imageUrl, createdAt]
    );
    count++;
  }

  console.log(`✅ ${count} artículos sembrados/actualizados en la base de datos.`);
  await db.end();
}

seed().catch(err => {
  console.error('❌ Error sembrando la base de datos:', err.message);
  process.exit(1);
});
