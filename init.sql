-- Crear tabla para los artículos dinámicos
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'devops', 'networks', 'gaming'
    summary TEXT,
    content_html TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para acelerar las consultas del frontend por categoría
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
