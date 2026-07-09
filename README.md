# TechForge — Portal de Tecnología con Contenido Automatizado por IA

Portal de noticias y tutoriales técnicos de nicho diseñado para monetización de alto RPM mediante publicidad (AdSense/Ezoic). El contenido se genera y publica automáticamente cada día a las 6:00 AM usando la API de Claude (Anthropic) sin intervención manual.

---

## Tabla de Contenidos

1. [Arquitectura del Sistema](#arquitectura-del-sistema)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Base de Datos](#base-de-datos)
5. [Backend — server.js](#backend--serverjs)
6. [Frontend](#frontend)
7. [Sistema de Monetización](#sistema-de-monetización)
8. [Instalación y Configuración](#instalación-y-configuración)
9. [Uso](#uso)
10. [Roadmap](#roadmap)

---

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CICLO DIARIO (6:00 AM)                       │
│                                                                     │
│   ┌──────────────┐    ┌──────────────┐    ┌─────────────────────┐  │
│   │  Fuentes de  │───▶│  server.js   │───▶│   API de Claude     │  │
│   │  Noticias    │    │  (node-cron) │    │  (Anthropic SDK)    │  │
│   │  (RSS/APIs)  │    └──────────────┘    └─────────────────────┘  │
│   └──────────────┘           │                      │              │
│                              │           JSON con 3 artículos      │
│                              ▼                      │              │
│                    ┌──────────────────┐◀────────────┘              │
│                    │   PostgreSQL     │                             │
│                    │  techforge_db    │                             │
│                    │  tabla: posts    │                             │
│                    └──────────────────┘                            │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │      FRONTEND       │
                    │  index.html         │
                    │  styles.css         │
                    │  app.js             │
                    │                     │
                    │  ┌───┬───┬───────┐  │
                    │  │DEV│NET│GAMING │  │
                    │  │OPS│   │  LABS │  │
                    │  └───┴───┴───────┘  │
                    │   Grid 3 columnas   │
                    └─────────────────────┘
```

### Flujo de Datos

```
RSS / APIs externas
      │
      ▼
obtenerFuentesCrudas()   ← Recolecta titulares del día
      │
      ▼
Prompt Maestro (Few-Shot) → Claude claude-3-5-sonnet
      │
      ▼
JSON: { articulos: [ devops, networks, gaming ] }
      │
      ▼
INSERT ... ON CONFLICT (slug) DO UPDATE   ← Upsert inteligente
      │
      ▼
PostgreSQL tabla "posts"
      │
      ▼
app.js → injectAds() → DOM rendering
```

---

## Stack Tecnológico

| Capa | Tecnología | Versión | Función |
|------|-----------|---------|---------|
| Runtime | Node.js | ≥18 | Entorno de ejecución del backend |
| Scheduler | node-cron | ^3.0.3 | Disparo automático a las 6:00 AM |
| Base de datos | PostgreSQL | 18.4 | Almacenamiento de artículos |
| Driver DB | pg | ^8.11.3 | Conexión Node.js ↔ PostgreSQL |
| IA Generativa | @anthropic-ai/sdk | ^0.20.0 | Generación de contenido con Claude |
| Modelo IA | claude-3-5-sonnet-20241022 | — | Redacción y formato HTML/SEO |
| Frontend | HTML5 / CSS3 / Vanilla JS | — | Interfaz sin frameworks |
| Tipografía | Inter (Google Fonts) | — | Legibilidad en interfaces técnicas |

---

## Estructura del Proyecto

```
techforge-backend/
│
├── server.js          # Motor del backend: cron + IA + DB
├── init.sql           # Schema de la base de datos
├── package.json       # Dependencias del proyecto
│
├── index.html         # Estructura HTML del portal
├── styles.css         # Sistema de diseño Flat/Sofascore
└── app.js             # Lógica dinámica + inyector de anuncios
```

---

## Base de Datos

### Conexión

```
Host:     localhost
Puerto:   5432
Base:     techforge_db
Usuario:  postgres
```

### Schema — `init.sql`

```sql
CREATE TABLE IF NOT EXISTS posts (
    id           SERIAL PRIMARY KEY,
    title        VARCHAR(255) NOT NULL,
    slug         VARCHAR(255) UNIQUE NOT NULL,
    category     VARCHAR(50)  NOT NULL,   -- 'devops' | 'networks' | 'gaming'
    summary      TEXT,
    content_html TEXT         NOT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
```

### Descripción de Campos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | SERIAL | Clave primaria autoincremental |
| `title` | VARCHAR(255) | Título optimizado para SEO, generado por Claude |
| `slug` | VARCHAR(255) UNIQUE | URL amigable, única por artículo |
| `category` | VARCHAR(50) | Categoría del artículo: `devops`, `networks` o `gaming` |
| `summary` | TEXT | Extracto corto para la tarjeta de la página principal (2 líneas) |
| `content_html` | TEXT | Cuerpo completo del artículo en HTML limpio (`<h2>`, `<p>`, `<ul>`) |
| `created_at` | TIMESTAMP | Fecha y hora de inserción (automática) |

### Índices

| Índice | Campo | Propósito |
|--------|-------|-----------|
| `idx_posts_category` | `category` | Acelera las consultas filtradas por categoría desde el frontend |

### Estrategia de Actualización (UPSERT)

La tabla utiliza `ON CONFLICT (slug) DO UPDATE`, lo que significa:
- Si el artículo del día ya existe (mismo slug), **actualiza** el contenido sin crear duplicados.
- Si es nuevo, **inserta** el registro.
- El campo `created_at` conserva la fecha original de la primera inserción.

---

## Backend — `server.js`

### Responsabilidades

1. Conectar a PostgreSQL al arrancar.
2. Registrar el cron job para las 6:00 AM.
3. Recolectar noticias del día.
4. Enviar el Prompt Maestro a Claude.
5. Parsear el JSON de respuesta.
6. Persistir los 3 artículos en la base de datos.

### Cron Job

```javascript
cron.schedule('0 6 * * *', () => {
    actualizarPortalTech();
});
```

| Expresión | Significado |
|-----------|-------------|
| `0` | Minuto 0 |
| `6` | Hora 6 AM |
| `* * *` | Todos los días, meses y días de la semana |

### `obtenerFuentesCrudas()`

Función modular que devuelve el feed de noticias del día. Actualmente usa datos de ejemplo estáticos. Está diseñada para conectar fuentes reales (RSS, APIs de noticias) sin modificar el resto del flujo.

```
Entrada:  ninguna
Salida:   string con titulares y resúmenes crudos del día
```

**Punto de extensión:** Para agregar fuentes reales, reemplazar el cuerpo de esta función con llamadas a APIs como NewsAPI, Google News RSS, Feedly, etc.

### `actualizarPortalTech()`

Función principal asíncrona que orquesta todo el pipeline:

```
1. obtenerFuentesCrudas()      → fuentes (string)
2. Construir promptMaestro     → prompt (string)
3. anthropic.messages.create() → response (JSON string)
4. JSON.parse(rawText)         → data.articulos (array)
5. db.query() × 3             → INSERT/UPDATE en PostgreSQL
```

### Prompt Maestro — Estrategia Few-Shot

El prompt usa una técnica de **instrucciones estructuradas por secciones** para garantizar una salida JSON determinista:

| Sección del Prompt | Propósito |
|--------------------|-----------|
| Definición de rol | Establece identidad: "Ingeniero de Contenido y SEO Senior" |
| Idioma | Español neutro, profesional y accesible |
| Formato de salida | JSON estricto, sin texto fuera del objeto |
| Estructura HTML | Tags permitidos: `<h2>`, `<h3>`, `<p>`, `<strong>`, `<ul>`, `<li>`, `<table>` |
| Estrategia de anuncios | Párrafos claros para que el inyector frontend funcione correctamente |
| Fuentes crudas | Titulares del día interpolados dinámicamente (`${fuentes}`) |
| Schema de salida | Ejemplo JSON con los 3 artículos y todos sus campos |

**Parámetros del modelo:**

```javascript
model:      "claude-3-5-sonnet-20241022"
max_tokens: 4000
temperature: 0.2   // Baja: fuerza salida JSON limpia y predecible
```

**Limpieza de respuesta:** El parser detecta y elimina bloques de código Markdown (` ```json `) que el modelo podría generar de forma defensiva.

---

## Frontend

### `index.html` — Estructura

El layout está dividido en tres zonas principales:

```
┌─────────────────────────────────────────┐
│  NAVBAR (sticky, 60px)                  │
│  Logo | DevOps & Infra | Redes | Gaming │
├─────────────────────────────────────────┤
│  LEADERBOARD AD (banner superior)       │
├───────────┬───────────┬─────────────────┤
│  DevOps   │  Redes &  │  Gaming Labs    │
│ & Workspace│Ecosistemas│                │
│           │           │                 │
│ [Article] │ [Article] │ [Article]       │
│  [AD]     │  [AD]     │  [AD]           │
│ [Article] │ [Article] │ [Article]       │
│  [AD]     │  [AD]     │  [AD]           │
└───────────┴───────────┴─────────────────┘
```

Los contenedores de artículos son identificados por ID:
- `#container-devops`
- `#container-networks`
- `#container-gaming`

### `styles.css` — Sistema de Diseño

Inspirado en la interfaz de **Sofascore**: Flat Design, alta densidad de información, sin ruido visual.

#### Variables CSS

```css
--bg-color:     #f2f3f5   /* Fondo general gris claro */
--card-bg:      #ffffff   /* Tarjetas blancas puras */
--text-main:    #1a1b1e   /* Texto principal casi negro */
--text-muted:   #6b7280   /* Texto secundario / metadatos */
--accent-color: #0052cc   /* Azul corporativo (links, activos) */
--border-color: #e5e7eb   /* Bordes sutiles entre componentes */
--ad-bg:        #fdfdfd   /* Fondo diferenciado para bloques de anuncio */
```

#### Componentes Principales

| Componente | Clase CSS | Descripción |
|-----------|-----------|-------------|
| Barra de navegación | `.navbar` | Sticky en top, borde inferior sutil |
| Logo | `.logo span` | Parte "Forge" en azul acento |
| Grid principal | `.main-grid` | 3 columnas iguales, colapsa a 1 en móvil (<900px) |
| Cabecera de categoría | `.category-header` | Label en uppercase con letter-spacing |
| Tarjeta de artículo | `.article-card` | Card blanca con borde, padding 20px |
| Banner de anuncio | `.top-ad` | Leaderboard full-width en la parte superior |
| Anuncio in-article | `.in-article-ad` | Bloque con borde top/bottom insertado por JS |

#### Responsive

```css
@media (max-width: 900px) {
    .main-grid { grid-template-columns: 1fr; }
}
```

Las 3 columnas colapsan en una sola columna apilada en dispositivos móviles.

### `app.js` — Lógica Dinámica

#### `mockDatabase`

Array que simula la respuesta de la API del backend. En producción se reemplaza con:

```javascript
const data = await fetch('/api/articulos').then(r => r.json());
```

Cada objeto tiene la misma estructura que un registro de la tabla `posts`.

#### `injectAds(htmlContent)`

El inyector de publicidad es el componente más crítico para la monetización.

```
Entrada:  content_html (string HTML del artículo)
Salida:   HTML con bloques <div class="in-article-ad"> insertados
```

**Algoritmo:**

```
1. Crear div temporal en memoria (no visible en DOM)
2. Parsear el HTML del artículo como DOM
3. Seleccionar todos los <p> con querySelectorAll('p')
4. Si existen ≥ 2 párrafos → insertar anuncio después del párrafo [1] (índice 0-based)
5. Si existen ≥ 4 párrafos → insertar anuncio después del párrafo [3]
6. Serializar el div de vuelta a string HTML
7. Retornar el HTML enriquecido con anuncios
```

**¿Por qué después del 2do y 4to párrafo?**

Los párrafos 2 y 4 son las posiciones de mayor visibilidad y menor intrusividad según las guías de calidad de AdSense/Ezoic. El lector ya entró en contexto (párrafo 1), recibe el anuncio justo cuando va a continuar (párrafo 2), y luego otro en el punto de mayor engagement (párrafo 4).

#### `renderArticles()`

Itera el array de artículos, localiza el contenedor correcto por categoría, construye el HTML de la tarjeta con `injectAds()` aplicado, y lo inserta en el DOM.

```
DOMContentLoaded
      │
      ▼
renderArticles()
      │
      ├── forEach article
      │       │
      │       ├── getElementById(`container-${category}`)
      │       ├── injectAds(content_html)
      │       └── appendChild(articleCard)
      │
      ▼
  Portal renderizado
```

---

## Sistema de Monetización

### Modelo de Negocio

El portal está diseñado para maximizar el **RPM (Revenue Per Mille)** mediante:

1. **Nicho de alto CPC:** Las 3 categorías apuntan a audiencias con alta intención de compra o perfil B2B.
2. **Contenido automático diario:** Sin costos editoriales recurrentes.
3. **Densidad de anuncios óptima:** Máximo 2 anuncios in-article por artículo para no violar políticas de AdSense.

### Posicionamiento de Anuncios

| Posición | Tipo | Elemento | Impacto RPM |
|----------|------|----------|------------|
| Superior de página | Leaderboard Banner | `.top-ad` | Alto (first-view) |
| Después del 2do párrafo | In-Article | `.in-article-ad` | Muy alto (contexto leído) |
| Después del 4to párrafo | In-Article | `.in-article-ad` | Alto (engagement peak) |

### Análisis de Nichos por CPC Estimado

| Categoría | Nicho Específico | CPC Estimado | Audiencia |
|-----------|-----------------|-------------|-----------|
| `devops` | Jira, n8n, AWS, automatización empresarial | Alto ($2–8) | Developers B2B, CTOs |
| `networks` | Wi-Fi 7, routers, infraestructura casera | Medio-alto ($1.5–4) | Entusiastas tech, SMBs |
| `gaming` | Optimización FPS, guías platino, servidores | Medio ($0.8–2.5) | Gamers, streaming |

### Para Activar Monetización Real

1. Reemplazar los `<div class="ad-placeholder">` por los scripts de AdSense/Ezoic.
2. En `injectAds()`, cambiar `adHTML` por el snippet real del proveedor publicitario.
3. Verificar cumplimiento de políticas (mínimo de contenido por página, densidad de anuncios).

---

## Instalación y Configuración

### Prerrequisitos

- Node.js ≥ 18
- PostgreSQL 14+ (instalado y corriendo)
- API Key de Anthropic Claude

### Paso a Paso

**1. Clonar / ubicarse en el directorio del proyecto**

```bash
cd "techforge-backend"
```

**2. Instalar dependencias**

```bash
npm install
```

**3. Crear la base de datos en PostgreSQL**

```bash
sudo -u postgres createdb techforge_db
```

**4. Ejecutar el schema**

```bash
sudo -u postgres psql -d techforge_db -c "
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,
    summary TEXT,
    content_html TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
"
```

**5. Configurar la variable de entorno**

```bash
# Linux / macOS
export ANTHROPIC_API_KEY="tu_api_key_aqui"

# Windows (PowerShell)
$env:ANTHROPIC_API_KEY="tu_api_key_aqui"
```

**6. Verificar credenciales de PostgreSQL**

En `server.js`, asegurarse que la configuración coincide con tu instalación local:

```javascript
const db = new Client({
  user:     'postgres',
  host:     'localhost',
  database: 'techforge_db',
  password: 'tu_password',
  port:     5432,
});
```

**7. Iniciar el servidor**

```bash
npm start
```

### Verificación de Instalación Correcta

Al iniciar, la consola debe mostrar:

```
🐘 Servidor conectado de forma segura a PostgreSQL Local.
⏰ Cron Job activo. Esperando a las 6:00 AM para disparar la IA...
```

---

## Uso

### Iniciar el backend

```bash
npm start
```

### Probar la generación de contenido sin esperar las 6 AM

Descomentar la última línea en `server.js`:

```javascript
// Dentro del bloque .then()
actualizarPortalTech(); // ← quitar el //
```

### Ver la página en el navegador

Abrir `index.html` directamente en el navegador:

```bash
chromium index.html
# o
firefox index.html
```

### Verificar contenido en la base de datos

```bash
psql -U postgres -d techforge_db -c "SELECT id, title, category, created_at FROM posts ORDER BY created_at DESC;"
```

### Detener el servidor

```bash
# Ctrl + C en la terminal donde corre npm start
```

---

## Roadmap

### Fase 1 — Completada ✅
- [x] Schema de base de datos PostgreSQL
- [x] Backend con cron job diario a las 6 AM
- [x] Integración con API de Claude (Anthropic)
- [x] Prompt Maestro con Few-Shot para JSON estructurado
- [x] Upsert inteligente en PostgreSQL
- [x] Frontend con grid de 3 columnas
- [x] Sistema de diseño Flat/Sofascore (CSS Variables)
- [x] Inyector dinámico de anuncios in-article (JS DOM)
- [x] Responsive para móviles

### Fase 2 — Pendiente
- [ ] API REST con Express.js para conectar frontend ↔ PostgreSQL
- [ ] Reemplazar `mockDatabase` en `app.js` con `fetch('/api/posts')`
- [ ] Conectar fuentes RSS reales en `obtenerFuentesCrudas()`
- [ ] Página de artículo individual (`/articulo/:slug`)
- [ ] Sistema de caché para reducir consultas a la DB

### Fase 3 — Producción
- [ ] Despliegue en VPS (nginx como proxy reverso)
- [ ] Proceso permanente con PM2
- [ ] HTTPS con Certbot (Let's Encrypt)
- [ ] Activar scripts reales de AdSense / Ezoic
- [ ] Google Analytics / Search Console
- [ ] Sitemap XML generado automáticamente

---

## Variables de Entorno

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `ANTHROPIC_API_KEY` | Sí | API Key de Anthropic para usar Claude |

---

## Dependencias

```json
{
  "@anthropic-ai/sdk": "^0.20.0",
  "node-cron":         "^3.0.3",
  "pg":                "^8.11.3"
}
```

| Paquete | Propósito |
|---------|-----------|
| `@anthropic-ai/sdk` | Cliente oficial para la API de Claude |
| `node-cron` | Programador de tareas tipo cron para Node.js |
| `pg` | Driver de PostgreSQL para Node.js |
