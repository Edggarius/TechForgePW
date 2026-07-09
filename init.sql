-- Crear tabla para los artículos dinámicos
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'devops', 'networks', 'gaming'
    summary TEXT,
    content_html TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Migración idempotente para instalaciones previas sin la columna
ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Índice para acelerar las consultas del frontend por categoría
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
-- Índice para el orden por fecha (feed y archivo)
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
