const express    = require('express');
const path       = require('path');
const { Client } = require('pg');
const cron       = require('node-cron');
const { Anthropic } = require('@anthropic-ai/sdk');
require('dotenv').config();

const app  = express();
const PORT = 3000;

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname)));

// API: todos los posts
app.get('/api/posts', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM posts ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: posts por categoría
app.get('/api/posts/:category', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM posts WHERE category = $1 ORDER BY created_at DESC',
      [req.params.category]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 1. Configuración de tu Base de Datos Local
const db = new Client({
  user:     process.env.DB_USER     || 'postgres',
  host:     process.env.DB_HOST     || 'localhost',
  database: process.env.DB_NAME     || 'techforge_db',
  password: process.env.DB_PASSWORD || '',
  port:     parseInt(process.env.DB_PORT) || 5432,
});

// 2. Inicializar Cliente de Claude
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Simulación de recolección de datos (Aquí puedes conectar tus APIs/RSS en el futuro)
async function obtenerFuentesCrudas() {
  return `
    - NOTICIA 1: Atlassian lanza parches de rendimiento críticos para automatizaciones nativas en Jira Cloud y optimización de sprints.
    - NOTICIA 2: ASUS y TP-Link liberan nuevos firmwares para routers Wi-Fi 7 orientados a optimizar la extracción de credenciales PPPoE y estabilidad de canales Mesh.
    - NOTICIA 3: La comunidad de modders de Elden Ring y juegos Souls-like lanza un fix de red casero para servidores privados que reduce el jitter y el ping un 30%.
  `;
}

// Proceso principal de automatización
async function actualizarPortalTech() {
  try {
    console.log("🚀 [6:00 AM] Iniciando actualización diaria de contenidos...");
    const fuentes = await obtenerFuentesCrudas();

    const promptMaestro = `Eres un Ingeniero de Contenido y Especialista SEO Senior para un portal de tecnología avanzada llamado "TechForge". Tu tarea es procesar un flujo de información técnica cruda recopilada de diversas fuentes de internet y transformarla en 3 artículos dinámicos e independientes listos para base de datos PostgreSQL, uno para cada una de las siguientes categorías exactas: 'devops', 'networks' y 'gaming'.

[INSTRUCCIONES DE REDACCIÓN Y SEO]
1. Idioma: Español neutro, fluido y profesional pero accesible para entusiastas tecnológicos.
2. Formato: Debes devolver ÚNICAMENTE un objeto JSON válido. No agregues saludos, introducciones ni explicaciones fuera del JSON. El JSON debe contener un array llamado "articulos".
3. Estructura del contenido: Cada artículo debe venir dentro del campo "content_html" completamente formateado en HTML limpio, usando tags: <h2>, <h3>, <p>, <strong>, y estructuras de listas <ul><li> o tablas <table> si el tema requiere comparar datos. No uses tags <html>, <head> ni <body>.
4. Estrategia de Anuncios: Asegúrate de estructurar el texto con párrafos claros para que el script del frontend pueda inyectar anuncios dinámicos después del segundo y cuarto párrafo (<p>).

[FUENTES DE INFORMACIÓN CRUDA del día]
${fuentes}

[FORMATO DE SALIDA REQUERIDO - DEVUELVE SOLO ESTE JSON]
{
  "articulos": [
    {
      "title": "[Título de alto impacto y optimizado para SEO sobre DevOps/Workspace]",
      "slug": "slug-optimizado-separado-por-guiones",
      "category": "devops",
      "summary": "Resumen corto de 2 líneas para la tarjeta de la página principal.",
      "content_html": "<h2>[Subtítulo principal]</h2><p>[Primer párrafo introductorio...]</p><p>[Segundo párrafo detallando el problema...]</p><h3>[Paso a paso o Solución]</h3><ul><li><strong>Punto clave:</strong> Explicación técnica detallada.</li></ul>"
    },
    {
      "title": "[Título de alto impacto y optimizado para SEO sobre Redes/Ecosistemas]",
      "slug": "slug-optimizado-redes",
      "category": "networks",
      "summary": "Resumen corto para la sección de redes.",
      "content_html": "<h2>[Subtítulo]</h2><p>[Contenido con un enfoque muy técnico sobre hardware, configuración de routers o ecosistemas móviles...]</p>"
    },
    {
      "title": "[Título de alto impacto enfocado en Rendimiento/Guías de Gaming]",
      "slug": "slug-optimizado-gaming",
      "category": "gaming",
      "summary": "Resumen corto para la sección de videojuegos.",
      "content_html": "<h2>[Subtítulo]</h2><p>[Contenido enfocado en optimización de rendimiento, fps, guías de logros o configuración de servidores competitivos...]</p>"
    }
  ]
}`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      temperature: 0.2,
      messages: [{ role: "user", content: promptMaestro }],
    });

    // Limpieza por si el modelo incluye bloques de código markdown (```json)
    let rawText = response.content[0].text.trim();
    if (rawText.startsWith("```json")) rawText = rawText.replace(/^```json/, "").replace(/```$/, "");

    const data = JSON.parse(rawText);

    for (const articulo of data.articulos) {
      const query = `
        INSERT INTO posts (title, slug, category, summary, content_html)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (slug) DO UPDATE
        SET title = EXCLUDED.title, content_html = EXCLUDED.content_html, summary = EXCLUDED.summary;
      `;
      const values = [articulo.title, articulo.slug, articulo.category, articulo.summary, articulo.content_html];
      await db.query(query, values);
    }

    console.log("✅ [6:05 AM] Base de datos actualizada con las tendencias del día.");
  } catch (error) {
    console.error("❌ Error ejecutando la actualización:", error);
  }
}

// Conexión inicial, servidor HTTP y cron
db.connect()
  .then(() => {
    console.log("🐘 Conectado a PostgreSQL.");

    cron.schedule('0 6 * * *', () => {
      actualizarPortalTech();
    });

    app.listen(PORT, () => {
      console.log(`🌐 Servidor HTTP corriendo en http://localhost:${PORT}`);
      console.log("⏰ Cron Job activo — dispara a las 6:00 AM todos los días.");
    });

    // Para probar la generación sin esperar las 6 AM, descomenta:
    // actualizarPortalTech();
  })
  .catch(err => console.error("❌ Error de conexión a PostgreSQL:", err));
