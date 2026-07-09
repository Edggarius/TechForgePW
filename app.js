// En producción reemplazar con: fetch('/api/posts').then(r => r.json())
const articles = [
  // ── DEVOPS ──────────────────────────────────────────────────────────
  {
    category: "devops",
    title: "n8n + Jira 2026: Automatiza tu Triaje de Tickets en 15 Minutos",
    summary: "Configura un flujo no-code que detecta nuevos issues, los clasifica por prioridad y notifica al equipo en Slack sin escribir una línea de código.",
    date: new Date().toISOString(),
    content_html: `
      <p>Los equipos de DevOps que integran <strong>n8n con Jira</strong> reportan ahorros de 5 a 10 horas semanales en tareas administrativas. La versión 2.x de n8n (estable desde 2026) incluye un nodo nativo de Jira con soporte para 20 acciones y 1 trigger dedicado, eliminando la necesidad de configurar webhooks manualmente.</p>
      <p>El caso de uso más efectivo es el triaje automático: cuando un ticket entra como <code>To Do</code>, n8n evalúa sus etiquetas, asigna prioridad, lo mueve al sprint correcto y notifica al responsable en Slack — todo en menos de 3 segundos.</p>
      <h3>Configuración Paso a Paso</h3>
      <ul>
        <li><strong>Paso 1 — Token de API:</strong> Ve a <em>id.atlassian.com → Security → API tokens</em> y genera un token. Regístralo en n8n como credencial tipo "Jira API".</li>
        <li><strong>Paso 2 — Nodo Trigger:</strong> Agrega el nodo <em>Jira Trigger</em> con el evento <code>Issue Created</code>. n8n genera automáticamente la URL de webhook que registras en Jira.</li>
        <li><strong>Paso 3 — Nodo IF:</strong> Evalúa <code>priority.name</code> del payload. Si es <code>High</code> o <code>Critical</code>, deriva al camino de alerta urgente.</li>
        <li><strong>Paso 4 — Nodo Slack:</strong> Envía mensaje al canal <code>#ops-alerts</code> con el título del issue, el asignado y el enlace directo.</li>
      </ul>
      <p>El payload de Jira viene anidado: usa el nodo <em>Item Lists</em> de n8n para aplanar la estructura antes de mapear campos personalizados. Esto evita errores de referencia nulos cuando el issue no tiene todos los campos completados.</p>
      <p>Para equipos con más de 50 tickets diarios, este flujo elimina completamente la reunión de triaje matutina. Los equipos reportan un ahorro promedio de <strong>40 minutos diarios</strong> solo en coordinación de issues.</p>
    `
  },
  {
    category: "devops",
    title: "GitHub Actions + AWS ECS: Pipeline CI/CD que Despliega en 4 Minutos",
    summary: "Pipeline completo de integración y entrega continua con caché de capas Docker, testing en matriz y deploy automático a ECS en cada push a main.",
    date: new Date().toISOString(),
    content_html: `
      <p>Un pipeline CI/CD bien configurado es la diferencia entre desplegar con miedo y desplegar con confianza. Usando <strong>GitHub Actions con AWS ECS</strong> puedes tener un flujo completo — build, test, push a ECR y deploy — corriendo en menos de 4 minutos por commit.</p>
      <p>La clave está en la <strong>caché de capas Docker</strong> y en paralelizar los jobs de testing. GitHub Actions 2026 soporta caché compartida entre workflows del mismo repositorio, reduciendo el tiempo de build de imágenes pesadas hasta un 60%.</p>
      <h3>Estructura del Workflow</h3>
      <ul>
        <li><strong>Job 1 — Test:</strong> Corre la suite de tests con <code>matrix strategy</code> en Node 20 y 22 en paralelo. Si falla uno, el pipeline se detiene.</li>
        <li><strong>Job 2 — Build & Push:</strong> Construye la imagen con <code>docker/build-push-action@v5</code>, etiquétala con el SHA del commit y súbela a ECR usando <code>aws-actions/amazon-ecr-login</code>.</li>
        <li><strong>Job 3 — Deploy:</strong> Actualiza el task definition de ECS con la nueva imagen y llama a <code>aws-actions/amazon-ecs-deploy-task-definition</code>.</li>
      </ul>
      <p>Guarda <code>AWS_ACCESS_KEY_ID</code> y <code>AWS_SECRET_ACCESS_KEY</code> como GitHub Secrets y usa un IAM role con permisos mínimos: solo <code>ecr:GetAuthorizationToken</code>, <code>ecs:UpdateService</code> y <code>ecs:RegisterTaskDefinition</code>.</p>
      <p>Para producción, agrega un paso de <em>manual approval</em> usando <code>environment: production</code> con reviewers requeridos. El pipeline esperará confirmación antes de desplegar, manteniendo el control sin sacrificar la velocidad de entrega.</p>
    `
  },

  // ── NETWORKS ────────────────────────────────────────────────────────
  {
    category: "networks",
    title: "TP-Link Archer BE550: Elimina el Doble NAT con Wi-Fi 7 y Modo Puente",
    summary: "Guía para extraer tus credenciales PPPoE del módem del ISP y configurar el Archer BE550 como router principal con MLO activo.",
    date: new Date().toISOString(),
    content_html: `
      <p>El <strong>TP-Link Archer BE550</strong> es uno de los routers Wi-Fi 7 mejor valorados de 2026 por su soporte completo de MLO (Multi-Link Operation) y firmware estable. Sin embargo, su potencial se desperdicia si opera detrás del router del ISP creando un <strong>doble NAT</strong> que eleva la latencia y rompe el port forwarding.</p>
      <p>La solución es poner el módem ISP en <em>modo puente (bridge)</em> y delegar todo el ruteo al Archer BE550. Para eso necesitas las credenciales PPPoE que tu ISP configuró en el equipo original.</p>
      <h3>Paso 1: Extraer Credenciales PPPoE</h3>
      <ul>
        <li>Accede al módem ISP en <code>192.168.1.1</code> o <code>192.168.0.1</code></li>
        <li>La contraseña aparece enmascarada — usa DevTools del navegador: clic derecho sobre el campo → Inspeccionar → cambia <code>type="password"</code> a <code>type="text"</code></li>
        <li>Anota usuario y contraseña exactamente (distingue mayúsculas y caracteres especiales)</li>
      </ul>
      <h3>Paso 2: Activar Bridge Mode</h3>
      <p>En el panel del módem busca <em>Bridge Mode</em>, <em>IP Passthrough</em> o <em>DMZ</em> según el fabricante. Apunta la MAC del puerto WAN del Archer BE550 si tu ISP requiere registro. Tras aplicar, el módem dejará de asignar IPs y pasará la conexión directo al router.</p>
      <h3>Paso 3: Configurar PPPoE en el Archer BE550</h3>
      <ul>
        <li>Entra a <code>192.168.0.1</code> o usa la app <em>Tether</em></li>
        <li>Ve a <em>Advanced → Network → Internet</em> y selecciona tipo <strong>PPPoE</strong></li>
        <li>Ingresa las credenciales extraídas y activa <strong>MLO</strong> en la sección Wi-Fi 7</li>
      </ul>
      <p>Resultado: tu IP pública aparece directamente en el BE550, el ping baja entre 2–8 ms y el port forwarding funciona sin configuraciones adicionales. Dispositivos Samsung Galaxy S25 Ultra y Galaxy Tab S10 notarán mejora inmediata en la banda de 6 GHz.</p>
    `
  },
  {
    category: "networks",
    title: "ASUS RT-BE96U: QoS Avanzado para Gaming 4K y Red Doméstica sin Sacrificios",
    summary: "Configura el QoS del RT-BE96U para priorizar consolas y streaming 4K sobre el resto de dispositivos, sin afectar la experiencia del resto de la red.",
    date: new Date().toISOString(),
    content_html: `
      <p>El <strong>ASUS RT-BE96U</strong> es el router Wi-Fi 7 de gama alta más capaz de 2026, con puerto WAN de 10 Gbps y soporte para hasta 200 dispositivos. Su firmware <em>Asuswrt</em> incluye un <strong>QoS adaptativo</strong> que, correctamente configurado, garantiza latencia estable para gaming incluso cuando otros dispositivos descargan a máxima velocidad.</p>
      <p>El error más común es dejar el QoS en modo automático. Para redes mixtas con consolas, PCs y TVs 4K, la configuración manual por prioridad de dispositivo da resultados notablemente superiores al modo automático.</p>
      <h3>Configuración de Prioridades</h3>
      <ul>
        <li><strong>Prioridad 1 — Gaming:</strong> Asigna alta prioridad a las IPs de PS5, Xbox o PC. El RT-BE96U identifica tráfico UDP de juegos con DPI (Deep Packet Inspection) automáticamente.</li>
        <li><strong>Prioridad 2 — Streaming 4K:</strong> Netflix, Disney+ y YouTube usan TCP estable. Prioridad media-alta para evitar buffering durante sesiones de juego simultáneas.</li>
        <li><strong>Prioridad 3 — IoT y resto:</strong> Descargas y dispositivos domésticos van al final. El router limita su ancho de banda cuando hay congestión.</li>
      </ul>
      <p>Activa también <strong>WTFast Game Accelerator</strong> disponible en Asuswrt para PCs por Ethernet: enruta el tráfico de juegos por rutas de menor latencia en lugar de la ruta BGP estándar del ISP, reduciendo el jitter hasta un 40% en servidores distantes.</p>
      <p>Para Wi-Fi 7, crea una SSID exclusiva en la banda de <strong>6 GHz</strong> solo para dispositivos gaming y streaming. Aislar este tráfico elimina la interferencia de dispositivos IoT que compiten por el canal y es la mejora más visible en experiencia de juego.</p>
    `
  },

  // ── GAMING ──────────────────────────────────────────────────────────
  {
    category: "gaming",
    title: "Platino Ghost of Tsushima: Ruta Completa en 25 Horas sin Perderte Nada",
    summary: "Orden óptimo para liberar regiones, conseguir todos los coleccionables y llegar al crédito final con el 90% del platino ya desbloqueado.",
    date: new Date().toISOString(),
    content_html: `
      <p>Ghost of Tsushima tiene uno de los platinos más satisfactorios de PlayStation: no requiere dificultad específica, no hay trofeos missables críticos y el mundo es un placer de explorar. Con la ruta correcta puedes conseguirlo en <strong>25–30 horas</strong> en la primera partida.</p>
      <p>El error que alarga el platino innecesariamente es explorar libremente desde el inicio. La estrategia óptima es <strong>liberar todos los campamentos mongoles de una región antes de avanzar al siguiente acto</strong>: al completar una región el juego revela todos los iconos del mapa, incluidos los coleccionables ocultos.</p>
      <h3>Orden Recomendado</h3>
      <ul>
        <li><strong>Izuhara (Acto 1):</strong> Libera todos los campamentos y bastiones primero. Equipa el <em>Atuendo del Viajero</em> y presiona el D-pad para rastrear artefactos con el viento dorado.</li>
        <li><strong>Toyotama (Acto 2):</strong> Prioriza las Historias de los Supervivientes para desbloquear mejoras. Sube la espada a nivel máximo antes del Acto 3.</li>
        <li><strong>Kamiagata (Acto 3):</strong> La región más densa en coleccionables. Con las dos anteriores completadas, el mapa estará casi totalmente revelado.</li>
      </ul>
      <p>Para los <strong>Santuarios Shinto</strong> (el trofeo más tedioso), activa el rastreo desde el mapa y sigue el viento antes de subir. Los santuarios en zonas elevadas desorientan la cámara — cálmala con L2 y sube metódicamente por el camino marcado.</p>
      <p>El <strong>modo foto</strong> tiene su propio trofeo: usa todas las categorías de filtros al menos una vez durante la partida. Hazlo de forma casual. Con esta ruta llegarás a los créditos finales con el <strong>85–90% del platino</strong> ya desbloqueado.</p>
    `
  },
  {
    category: "gaming",
    title: "Lies of P en PC: Elimina Stutters y Reduce Jitter para Dominar los Parries",
    summary: "Tweaks de Engine.ini y configuración de red para eliminar los shader compilation stutters y garantizar timing preciso en los combates contra jefes.",
    date: new Date().toISOString(),
    content_html: `
      <p>Lies of P es uno de los Souls-like más exigentes en timing: las ventanas de parry miden milisegundos. Un stutter de 50ms o un pico de jitter en la conexión arruinan combates que de otro modo ejecutarías perfectamente. Aquí están los ajustes que realmente marcan diferencia.</p>
      <p>El problema principal en PC es que Lies of P usa <strong>Unreal Engine 5</strong> con compilación de shaders en tiempo real. Los famosos <em>shader compilation stutters</em> aparecen la primera vez que el juego renderiza cada efecto. La solución es forzar la precompilación completa desde Engine.ini.</p>
      <h3>Tweaks de Engine.ini</h3>
      <ul>
        <li>Localiza el archivo en <code>%LOCALAPPDATA%\LiesofP\Saved\Config\WindowsNoEditor\Engine.ini</code></li>
        <li>Agrega <code>r.ShaderPipelineCache.Enabled=1</code> y <code>r.ShaderPipelineCache.Mode=2</code> para compilación en background</li>
        <li>Usa <code>r.GTSyncType=1</code> para sincronizar el hilo de render con la GPU y eliminar micro-stutters</li>
        <li>Agrega <code>r.DynamicRes.OperationMode=0</code> si prefieres resolución fija sobre dinámica</li>
      </ul>
      <h3>Reducción de Jitter en Red</h3>
      <p>Para modo cooperativo o invasiones, un jitter mayor a 15ms desincroniza los ataques de otros jugadores. La solución más efectiva es <strong>priorizar tráfico UDP de Steam</strong> en el QoS del router para que los paquetes del juego no compitan con descargas en segundo plano.</p>
      <p>En Wi-Fi, desactiva el modo de ahorro de energía del adaptador en Windows: <em>Administrador de dispositivos → Propiedades del adaptador → Administración de energía → desactivar "permitir que el equipo apague este dispositivo"</em>. Este cambio por sí solo reduce el jitter en Wi-Fi hasta un 30% y es el primer ajuste que debes hacer antes de cualquier configuración de red.</p>
    `
  }
];

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
    "datePublished":  article.date,
    "dateModified":   article.date,
    "inLanguage":     "es",
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

  articles.forEach(article => {
    const container = document.getElementById(`container-${article.category}`);
    if (!container) return;

    counts[article.category] = (counts[article.category] || 0) + 1;

    const readTime   = calcReadTime(article.content_html);
    const dateLabel  = formatDate(article.date || new Date().toISOString());
    const finalHtml  = injectAds(article.content_html);

    injectArticleSchema(article);

    const card = document.createElement('article');
    card.className  = 'article-card';
    card.setAttribute('itemscope', '');
    card.setAttribute('itemtype', 'https://schema.org/NewsArticle');

    const isNew = new Date() - new Date(article.date) < 86400000 * 2;

    card.innerHTML = `
      <div class="card-stripe"></div>
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
  Object.entries(counts).forEach(([cat, n]) => {
    const el = document.getElementById(`count-${cat}`);
    if (el) el.textContent = `${n} art.`;
  });
}

document.addEventListener('DOMContentLoaded', renderArticles);
