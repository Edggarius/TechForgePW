/* ═══════════════════════════════════════════════════════════════════
   TechForge — Frontend
   Los datos vienen de PostgreSQL vía GET /api/posts.
   Si la API falla, se usa SEED_DATA (seed-data.js) como respaldo local.
   ═══════════════════════════════════════════════════════════════════ */

const images        = (window.SEED_DATA && window.SEED_DATA.images)   || {};
const SEED_ARTICLES = (window.SEED_DATA && window.SEED_DATA.articles) || [];

// Dataset activo (se llena desde la API o el respaldo). Global: lo consume
// también el script del archivo en index.html.
let articles = [];

// ── Metadatos para el respaldo local ────────────────────────────────────
// Antigüedad por posición dentro de la categoría: 2 de hoy, 1 de ayer,
// 1 de hace 2 días → alimenta el archivo/backlog cuando no hay DB.
function applySeedMetadata(list) {
  const perCat = {};
  const dayOffset = [0, 0, 1, 2];
  list.forEach((a, i) => {
    a._id = 'article-' + i;
    const n = perCat[a.category] || 0;
    const off = dayOffset[n] !== undefined ? dayOffset[n] : n;
    a.date = new Date(Date.now() - off * 86400000).toISOString();
    const imgArr = images[a.category] || [];
    a._img = imgArr.length ? imgArr[n % imgArr.length] : '';
    perCat[a.category] = n + 1;
  });
}

// ── Mapea una fila de la DB al formato que usa el frontend ───────────────
function fromRow(row, idxInCat) {
  const imgArr = images[row.category] || [];
  return {
    category:     row.category,
    title:        row.title,
    summary:      row.summary,
    content_html: row.content_html,
    slug:         row.slug,
    date:         row.created_at,
    _id:          'article-' + row.id,
    _img:         row.image_url || (imgArr.length ? imgArr[idxInCat % imgArr.length] : ''),
  };
}

// ── Utilidades ──────────────────────────────────────────────────────────
function calcReadTime(html) {
  const words = html.replace(/<[^>]+>/g, '').trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function formatDate(isoStr) {
  const d    = new Date(isoStr);
  const now  = new Date();
  const diff = Math.floor((now - d) / 86400000);
  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Ayer';
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}

// ── Inyector de anuncios ────────────────────────────────────────────────
function injectAds(html) {
  const div  = document.createElement('div');
  div.innerHTML = html;
  const ps   = div.querySelectorAll('p');
  const adEl = () => {
    const d = document.createElement('div');
    d.className = 'ad-placeholder in-article-ad';
    d.textContent = 'Anuncio — In-Article';
    return d;
  };
  if (ps[1]) ps[1].after(adEl());
  if (ps[3]) ps[3].after(adEl());
  return div.innerHTML;
}

// ── JSON-LD por artículo (SEO) ──────────────────────────────────────────
function injectArticleSchema(article) {
  const s    = document.createElement('script');
  s.type     = 'application/ld+json';
  s.textContent = JSON.stringify({
    "@context":       "https://schema.org",
    "@type":          "NewsArticle",
    "headline":       article.title,
    "description":    article.summary,
    "image":          article._img ? [article._img] : undefined,
    "datePublished":  article.date,
    "dateModified":   article.date,
    "inLanguage":     "es",
    "author": {
      "@type": "Person",
      "name":  "Jose Edgar Vieyra Calderon"
    },
    "publisher": {
      "@type": "Organization",
      "name":  "TechForge",
      "url":   "https://techforge.dev"
    }
  });
  document.head.appendChild(s);
}

// ── Render ──────────────────────────────────────────────────────────────
function renderArticles() {
  const counts = {};
  const FRESH_MS = 24 * 60 * 60 * 1000; // 24 horas
  let freshCount = 0;

  // Limpia contenedores (por si se re-renderiza)
  ['devops', 'networks', 'gaming'].forEach(cat => {
    const c = document.getElementById(`container-${cat}`);
    if (c) c.innerHTML = '';
  });

  articles.forEach(article => {
    const container = document.getElementById(`container-${article.category}`);
    if (!container) return;

    // Solo se muestran en el feed las noticias de las últimas 24 h.
    // Las más antiguas quedan disponibles en el Archivo por día.
    const age = Date.now() - new Date(article.date).getTime();
    if (age >= FRESH_MS) return;
    freshCount++;

    counts[article.category] = (counts[article.category] || 0) + 1;

    const readTime  = calcReadTime(article.content_html);
    const dateLabel = formatDate(article.date || new Date().toISOString());
    const finalHtml = injectAds(article.content_html);

    injectArticleSchema(article);

    const card = document.createElement('article');
    card.className  = 'article-card';
    card.id         = article._id;
    card.setAttribute('itemscope', '');
    card.setAttribute('itemtype', 'https://schema.org/NewsArticle');

    const isNew    = Date.now() - new Date(article.date) < 86400000 * 2;
    const catEmoji = { devops: '⚙️', networks: '📡', gaming: '🎮' };
    const idx      = counts[article.category];

    const imgUrl   = article._img || '';
    // La primera tarjeta de cada columna está sobre el pliegue: carga prioritaria.
    const eager    = idx === 1;

    card.innerHTML = `
      <div class="card-thumbnail">
        ${imgUrl ? `<img src="${imgUrl}" alt="${article.title}" class="thumb-img" width="700" height="160" loading="${eager ? 'eager' : 'lazy'}" fetchpriority="${eager ? 'high' : 'auto'}">` : ''}
        <div class="thumb-overlay">
          <span class="thumb-emoji">${catEmoji[article.category] || '📄'}</span>
          <span class="thumb-num">0${idx}</span>
        </div>
      </div>
      <div class="card-body">
        <div class="article-meta">
          <span class="category-badge">${article.category}</span>
          ${isNew ? '<span class="badge-new">Nuevo</span>' : ''}
          <span class="meta-divider"></span>
          <span class="meta-pill">⏱ ${readTime} min</span>
          <span class="meta-pill">· ${dateLabel}</span>
        </div>
        <h3 itemprop="headline">${article.title}</h3>
        <p class="summary" itemprop="description">${article.summary}</p>
        <div class="article-content" itemprop="articleBody">${finalHtml}</div>
      </div>
    `;

    container.appendChild(card);
  });

  // Actualizar badges de conteo en cada cabecera
  ['devops', 'networks', 'gaming'].forEach(cat => {
    const el = document.getElementById(`count-${cat}`);
    if (el) el.textContent = `${counts[cat] || 0} art.`;
  });

  // Actualizar stat de hero con las noticias frescas (últimas 24 h)
  const totalEl = document.querySelector('.hero-stats .stat-num');
  if (totalEl) totalEl.textContent = freshCount;
}

// ── Carga de datos: API primero, respaldo local si falla ─────────────────
async function loadArticles() {
  try {
    const res = await fetch('/api/posts', { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const rows = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) throw new Error('sin datos en la DB');

    const perCat = {};
    articles = rows.map(row => {
      const n = perCat[row.category] || 0;
      perCat[row.category] = n + 1;
      return fromRow(row, n);
    });
    console.info(`📡 ${articles.length} artículos cargados desde la base de datos.`);
  } catch (err) {
    console.warn('API no disponible, usando datos locales de respaldo:', err.message);
    articles = SEED_ARTICLES;
    applySeedMetadata(articles);
  }

  renderArticles();
  // Avisa al script del archivo (index.html) que ya hay datos.
  window.dispatchEvent(new Event('articles-ready'));
}

document.addEventListener('DOMContentLoaded', loadArticles);
