/* ═══════════════════════════════════════════════════════════════════
   TechForge — Datos semilla (fuente única de verdad)
   Se usa en dos entornos:
     · Navegador  → expone window.SEED_DATA (fallback si la API falla)
     · Node/seed  → require('./seed-data.js') para poblar PostgreSQL
   ═══════════════════════════════════════════════════════════════════ */
(function (root, factory) {
  const data = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = data;            // Node (seed.js)
  } else {
    root.SEED_DATA = data;            // Navegador (app.js)
  }
})(typeof self !== 'undefined' ? self : this, function () {

  // Imágenes de Unsplash por categoría (sin API key requerida)
  const images = {
    devops: [
      'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=700&q=80',
      'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=700&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=700&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&q=80',
    ],
    networks: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=700&q=80',
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=700&q=80',
      'https://images.unsplash.com/photo-1605146769289-52f427ec6f21?w=700&q=80',
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=700&q=80',
    ],
    gaming: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=700&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=700&q=80',
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=700&q=80',
      'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=700&q=80',
    ],
  };

  const articles = [
    // ── DEVOPS ──────────────────────────────────────────────────────
    {
      category: "devops",
      slug: "n8n-jira-2026-triaje-tickets",
      title: "n8n + Jira 2026: Automatiza tu Triaje de Tickets en 15 Minutos",
      summary: "Configura un flujo no-code que detecta nuevos issues, los clasifica por prioridad y notifica al equipo en Slack sin escribir una línea de código.",
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
      slug: "github-actions-aws-ecs-pipeline-cicd",
      title: "GitHub Actions + AWS ECS: Pipeline CI/CD que Despliega en 4 Minutos",
      summary: "Pipeline completo de integración y entrega continua con caché de capas Docker, testing en matriz y deploy automático a ECS en cada push a main.",
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
    {
      category: "devops",
      slug: "backstage-argocd-internal-developer-platform",
      title: "Backstage + ArgoCD: Tu Internal Developer Platform Lista en 30 Minutos",
      summary: "Monta un portal de desarrolladores con Backstage que centraliza servicios, docs y pipelines, y conéctalo con ArgoCD para GitOps automático desde el día uno.",
      content_html: `
      <p>Platform Engineering es la tendencia DevOps más fuerte de 2026. Según Gartner, el 80% de grandes organizaciones de software tendrán equipos de plataforma este año — y <strong>Backstage</strong> de Spotify se ha convertido en el estándar de facto para Internal Developer Platforms (IDP).</p>
      <p>La propuesta de valor es simple: en lugar de que cada desarrollador sepa dónde están los docs, los pipelines y las dependencias de cada microservicio, <strong>Backstage centraliza todo en un portal</strong> con catalog, TechDocs y templates de scaffolding.</p>
      <h3>Setup Básico</h3>
      <ul>
        <li><strong>Instalación:</strong> Corre <code>npx @backstage/create-app@latest</code> y selecciona el template por defecto. El proceso genera una app completa en minutos.</li>
        <li><strong>Software Catalog:</strong> Registra tus microservicios con archivos <code>catalog-info.yaml</code> en cada repo. Backstage los descubre automáticamente vía GitHub integration.</li>
        <li><strong>TechDocs:</strong> Activa el plugin de documentación y tus <code>mkdocs</code> existentes aparecen renderizados dentro del portal sin configuración extra.</li>
        <li><strong>ArgoCD Plugin:</strong> Instala <code>@backstage/plugin-argocd</code> para ver el estado de despliegue de cada servicio directamente en su ficha del catalog.</li>
      </ul>
      <p>El resultado es que un desarrollador nuevo puede entender toda la arquitectura de la empresa en su primer día, ver el estado de salud de los servicios en tiempo real y lanzar nuevos proyectos con templates pre-configurados que siguen los estándares del equipo.</p>
      <p>Para integrarlo con <strong>ArgoCD</strong>, apunta cada Application a la rama <code>main</code> del repo de manifiestos de Kubernetes. Backstage consulta la API de ArgoCD y muestra sincronización, health y últimos deploys sin salir del portal.</p>
    `
    },
    {
      category: "devops",
      slug: "karpenter-aws-eks-autoscaling-costos",
      title: "Karpenter en AWS EKS: Auto-Scaling que Recorta Costos un 40%",
      summary: "Reemplaza el Cluster Autoscaler con Karpenter para aprovisionamiento de nodos en segundos, uso de instancias Spot y consolidación automática que elimina capacidad ociosa.",
      content_html: `
      <p><strong>Karpenter</strong> es el reemplazo moderno del Cluster Autoscaler para AWS EKS: mientras el autoscaler tarda 3–5 minutos en aprovisionar un nodo nuevo, Karpenter lo hace en menos de 60 segundos aprovisionando directamente desde la API de EC2, sin grupos de Auto Scaling intermedios.</p>
      <p>La diferencia real está en la inteligencia de selección de instancias. Karpenter evalúa los requirements de los pods pendientes y escoge la instancia EC2 más eficiente en precio/recurso en tiempo real, incluyendo instancias Spot cuando son elegibles.</p>
      <h3>Instalación con Helm</h3>
      <ul>
        <li>Crea el IRSA (IAM Role for Service Account) con permisos <code>ec2:RunInstances</code>, <code>ec2:TerminateInstances</code> y <code>pricing:GetProducts</code>.</li>
        <li>Instala con <code>helm install karpenter oci://public.ecr.aws/karpenter/karpenter --namespace karpenter</code> pasando el cluster endpoint y el role ARN.</li>
        <li>Define un <code>NodePool</code> con las familias de instancia permitidas (<code>m6i</code>, <code>c6i</code>, <code>r6i</code>) y los tipos de capacidad (<code>on-demand</code>, <code>spot</code>).</li>
      </ul>
      <h3>Consolidation: El Feature que Justifica la Migración</h3>
      <p>Activa <code>disruption.consolidationPolicy: WhenUnderutilized</code> en el NodePool y Karpenter evaluará continuamente si varios nodos pequeños pueden reemplazarse por uno más grande con menor costo. En cargas de trabajo variables, esta consolidación automática elimina entre el 20% y 40% del gasto en cómputo sin intervención manual.</p>
      <p>El playbook de 2026 para EKS es: Karpenter para scaling, KEDA para scaling a nivel de workload y VPA para right-sizing de pods. Los tres juntos dan control granular del costo de infraestructura que el autoscaler clásico simplemente no puede ofrecer.</p>
    `
    },

    // ── NETWORKS ────────────────────────────────────────────────────
    {
      category: "networks",
      slug: "tplink-archer-be550-doble-nat-wifi7",
      title: "TP-Link Archer BE550: Elimina el Doble NAT con Wi-Fi 7 y Modo Puente",
      summary: "Guía para extraer tus credenciales PPPoE del módem del ISP y configurar el Archer BE550 como router principal con MLO activo.",
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
      slug: "asus-rt-be96u-qos-gaming-4k",
      title: "ASUS RT-BE96U: QoS Avanzado para Gaming 4K y Red Doméstica sin Sacrificios",
      summary: "Configura el QoS del RT-BE96U para priorizar consolas y streaming 4K sobre el resto de dispositivos, sin afectar la experiencia del resto de la red.",
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
    {
      category: "networks",
      slug: "eero-pro-7-vs-asus-zenwifi-bq16-pro",
      title: "eero Pro 7 vs ASUS ZenWiFi BQ16 Pro: ¿Cuál Mesh Wi-Fi 7 Vale la Pena en 2026?",
      summary: "Comparativa real de velocidades, backhaul y facilidad de configuración entre los dos mejores sistemas mesh Wi-Fi 7 del año para casas medianas y grandes.",
      content_html: `
      <p>En 2026, los sistemas mesh Wi-Fi 7 han madurado lo suficiente para que valga la pena actualizar — especialmente si tu conexión supera los 500 Mbps o tienes una casa de más de 120 m². Las dos opciones más recomendadas son el <strong>eero Pro 7</strong> (mejor para facilidad de uso) y el <strong>ASUS ZenWiFi BQ16 Pro</strong> (mejor para máxima velocidad y control avanzado).</p>
      <p>El eero Pro 7 cubre hasta 4,200 m² con un pack de 2 nodos a $449 USD, y destaca por su configuración en menos de 10 minutos desde la app. El ZenWiFi BQ16 Pro entrega velocidades de hasta 3.5 Gbps en la banda de 6 GHz, con arquitectura quad-band que dedica una banda completa al backhaul.</p>
      <h3>¿Cuándo Elegir Cada Uno?</h3>
      <ul>
        <li><strong>eero Pro 7:</strong> Casa de tamaño normal, varios usuarios no técnicos, integración con Alexa/Amazon, sin necesidad de configuración avanzada de QoS o VLANs.</li>
        <li><strong>ZenWiFi BQ16 Pro:</strong> Gamers o trabajadores remotos que necesitan máxima velocidad, quieren control granular de QoS, VPN integrada en el router o VLAN por SSID.</li>
        <li><strong>MSI Roamii BE Pro:</strong> Mejor opción bajo $300 para dos nodos — rendimiento sólido sin gastar en el top de gama.</li>
      </ul>
      <p>Lo que todos los sistemas Wi-Fi 7 mesh comparten es el <strong>backhaul inalámbrico dedicado</strong>: la comunicación entre nodos no compite con tus dispositivos por la misma banda, lo que elimina el cuello de botella que arruinaba los sistemas mesh Wi-Fi 6 en casas grandes.</p>
      <p>Si ya tienes un sistema Wi-Fi 6E funcionando bien, no hay urgencia de actualizar. Pero si compras equipo nuevo hoy, el delta de costo entre Wi-Fi 6E y Wi-Fi 7 es de $100–300 y la diferencia en cobertura y latencia lo justifica claramente.</p>
    `
    },
    {
      category: "networks",
      slug: "backhaul-dedicado-wifi7-velocidad",
      title: "Backhaul Dedicado Wi-Fi 7: La Configuración que Duplica tu Velocidad en Toda la Casa",
      summary: "Cómo activar y verificar que el backhaul inalámbrico de tu sistema mesh usa la banda de 6 GHz exclusiva, separada completamente del tráfico de clientes.",
      content_html: `
      <p>El punto débil de la mayoría de sistemas mesh Wi-Fi 6 era el <strong>backhaul compartido</strong>: los nodos satélite se comunicaban con el nodo principal usando la misma banda que tus dispositivos, dividiendo el ancho de banda disponible y creando cuello de botella en casas grandes.</p>
      <p>Wi-Fi 7 resuelve esto de forma definitiva con la banda de <strong>6 GHz reservada exclusivamente para backhaul</strong> en los sistemas que lo soportan. El resultado es que los nodos satélite tienen su propio "canal privado" y tus dispositivos obtienen el ancho de banda completo de las bandas 2.4 GHz y 5 GHz.</p>
      <h3>Cómo Verificar que el Backhaul Está Separado</h3>
      <ul>
        <li>En ASUS ZenWiFi: ve a <em>System Log → Wireless Log</em> y confirma que los nodos satélite se conectan en la banda <code>6G-1</code> o <code>6G-2</code> dedicada al backhaul, no en la banda de clientes.</li>
        <li>En TP-Link Deco XE200: la app muestra el canal del backhaul en la vista de cada nodo — debe indicar "6 GHz Backhaul" separado de la conexión de clientes.</li>
        <li>En eero Pro 7: la app no muestra detalles de backhaul, pero puedes verificarlo con un speedtest desde un dispositivo conectado al nodo satélite — si la velocidad supera el 70% de la del nodo principal, el backhaul dedicado está activo.</li>
      </ul>
      <h3>Posicionamiento Óptimo de Nodos</h3>
      <p>Para que el backhaul inalámbrico funcione al máximo, los nodos deben estar <strong>a menos de 10 metros entre sí con línea de visión</strong> o separados por una sola pared. A más distancia, el backhaul degrada aunque tenga banda dedicada.</p>
      <p>Si los nodos quedan a más de 15 metros, la solución más efectiva es el <strong>backhaul por cable Ethernet</strong>: conecta los nodos por cable de categoría 6A y desactiva el backhaul inalámbrico. Ganarás latencia ultrabaja y velocidades teóricas de hasta 10 Gbps en los sistemas de gama alta.</p>
    `
    },

    // ── GAMING ──────────────────────────────────────────────────────
    {
      category: "gaming",
      slug: "platino-ghost-of-tsushima-ruta-completa",
      title: "Platino Ghost of Tsushima: Ruta Completa en 25 Horas sin Perderte Nada",
      summary: "Orden óptimo para liberar regiones, conseguir todos los coleccionables y llegar al crédito final con el 90% del platino ya desbloqueado.",
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
      slug: "lies-of-p-pc-stutters-jitter-parries",
      title: "Lies of P en PC: Elimina Stutters y Reduce Jitter para Dominar los Parries",
      summary: "Tweaks de Engine.ini y configuración de red para eliminar los shader compilation stutters y garantizar timing preciso en los combates contra jefes.",
      content_html: `
      <p>Lies of P es uno de los Souls-like más exigentes en timing: las ventanas de parry miden milisegundos. Un stutter de 50ms o un pico de jitter en la conexión arruinan combates que de otro modo ejecutarías perfectamente. Aquí están los ajustes que realmente marcan diferencia.</p>
      <p>El problema principal en PC es que Lies of P usa <strong>Unreal Engine 5</strong> con compilación de shaders en tiempo real. Los famosos <em>shader compilation stutters</em> aparecen la primera vez que el juego renderiza cada efecto. La solución es forzar la precompilación completa desde Engine.ini.</p>
      <h3>Tweaks de Engine.ini</h3>
      <ul>
        <li>Localiza el archivo en <code>%LOCALAPPDATA%\\LiesofP\\Saved\\Config\\WindowsNoEditor\\Engine.ini</code></li>
        <li>Agrega <code>r.ShaderPipelineCache.Enabled=1</code> y <code>r.ShaderPipelineCache.Mode=2</code> para compilación en background</li>
        <li>Usa <code>r.GTSyncType=1</code> para sincronizar el hilo de render con la GPU y eliminar micro-stutters</li>
        <li>Agrega <code>r.DynamicRes.OperationMode=0</code> si prefieres resolución fija sobre dinámica</li>
      </ul>
      <h3>Reducción de Jitter en Red</h3>
      <p>Para modo cooperativo o invasiones, un jitter mayor a 15ms desincroniza los ataques de otros jugadores. La solución más efectiva es <strong>priorizar tráfico UDP de Steam</strong> en el QoS del router para que los paquetes del juego no compitan con descargas en segundo plano.</p>
      <p>En Wi-Fi, desactiva el modo de ahorro de energía del adaptador en Windows: <em>Administrador de dispositivos → Propiedades del adaptador → Administración de energía → desactivar "permitir que el equipo apague este dispositivo"</em>. Este cambio por sí solo reduce el jitter en Wi-Fi hasta un 30% y es el primer ajuste que debes hacer antes de cualquier configuración de red.</p>
    `
    },
    {
      category: "gaming",
      slug: "windows-11-gaming-2026-tweaks-fps",
      title: "Windows 11 para Gaming 2026: 5 Tweaks que Suben tu FPS sin Tocar el Hardware",
      summary: "Activa HAGS, Resizable BAR, ajusta el modo de alimentación y desactiva Game Bar correctamente — cambios que impactan directamente en framerate y latencia de entrada.",
      content_html: `
      <p>La mayoría de PCs gamer en 2026 dejan FPS sobre la mesa por configuración incorrecta de Windows 11. No se trata de overclocking ni de cambiar componentes: cinco ajustes de software pueden sumar entre 10% y 25% de rendimiento en GPU mid-range como la RTX 4060 o la RX 7600.</p>
      <p>El más impactante es <strong>Hardware-Accelerated GPU Scheduling (HAGS)</strong>: en lugar de que la CPU gestione la cola de comandos para la GPU, la propia GPU lo maneja directamente. El resultado es menor latencia de entrada y menos micro-stutters en juegos con muchos drawcalls.</p>
      <h3>Los 5 Tweaks Esenciales</h3>
      <ul>
        <li><strong>HAGS:</strong> Configuración → Sistema → Pantalla → Gráficos → Programación de GPU con aceleración de hardware → Activar. Requiere reiniciar.</li>
        <li><strong>Resizable BAR:</strong> Actívalo desde la BIOS (Above 4G Decoding + Resizable BAR en configuración PCIe). Sube framerates 3–12% en juegos que lo soportan como Cyberpunk 2077 o Hogwarts Legacy.</li>
        <li><strong>Modo de alimentación:</strong> Panel de control → Opciones de energía → Plan de alto rendimiento. O en PowerShell: <code>powercfg /setactive SCHEME_MIN</code>. Elimina throttling del CPU en picos de carga.</li>
        <li><strong>Desactivar Game Bar correctamente:</strong> No basta con apagarlo desde Configuración — desactiva también el Xbox Game Monitoring desde el Editor de directivas de grupo local (<code>gpedit.msc</code>). La grabación en segundo plano consume hasta 5% de GPU.</li>
        <li><strong>Modo de juego (Game Mode):</strong> En Configuración → Juegos → Modo de juego → Activar. Asigna núcleos de CPU con prioridad al proceso del juego y reduce interferencia de procesos en segundo plano.</li>
      </ul>
      <p>Combina estos ajustes con el driver más reciente de NVIDIA o AMD — los drivers de 2026 incluyen optimizaciones específicas por juego que se traducen en 5–15 FPS adicionales en títulos populares sin ningún otro cambio. El orden importa: aplica los cambios de BIOS primero, drivers después, y tweaks de Windows al final.</p>
    `
    },
    {
      category: "gaming",
      slug: "atomfall-juegos-optimizados-gpu-mid-range",
      title: "Atomfall y los Mejores Juegos Optimizados para GPU Mid-Range en 2026",
      summary: "Los 5 títulos que mejor aprovechan GPUs como la RTX 4060 o RX 7600 este año, con configuración óptima para 1080p/144 FPS o 1440p/60 FPS estables.",
      content_html: `
      <p>Con el dominio del modelo free-to-play en 2026 y el surgimiento de estudios independientes con presupuestos ajustados, la optimización gráfica ha vuelto a ser una prioridad. <strong>Atomfall</strong> encabeza la lista de juegos más optimizados del año: una RTX 2080 Ti promedia 60 FPS en 4K Ultra, y una RTX 4060 alcanza 144 FPS en 1080p con ajustes medios-altos.</p>
      <p>La diferencia entre un juego bien optimizado y uno que no lo está es visible inmediatamente: el primero escala suavemente desde hardware básico hasta PC de gama alta sin sacrificar calidad visual. Aquí están los cinco más destacados para GPUs mid-range en 2026.</p>
      <h3>Top 5 Juegos Optimizados 2026</h3>
      <ul>
        <li><strong>Atomfall:</strong> Post-apocalíptico ambientado en Inglaterra. Gráficos de alta fidelidad con motor propio ultraeficiente. Configuración recomendada: Alta en todo, TAA, sin Ray Tracing.</li>
        <li><strong>Valorant:</strong> Construido desde cero para hardware de bajo-medio rango. Una RTX 4060 supera los 400 FPS en competitivo. Imprescindible reducir Motion Blur.</li>
        <li><strong>Avowed:</strong> RPG de Obsidian en Unreal Engine 5. Sorprendentemente bien optimizado para un juego de mundo abierto — RTX 4060 logra 1440p/60fps en Alto con DLSS Quality.</li>
        <li><strong>Where Winds Meet:</strong> Wuxia de mundo abierto con motor propio chino. Escenas de combate fluidas incluso en RX 7600 en 1080p/Ultra.</li>
        <li><strong>Path of Exile 2:</strong> La secuela del ARPG más popular llega optimizada para nuevas APIs (DirectX 12 Ultimate). En 1080p/Medio, la RX 7600 supera los 120 FPS estables en las zonas más densas.</li>
      </ul>
      <p>El patrón común en todos estos juegos es el uso de <strong>upscaling moderno</strong>: DLSS 4, FSR 4 o XeSS 2 a calidad "Quality" o "Balanced" te da calidad visual equivalente a resolución nativa a la mitad del costo de rendimiento. Actívalo siempre en lugar de reducir la resolución renderizada manualmente.</p>
    `
    }
  ];

  return { images, articles };
});
