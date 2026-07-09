# TechForge — Session Log
**Fecha:** 8 de julio de 2026
**Duración:** ~3 horas

---

## Cierre 2026-07-09 — Es seguro apagar la PC

Todo persiste y arranca solo al reiniciar. Verificado:
- Código commiteado y pusheado a GitHub (main)
- PostgreSQL: datos en disco + servicio `enabled` (arranca en boot)
- nginx: `enabled`
- **PM2: `pm2 save` hecho + `pm2 startup` configurado** → `pm2-edggarius.service`
  `enabled`. El server revive solo tras un reinicio
- Al encender mañana: `http://192.168.1.239` debería estar arriba sin hacer nada

Si algo no levantara: `pm2 resurrect` (o `pm2 start server.js --name techforge`).

### Pendiente para mañana (para que lo vean tus amigos por internet)
1. Port forwarding en el router: puerto 80/443 externo → 192.168.1.239
2. Dominio: DuckDNS gratis vs propio (~$10/año) apuntando a la IP pública
3. Certbot + HTTPS (Let's Encrypt) en nginx
4. Verificar que el ISP no bloquee el puerto 80

---

## Sesión 4 — Filtro 24h, color de cards, lector modal y conexión a la DB

### Feed de últimas 24 h
- `renderArticles()` ahora oculta del feed las noticias con más de 24 h;
  siguen disponibles en el Archivo por día
- Stat del hero muestra los "Publicados hoy" (frescos), no el total

### Color de las cards (criterio SEO/UX)
- Cambian de blanco puro a `#f3f8f4` (verde-papel suave). Se mantiene
  contraste AAA para no castigar legibilidad/accesibilidad (factores
  indirectos de ranking); un color oscuro habría reducido el contraste

### Lector modal
- Al abrir un artículo desde el Archivo se muestra en un modal (funciona
  igual para noticias frescas y antiguas, que ya no existen como card en el DOM)
- Cerrable con ✕, overlay o Escape; reutiliza los estilos de `.article-content`

### Conexión a PostgreSQL (lo grande)
- **Fuente única de datos:** `seed-data.js` (módulo UMD) usado por el
  navegador (respaldo) y por Node (siembra) — sin contenido duplicado
- **`app.js`** ahora hace `fetch('/api/posts')` al cargar; si la API falla,
  usa `SEED_DATA` como respaldo local. Mapea filas de la DB al formato del front
- **Esquema:** nueva columna `image_url`; migración idempotente
  (`ADD COLUMN IF NOT EXISTS`) + índice por `created_at`
- **`seed.js`** (`npm run seed`): siembra los 12 artículos con fechas
  escalonadas e imágenes. Upsert por `slug`
- **`server.js`:** verifica el esquema al arrancar y el cron ahora guarda
  `image_url` + `created_at` por artículo generado
- Verificado: API devuelve 12 posts, 6 frescos en feed, 6 en archivo

---

## Sesión 3 — Auditoría UI/UX + SEO y Archivo por día

### SEO aplicado
- `og:image` + `twitter:image` (1200×630) — los shares en redes ya no salen rotos
- Favicon SVG inline (verde, sin request extra)
- `<meta name="theme-color">` (#052e16) para la barra del navegador móvil
- `<meta name="keywords">` con términos objetivo
- **robots.txt** y **sitemap.xml** nuevos (servidos por Express en la raíz)
- `alt` de las imágenes ahora usa el título del artículo (antes solo la categoría)
- JSON-LD NewsArticle enriquecido con `image` y `author` (Jose Edgar Vieyra Calderon)
- Primeras imágenes de cada columna con `loading="eager"` + `fetchpriority="high"`; el resto lazy
- `width`/`height` en imágenes para evitar layout shift (CLS)

### Accesibilidad / UX
- Enlace "Saltar al contenido" (skip-link) para navegación por teclado
- Estados `:focus-visible` con outline verde en enlaces, botones y tabs
- `aria-current="true"` en el tab activo
- Botón flotante "volver arriba" (aparece tras 600px de scroll)

### Nueva feature — Archivo por día (backlog)
- Botón 🗓 "Archivo" en navbar y menú móvil → abre un drawer lateral
- Los 12 artículos ahora tienen fechas escalonadas (hoy / ayer / hace 2 y 3 días)
  para poblar el backlog de forma realista
- El drawer agrupa por fecha, muestra conteo por día y cada entrada salta
  al artículo con resaltado animado (cierra tab-filtro si es necesario)
- Cerrable con overlay, botón ✕ o tecla Escape

---

## Sesión 2 — Rediseño visual (misma fecha)
- Rediseño completo de `styles.css`: headers por categoría con gradiente de color, tarjetas con stripe superior, badge "NUEVO", navbar con blur/glassmorphism, footer oscuro con gradiente
- Emojis de categoría (⚙️ DevOps / 📡 Redes / 🎮 Gaming) en los headers
- Logo con gradiente multicolor y badge "Beta"
- Dots de color en el menú de navegación
- Animaciones mejoradas: pulse en badge nuevo, hover con sombra profunda
- Tipografía mejorada: arrows → en listas, h2 con borde izquierdo de color, h3 con línea divisora
- Código inline con fondo y color rosa

---

## Lo que se construyó hoy

### Backend (server.js)
- Node.js + Express sirviendo el frontend y API REST
- PostgreSQL con tabla `posts` (id, title, slug, category, summary, content_html, created_at)
- Cron job con `node-cron` que dispara a las **6:00 AM diario**
- Integración con Claude API (claude-3-5-sonnet) que genera 3 artículos en JSON
- Upsert inteligente: si el slug ya existe, actualiza; si es nuevo, inserta
- Variables de entorno via `.env` (dotenv)
- API endpoints: `GET /api/posts` y `GET /api/posts/:category`

### Frontend
- `index.html` — grid de 3 columnas (DevOps / Redes / Gaming)
- `styles.css` — diseño Flat estilo Sofascore con color por categoría
  - DevOps: azul `#0052cc`
  - Networks: verde `#00875a`
  - Gaming: morado `#6554c0`
- `app.js` — inyector dinámico de anuncios (después del párrafo 2 y 4)

### SEO aplicado
- Meta tags completos (description, robots, canonical)
- Open Graph (Facebook/LinkedIn)
- Twitter Cards
- JSON-LD Schema.org: `WebSite` en head + `NewsArticle` por artículo
- Font Inter cargada sin bloquear render (preload + onload)
- Tiempo de lectura y fecha en cada tarjeta
- Badge de categoría con color

### Infraestructura local
- PostgreSQL 18.4 instalado e inicializado
- PM2 corriendo `server.js` permanentemente
- nginx como proxy reverso en puerto 80
- UFW con puerto 80 y 3000 abiertos
- Página accesible en la red local: `http://192.168.1.239`

### Repositorio
- GitHub: https://github.com/Edggarius/TechForgePW
- Rama: `main`
- `.env` y `node_modules/` excluidos con `.gitignore`

---

## Estado actual de servicios

| Servicio | Estado | Puerto |
|---------|--------|--------|
| PostgreSQL | activo (systemd) | 5432 |
| Node.js (PM2) | activo | 3000 |
| nginx | activo (systemd) | 80 |

### Comandos útiles
```bash
pm2 status                          # ver estado del servidor
pm2 logs techforge                  # ver logs en tiempo real
pm2 restart techforge               # reiniciar tras cambios
sudo systemctl status nginx         # estado de nginx
sudo systemctl status postgresql    # estado de postgres
```

---

## Pendiente para mañana

### Decisión principal
**¿Pagamos dominio propio o usamos DuckDNS gratis?**

| Opción | Costo | Ventajas | Para AdSense |
|--------|-------|----------|-------------|
| DuckDNS | Gratis | Inmediato, fácil | Posible (subdominio) |
| Dominio propio (.dev/.com) | ~$10–15/año | Profesional, mejor SEO, AdSense seguro | Sí |

**Recomendación:** dominio propio si el objetivo es monetizar con AdSense/Ezoic. Ezoic en particular requiere dominio propio y tráfico mínimo.

### Pasos pendientes (en orden)
1. **Port forwarding en el router** — abrir puerto 80 externo → 192.168.1.239:80
2. **Registrar dominio o DuckDNS** — elegir nombre y apuntar a la IP pública
3. **Certbot + HTTPS** — SSL gratis con Let's Encrypt para que nginx sirva en 443
4. **Conectar app.js a la API real** — reemplazar `mockDatabase` con `fetch('/api/posts')`
5. **ISP check** — verificar que el ISP no bloquea el puerto 80 (algunos ISP residenciales lo bloquean)
6. **PM2 startup** — `pm2 startup` para que el servidor arranque al encender la PC

### Datos importantes
- IP local de la PC: `192.168.1.239`
- Base de datos: `techforge_db` / usuario: `postgres`
- Puerto del servidor Node: `3000`
- Puerto nginx: `80`
- Cron: todos los días a las 6:00 AM

---

## Arquitectura objetivo (producción)

```
Internet
   │
   ▼
techforge.dev (dominio)
   │
   ▼
Router (port forwarding 80/443 → 192.168.1.239)
   │
   ▼
nginx (SSL termination, puerto 443)
   │
   ▼
Node.js / Express (PM2, puerto 3000)
   │
   ▼
PostgreSQL (localhost:5432)
```
