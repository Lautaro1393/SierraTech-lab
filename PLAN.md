# SierraTech Lab — Plan de Trabajo v2

Roadmap de ejecución para la reconstrucción del sitio. Define **en qué orden** se hace cada cosa, qué archivo se toca, qué se valida y qué queda fuera de scope.

> **Convención**: cada paso es ejecutable y verificable. No se avanza al siguiente paso sin que el anterior esté commiteado (no en `main` necesariamente, pero al menos en un commit del working tree).

---

## Estado del proyecto (post-docs)

| Documento | Estado |
|---|---|
| `spec.md` | ✅ escrito, pendiente revisión |
| `design.md` | ✅ escrito, pendiente revisión |
| `PLAN.md` | ✅ este documento |

**Próximo gate**: revisión y aprobación de los 3 documentos antes de tocar código.

---

## Roadmap general

```
FASE 0 — Aprobación docs         [AHORA]
FASE 1 — Refactor de assets       [datos y archivos]
FASE 2 — Datos del portafolio     [JSON + estructura]
FASE 3 — Markup y CSS base        [HTML + tokens]
FASE 4 — Interactividad JS       [render + lightbox + theme]
FASE 5 — Deploy-ready             [archivos de soporte]
FASE 6 — QA y commit              [validación final]
```

Cada fase es una **unidad de trabajo commiteable**. La idea es que en cualquier momento se pueda volver a un estado funcional con `git checkout <commit-de-fase-X>`.

---

## FASE 0 — Aprobación de documentos

**Owner**: Lautaro + opencode en loop de revisión.

**Output**: los 3 archivos (`spec.md`, `design.md`, `PLAN.md`) aprobados.

**Tareas**:

- [ ] Revisar `spec.md`: ¿las secciones y el modelo de datos reflejan lo que querés?
- [ ] Revisar `design.md`: ¿la paleta, la tipografía y los componentes se sienten como tu marca?
- [ ] Revisar este `PLAN.md`: ¿el orden y la granularidad de las fases te sirven?
- [ ] Ajustar lo que haga falta. Si el cambio es grande, actualizar los 3 docs en consistencia.
- [ ] Marcar Fase 0 como completa → commit "docs: spec, design y plan para v2".

**Salida del commit** (referencia, no textual):

```
docs: especificación, design system y plan de trabajo v2
- spec.md: contexto, secciones, modelo de datos, a11y, perf, SEO, deploy
- design.md: tokens, componentes, patrones, motion
- PLAN.md: roadmap en 7 fases
```

---

## FASE 1 — Refactor de assets

**Objetivo**: tener un sistema de archivos limpio, con nombres semánticos y sin basura. Esta fase **no toca código** (HTML/CSS/JS), solo archivos en `img/` y dos archivos borrados.

### 1.1 Auditoría de imágenes actuales

**Acción**: revisar las 10 fotos en `img/Reparaciones/` y las 3 fotos en `img/` raíz. Decidir:

- Cuáles se renombran (las 10 de reparaciones, sí).
- Cuáles se borran (las 2 IA sin usar, candidato).
- Cuáles se mueven (hero actual → `hero-bg.webp`).

**Output**: una lista confirmada de origen → destino. Ej:

| Actual | Destino | Acción |
|---|---|---|
| `img/Gemini_Generated_Image_l23ckil23ckil23c.webp` | `img/hero-bg.webp` | Renombrar |
| `img/Gemini_Generated_Image_l8i5bhl8i5bhl8i5.webp` | — | **Borrar** (190 KB) |
| `img/Gemini_Generated_Image_ud6m70ud6m70ud6m.webp` | — | **Borrar** (43 KB) |
| `img/preview.webp` | `img/preview.webp` | Mantener |
| `img/Reparaciones/IMG_20250424_200914978_AE.webp` | `img/Reparaciones/reconstruccion-pistas-01.webp` (u otro) | Renombrar tras asignación |
| … | … | … |

### 1.2 Asignación de fotos a repairs

**Acción**: revisar las 10 fotos y asignar a cada uno de los 6 repairs las que correspondan por contenido. Esto **resuelve el bug actual** de fotos duplicadas entre cards (ej. `IMG_20251223_005815010_AE.webp` aparecía en 2 repairs distintos).

**Output**: tabla de mapeo foto → repair. Las que sobren quedan en disco sin referencia, no se borran (material de referencia).

**Acción paralela**: tomar/elegir una screenshot del deploy de `LaCocinaDeJose` → `img/proyectos/la-cocina-de-jose.webp`. Si todavía no hay, se puede usar un placeholder hasta que esté.

### 1.3 Nuevos assets a crear

| Archivo | Tipo | Origen | Notas |
|---|---|---|---|
| `img/logo.svg` | Vector | Vectorizar `SIERRA TECH_LAB` actual | SVG inline, sin archivo (o archivo, decidir) |
| `img/favicon.svg` | Vector | Derivado del logo, versión corta `ST·L` | Data URI en el `<head>` o archivo |
| `img/og-cover.webp` | Bitmap 1200x630 | Composición logo + tagline | Una sola vez, no se regenera |

### 1.4 Renombrado físico

**Acción**: `git mv` o `mv` + `git add` para cada renombrado. Si se renombran muchos archivos, un script bash con `for f in …; do mv "$f" "${f/_AE.webp/.webp}"; done` (sed seguro) acelera.

**Verificación**: `git status` muestra los renames detectados (Git los detecta como tal si el contenido no cambia). `git diff --stat` muestra ~10 archivos renombrados + 2 borrados.

### 1.5 Commit

```
chore: refactor de assets y naming semántico de imágenes
- renombrar hero a hero-bg.webp
- borrar 2 imágenes IA sin usar (233 KB liberados)
- renombrar 10 fotos de reparaciones con slug semántico
- añadir logo.svg, favicon.svg, og-cover.webp
```

---

## FASE 2 — Datos del portafolio

**Objetivo**: tener `data/portfolio.json` con el shape definido en `spec.md §4`, poblado con los 6 items hardware (migrados) y al menos 1 item software (LaCocinaDeJose).

### 2.1 Crear el archivo

**Archivo nuevo**: `data/portfolio.json`

### 2.2 Poblar items hardware

Para cada uno de los 6 repairs, escribir un item con:

- `id`: `hw-<slug>`
- `tipo`: `"hardware"`
- `slug`: kebab-case corto
- `titulo`: el caption actual
- `categoria`: una de ["Micro-soldadura", "Reemplazo de componentes", "Mantenimiento", "Diagnóstico"]
- `fecha`: revisar metadata EXIF o aproximar (los nombres de archivo tienen timestamps en formato `IMG_YYYYMMDD`)
- `descripcionCorta`: 1 línea
- `descripcionLarga`: 2–4 líneas, redactadas en voz de SierraTech
- `fotos[]`: 2–4 items con `src` (apuntando a los archivos renombrados en Fase 1) + `alt` descriptivo
- `tags[]`: 2–4 tags cortos (ej. `["MacBook", "SMD", "pista"]`)

**Acción concreta**: completar la tabla:

| # | Slug | Repair | Categoría | Fotos asignadas |
|---|---|---|---|---|
| 1 | reconstruccion-pistas | Reconstrucción de pistas | Micro-soldadura | (asignar en 1.2) |
| 2 | limpieza-quimica-sulfato | Limpieza química de sulfato | Mantenimiento | (asignar en 1.2) |
| 3 | pin-de-carga | Reparación de pin de carga | Micro-soldadura | (asignar en 1.2) |
| 4 | cambio-bateria | Cambio de batería | Reemplazo de componentes | (asignar en 1.2) |
| 5 | conector-fpc | Cambio de conector FPC | Reemplazo de componentes | (asignar en 1.2) |
| 6 | mantenimiento-preventivo | Mantenimiento preventivo | Mantenimiento | (asignar en 1.2) |

### 2.3 Poblar item software

Para `LaCocinaDeJose`:

- `id`: `sw-la-cocina-de-jose`
- `tipo`: `"software"`
- `slug`: `la-cocina-de-jose`
- `titulo`: `LaCocinaDeJose`
- `categoria`: `Web a medida`
- `fecha`: `2026-06-15` (o fecha real de deploy, ajustar)
- `descripcionCorta`: 1 línea sobre qué es
- `descripcionLarga`: 3–5 líneas
- `cover`: `img/proyectos/la-cocina-de-jose.webp`
- `stack[]`: `["HTML", "CSS", "JavaScript", "Vercel"]` (ajustar al stack real)
- `links.deploy`: URL real de Vercel
- `links.repo`: URL real del repo GitHub

### 2.4 Validación del shape

**Acción**: validar manualmente que el JSON parsea y cumple el shape de `spec.md §4.2`. Opcional: escribir un script de validación Node de 10 líneas que se ejecute con `node -e` y haga las checks. **Opcional**, no se commitea en esta fase.

### 2.5 Commit

```
feat(data): portafolio en JSON con 6 items hardware + 1 software
- crea data/portfolio.json con shape definido en spec
- migra los 6 repairs actuales con descripciones
- añade LaCocinaDeJose como primer item software
- resuelve duplicación de fotos entre repairs
```

---

## FASE 3 — Markup y CSS base

**Objetivo**: tener `index.html` semántico, `styles.css` con todos los tokens y componentes base (estáticos, sin interactividad). El sitio se ve "bien" pero el portafolio se renderiza como un placeholder o queda vacío (la lógica de `fetch()` viene en Fase 4).

### 3.1 Estructura de `index.html`

```
<!doctype html>
<html lang="es-AR">
  <head>
    <meta charset>
    <meta viewport>
    <title>
    <meta description>
    <meta theme-color>
    <link rel="icon" data-uri svg>
    <link rel="preconnect" google fonts>
    <link rel="preconnect" google fonts gstatic>
    <link rel="stylesheet" google fonts>
    <link rel="stylesheet" styles.css>
    <meta og:*>
    <meta twitter:*>
    <script type="application/ld+json"> (JSON-LD LocalBusiness)
    <script> (theme init inline, 5 líneas)
  </head>
  <body>
    <a href="#main" class="skip-link">Saltar al contenido</a>
    <header>
      <a class="logo">[SVG inline]</a>
      <nav> [4 links + theme toggle + whatsapp] </nav>
      <button class="hamburger" aria-label="Menú"> [SVG menu] </button>
    </header>
    <main id="main">
      <section id="top" class="hero">
        <div class="hero__bg"></div>
        <div class="hero__content">
          <p class="eyebrow">// Sierra Tech Lab</p>
          <h1>Arquitectura Tecnológica</h1>
          <p class="hero__subtitle">...</p>
          <div class="hero__ctas">
            <a href="#portafolio" class="btn btn--primary">Ver reparaciones</a>
            <a href="#portafolio" class="btn btn--ghost">Ver proyectos</a>
          </div>
          <a href="#servicios" class="hero__scroll-indicator" aria-label="Ir a servicios">[arrow-down]</a>
        </div>
      </section>
      
      <section id="servicios" class="section">
        <header class="section__header">
          <span class="eyebrow">// Servicios</span>
          <h2>Lo que hacemos</h2>
        </header>
        <div class="services-grid">
          <article class="service-card"> ×4 </article>
        </div>
      </section>
      
      <section id="portafolio" class="section">
        <header class="section__header">...</header>
        <div role="tablist" class="tabs">
          <button role="tab" aria-selected="true" aria-controls="panel-hardware">Reparaciones (6)</button>
          <button role="tab" aria-selected="false" aria-controls="panel-software">Proyectos software (1)</button>
        </div>
        <div role="tabpanel" id="panel-hardware">
          <div class="portfolio-grid">
            <!-- Renderizado en Fase 4 -->
          </div>
        </div>
        <div role="tabpanel" id="panel-software" hidden>
          <div class="portfolio-grid"></div>
        </div>
      </section>
      
      <section id="sobre-mi" class="section">
        ...
      </section>
      
      <section id="contacto" class="section">
        ...
      </section>
    </main>
    
    <footer>...</footer>
    
    <div id="lightbox" role="dialog" hidden>...</div>
    
    <script src="script.js" defer></script>
  </body>
</html>
```

### 3.2 `styles.css` — Estructura

```
/* 1. Tokens (custom properties) */
:root { ... }
:root[data-theme="light"] { ... }
:root[data-theme="dark"] { ... }

/* 2. Reset minimal */
*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; }

/* 3. Tipografía base */
body { font-family, font-size, line-height, color, background }

/* 4. Utilities */
.container, .visually-hidden, .skip-link

/* 5. Layout primitives */
.section, .section__header, .grid-12

/* 6. Componentes */
.header, .hero, .service-card, .tabs, .portfolio-card, .lightbox, .btn, .chip, .footer, .form, .input-group

/* 7. Estados */
:where(a, button, .card):hover, :focus-visible, [disabled]

/* 8. Glassmorphism */
.glass, .glass--card, .glass--elev, @supports not (backdrop-filter), @media (prefers-reduced-transparency: reduce)

/* 9. Responsive */
/* mobile-first; media queries para tablet y desktop */

/* 10. Motion y accesibilidad */
@media (prefers-reduced-motion: reduce) { ... }
@media (prefers-contrast: more) { ... }
```

### 3.3 Verificación manual

- Abrir la página en el navegador (local).
- Scroll completo: header sticky, hero, servicios, portafolio (vacío o con placeholder), sobre mí, contacto, footer.
- DevTools: responsive en mobile (375px), tablet (768px), desktop (1280px).
- DevTools: toggle de tema (cambiar el `data-theme` en el `<html>` manualmente).
- Lighthouse: Accessibility ≥ 90 en este punto (sin JS, debería estar cerca del techo).

### 3.4 Commit

```
feat: estructura HTML semántica y design system CSS v2
- index.html: header, hero, secciones, footer, lightbox DOM
- styles.css: tokens, componentes, glassmorphism, responsive
- theme init inline para evitar flash
- meta tags, OG, JSON-LD
```

---

## FASE 4 — Interactividad JS

**Objetivo**: que `script.js` cargue el portafolio desde el JSON, renderice las cards, maneje tabs, abra/cierre el lightbox, y toggle de tema. Esta fase es la más densa.

### 4.1 Estructura de `script.js`

```javascript
// 1. Theme toggle
// 2. Mobile menu
// 3. Smooth scroll fallback (Safari < 15.4)
// 4. Portafolio: fetch + render + tabs
// 5. Lightbox: open/close/navigation/focus trap
// 6. Init
```

### 4.2 Implementación detallada

#### 4.2.1 Theme toggle

```javascript
const STORAGE_KEY = 'sierratech-theme';
const root = document.documentElement;

function getStoredTheme() {
  return localStorage.getItem(STORAGE_KEY);
}

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
  updateToggleAriaLabel(theme);
}

function updateToggleAriaLabel(theme) {
  const label = theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  document.querySelector('[data-theme-toggle]')?.setAttribute('aria-label', label);
}

// Init: ya hecho en inline script del <head>
// Aquí solo bind del botón
```

#### 4.2.2 Mobile menu

```javascript
const sheet = document.querySelector('[data-mobile-menu]');
const trigger = document.querySelector('[data-menu-trigger]');

function openMenu() {
  sheet.hidden = false;
  // animación: reflow + clase
  document.body.style.overflow = 'hidden';
  // focus trap dentro del sheet
}

function closeMenu() {
  // remover clase + setTimeout para hidden después de la animación
  document.body.style.overflow = '';
  trigger.focus();
}

trigger.addEventListener('click', () => sheet.hidden ? openMenu() : closeMenu());
// Click en overlay o Escape cierra
```

#### 4.2.3 Portafolio: fetch + render

```javascript
const gridHardware = document.querySelector('[data-grid="hardware"]');
const gridSoftware = document.querySelector('[data-grid="software"]');
const tabHardware = document.querySelector('[data-tab="hardware"]');
const tabSoftware = document.querySelector('[data-tab="software"]');
const panelHardware = document.querySelector('[data-panel="hardware"]');
const panelSoftware = document.querySelector('[data-panel="software"]');

let portfolioData = null;

async function loadPortfolio() {
  try {
    const res = await fetch('./data/portfolio.json');
    if (!res.ok) throw new Error('No se pudo cargar el portafolio');
    portfolioData = await res.json();
    renderPortfolio();
  } catch (err) {
    console.error(err);
    gridHardware.innerHTML = '<p class="error">No se pudieron cargar las reparaciones.</p>';
  }
}

function renderPortfolio() {
  const hardware = portfolioData.items.filter(i => i.tipo === 'hardware');
  const software = portfolioData.items.filter(i => i.tipo === 'software');
  
  gridHardware.innerHTML = hardware.map(renderHardwareCard).join('');
  gridSoftware.innerHTML = software.map(renderSoftwareCard).join('');
  
  // Update counters in tabs
  tabHardware.querySelector('[data-tab-count]').textContent = hardware.length;
  tabSoftware.querySelector('[data-tab-count]').textContent = software.length;
  
  // Bind card click → open lightbox
  document.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('click', () => openLightbox(card.dataset.itemId));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(card.dataset.itemId);
      }
    });
  });
}

function renderHardwareCard(item) {
  return `
    <article class="portfolio-card" tabindex="0" role="button" 
             aria-label="Ver detalle de ${item.titulo}" data-item-id="${item.id}">
      <div class="portfolio-card__cover">
        <img src="${item.fotos[0].src}" alt="${item.fotos[0].alt}" loading="lazy" width="400" height="300">
      </div>
      <div class="portfolio-card__body">
        <h3 class="portfolio-card__title">${item.titulo}</h3>
        <div class="portfolio-card__meta">
          <span class="dot"></span>
          <span class="meta-label">${item.categoria}</span>
          <span class="meta-sep">·</span>
          <time datetime="${item.fecha}">${formatDate(item.fecha)}</time>
        </div>
      </div>
    </article>
  `;
}

function renderSoftwareCard(item) {
  return `
    <article class="portfolio-card" ...>
      <div class="portfolio-card__cover">
        <img src="${item.cover}" alt="..." loading="lazy" width="400" height="300">
      </div>
      <div class="portfolio-card__body">
        <h3 class="portfolio-card__title">${item.titulo}</h3>
        <div class="portfolio-card__stack">
          ${item.stack.map(s => `<span class="chip">${s}</span>`).join('')}
        </div>
        <div class="portfolio-card__meta">
          <span class="dot"></span>
          <span class="meta-label">${item.categoria}</span>
          <span class="meta-sep">·</span>
          <time datetime="${item.fecha}">${formatDate(item.fecha)}</time>
        </div>
      </div>
    </article>
  `;
}

function formatDate(iso) {
  return new Intl.DateTimeFormat('es-AR', { year: 'numeric', month: 'short' }).format(new Date(iso));
}
```

#### 4.2.4 Tabs

```javascript
function setActiveTab(name) {
  const isHardware = name === 'hardware';
  tabHardware.setAttribute('aria-selected', isHardware);
  tabSoftware.setAttribute('aria-selected', !isHardware);
  panelHardware.hidden = !isHardware;
  panelSoftware.hidden = isHardware;
  
  // Update URL hash (replaceState, no scroll)
  const newHash = isHardware ? '#portafolio' : '#portafolio/software';
  history.replaceState(null, '', newHash);
}

tabHardware.addEventListener('click', () => setActiveTab('hardware'));
tabSoftware.addEventListener('click', () => setActiveTab('software'));

// Init: leer hash
const initialHash = location.hash;
if (initialHash === '#portafolio/software') setActiveTab('software');

// Keyboard nav (ARIA tabs)
[tabHardware, tabSoftware].forEach((tab, i, tabs) => {
  tab.addEventListener('keydown', e => {
    let target;
    if (e.key === 'ArrowRight') target = tabs[(i + 1) % tabs.length];
    if (e.key === 'ArrowLeft') target = tabs[(i - 1 + tabs.length) % tabs.length];
    if (e.key === 'Home') target = tabs[0];
    if (e.key === 'End') target = tabs[tabs.length - 1];
    if (target) {
      e.preventDefault();
      target.focus();
      setActiveTab(target.dataset.tab);
    }
  });
});
```

#### 4.2.5 Lightbox

```javascript
const lightbox = document.querySelector('#lightbox');
const lbImage = lightbox.querySelector('[data-lb-image]');
const lbTitle = lightbox.querySelector('[data-lb-title]');
const lbMeta = lightbox.querySelector('[data-lb-meta]');
const lbDesc = lightbox.querySelector('[data-lb-desc]');
const lbCounter = lightbox.querySelector('[data-lb-counter]');
const lbLinks = lightbox.querySelector('[data-lb-links]');

let currentItem = null;
let currentIndex = 0;
let lastFocusedTrigger = null;

function openLightbox(itemId) {
  currentItem = portfolioData.items.find(i => i.id === itemId);
  if (!currentItem) return;
  
  currentIndex = 0;
  lastFocusedTrigger = document.activeElement;
  
  renderLightbox();
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  
  // Focus al primer focusable
  lightbox.querySelector('.lightbox__close').focus();
  
  // Bind events solo cuando está abierto (cleanup en close)
  document.addEventListener('keydown', handleLightboxKey);
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
  document.removeEventListener('keydown', handleLightboxKey);
  lastFocusedTrigger?.focus();
}

function renderLightbox() {
  const isHardware = currentItem.tipo === 'hardware';
  const media = isHardware ? currentItem.fotos : [{ src: currentItem.cover, alt: currentItem.titulo }];
  const current = media[currentIndex];
  
  lbImage.src = current.src;
  lbImage.alt = current.alt;
  lbTitle.textContent = currentItem.titulo;
  lbMeta.innerHTML = `
    <span class="dot"></span>
    <span>${currentItem.categoria}</span>
    <span class="sep">·</span>
    <time datetime="${currentItem.fecha}">${formatDate(currentItem.fecha)}</time>
  `;
  lbDesc.innerHTML = currentItem.descripcionLarga.split('\n\n').map(p => `<p>${p}</p>`).join('');
  
  lbCounter.textContent = `${currentIndex + 1} / ${media.length}`;
  lbCounter.hidden = media.length <= 1;
  
  // Links solo en software
  if (!isHardware && currentItem.links) {
    lbLinks.innerHTML = `
      <a href="${currentItem.links.deploy}" target="_blank" rel="noopener noreferrer" class="btn btn--primary">
        Ver deploy
        <svg>...</svg>
      </a>
      <a href="${currentItem.links.repo}" target="_blank" rel="noopener noreferrer" class="btn btn--secondary">
        Ver repo
        <svg>...</svg>
      </a>
    `;
    lbLinks.hidden = false;
  } else {
    lbLinks.hidden = true;
  }
  
  // Mostrar/ocultar flechas según cantidad
  lightbox.querySelector('.lightbox__nav--prev').hidden = media.length <= 1;
  lightbox.querySelector('.lightbox__nav--next').hidden = media.length <= 1;
}

function navigateLightbox(direction) {
  const media = currentItem.tipo === 'hardware' ? currentItem.fotos : [{ src: currentItem.cover }];
  currentIndex = (currentIndex + direction + media.length) % media.length;
  renderLightbox();
}

function handleLightboxKey(e) {
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
  
  // Focus trap
  if (e.key === 'Tab') {
    const focusables = lightbox.querySelectorAll('button, a, [tabindex]:not([tabindex="-1"])');
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}
```

#### 4.2.6 Touch swipe (opcional en v2, o shipear)

```javascript
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
});
lightbox.addEventListener('touchend', e => {
  const deltaX = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(deltaX) > 50) {
    navigateLightbox(deltaX > 0 ? -1 : 1);
  }
});
```

#### 4.2.7 Init

```javascript
document.addEventListener('DOMContentLoaded', () => {
  loadPortfolio();
  bindThemeToggle();
  bindMobileMenu();
  bindSmoothScroll();
});
```

### 4.3 Verificación

- Portafolio carga desde JSON.
- Tabs cambian, URL se actualiza, refrescar la página con `#portafolio/software` arranca en el tab correcto.
- Lightbox: abrir, navegar con flechas y teclado, cerrar con Esc y click en overlay, foco vuelve al disparador.
- Theme toggle persiste en `localStorage`.
- Mobile: hamburguesa abre, sheet cierra con Escape o click en link.

### 4.4 Commit

```
feat(script): render del portafolio, tabs, lightbox y theme toggle
- fetch() de data/portfolio.json
- render dinámico de cards hardware y software
- tabs con ARIA pattern completo y estado en URL
- lightbox con navegación por teclado, focus trap, swipe touch
- theme toggle con persistencia
- mobile menu con sheet glass y focus trap
```

---

## FASE 5 — Deploy-ready

**Objetivo**: tener todos los archivos de soporte (`.nojekyll`, `404.html`, `robots.txt`, `sitemap.xml`) y un README actualizado.

### 5.1 `.nojekyll`

Archivo vacío en la raíz. Crea con `touch .nojekyll`.

### 5.2 `404.html`

Página minimal con el mismo header glass, un "404 — Página no encontrada", un link a la home, y un link a WhatsApp. Sigue el design system (no rompe la marca cuando alguien cae en una URL rota).

### 5.3 `robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://lautaro1393.github.io/SierraTech-lab/sitemap.xml
```

### 5.4 `sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://lautaro1393.github.io/SierraTech-lab/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

### 5.5 README actualizado

- Fix del link roto: `/img/preview.png` → `/img/preview.webp` (línea 10).
- Sección "Tecnologías" actualizada para reflejar el stack v2.
- Link a `spec.md` y `design.md` para quien quiera entender el "cómo".
- Sección "Roadmap" o "v2" explicando brevemente el rediseño.

### 5.6 Commit

```
chore: archivos de soporte y README actualizado
- añade .nojekyll para bypassear Jekyll
- 404.html con la marca consistente
- robots.txt y sitemap.xml
- README con links corregidos y referencia a docs
```

---

## FASE 6 — QA final

**Objetivo**: validar todo el sitio end-to-end antes de mergear a `main`.

### 6.1 Checklist funcional

- [ ] Carga en `https://lautaro1393.github.io/SierraTech-lab/`.
- [ ] Hero, servicios, portafolio, sobre mí, contacto, footer: todas las secciones se ven.
- [ ] Tabs funcionan en mobile y desktop.
- [ ] Lightbox abre, navega, cierra. Foco se devuelve al disparador.
- [ ] Theme toggle persiste tras refresh.
- [ ] Mobile menu abre/cierra. Scroll lock funciona.
- [ ] Click en WhatsApp abre WhatsApp Web o la app.
- [ ] Click en "Ver deploy" de LaCocinaDeJose abre la URL externa.
- [ ] Smooth scroll a anclas funciona.

### 6.2 Checklist de accesibilidad

- [ ] Lighthouse Accessibility ≥ 95.
- [ ] Lighthouse Best Practices ≥ 95.
- [ ] Lighthouse Performance ≥ 90 en mobile.
- [ ] Lighthouse SEO ≥ 95.
- [ ] `prefers-reduced-motion: reduce` desactiva animaciones.
- [ ] `prefers-reduced-transparency: reduce` desactiva glass.
- [ ] Tab por toda la página con teclado: foco visible siempre, orden lógico.
- [ ] Lector de pantalla (VoiceOver en Mac o NVDA en Windows): el H1 es el primero, los tabs se anuncian, el lightbox se anuncia como diálogo.
- [ ] Contraste verificado con WebAIM.

### 6.3 Checklist visual

- [ ] Mobile 375px: nada se rompe, todo se lee.
- [ ] Tablet 768px: grid 2 col donde corresponde.
- [ ] Desktop 1280px: grid completo, container max 1280px, márgenes 32px.
- [ ] Wide 1920px: container sigue en 1280px, centrado, sin estirar.
- [ ] Dark y light mode: ambos se ven consistentes, no hay colores "huérfanos".

### 6.4 Performance

- [ ] Network tab: menos de 10 requests en la home.
- [ ] `styles.css` < 20 KB.
- [ ] `script.js` < 10 KB.
- [ ] `data/portfolio.json` < 5 KB.
- [ ] Imágenes con `width` y `height` para evitar CLS.
- [ ] Hero image con `fetchpriority="high"`.

### 6.5 Validación final de Git

- [ ] `git status`: working tree limpio.
- [ ] `git log --oneline`: las 6 fases commiteadas.
- [ ] `git diff origin/main`: solo lo esperado.
- [ ] Push a `main`.
- [ ] Esperar 1–2 minutos y verificar el deploy en `https://lautaro1393.github.io/SierraTech-lab/`.

### 6.6 Tag de versión (opcional)

```
git tag -a v2.0.0 -m "Rediseño v2 con design system Sierra Industrial"
git push origin v2.0.0
```

---

## Estimación de tiempo (referencial, no plazo)

| Fase | Tiempo estimado |
|---|---|
| 0 — Aprobación docs | 30 min (con review) |
| 1 — Refactor de assets | 1–2 h (incluye asignación manual de fotos) |
| 2 — Datos del portafolio | 1 h |
| 3 — Markup y CSS | 4–6 h (la parte más larga, mucho CSS) |
| 4 — Interactividad JS | 3–4 h |
| 5 — Deploy-ready | 30 min |
| 6 — QA | 1–2 h |
| **Total** | **~12–16 h** |

---

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Asignación de fotos a repairs es ambigua (las fotos son del banco, no de cada repair específico) | Revisar con el dueño de las fotos. Si no se puede resolver, dejar descripción genérica en `descripcionLarga` y aceptar que las fotos pueden no ser literal del repair. |
| Google Fonts no carga (offline, CDN bloqueado) | `font-display: swap` y fallbacks a `system-ui`. La página sigue siendo legible. |
| GitHub Pages tarda en refrescar el cache | Forzar refresh con `Ctrl+Shift+R` o `?v=2` en la URL durante QA. |
| Lightbox no funciona en algún navegador raro | Probar en Chrome, Firefox, Safari (macOS y iOS), Samsung Internet, Edge mínimo. |
| El JSON no carga por CORS en local | Solo usar `python -m http.server` o `npx serve` para probar. `file://` no funciona por seguridad del browser. |

---

## Pendientes fuera de scope (v3+)

- Sistema de tags / filtros en el portafolio.
- Búsqueda dentro del sitio.
- Modo "alto contraste" explícito.
- PWA con `manifest.json` y "Add to Home Screen".
- Multi-idioma.
- Blog / sección de posts.
- Lazy loading avanzado con `IntersectionObserver` para el portafolio.
- Imágenes responsivas con `srcset` + AVIF.
- Analytics (Plausible o Umami, sin cookies).
- Comentarios o sección de comunidad.

Estos pueden entrar en una `PLAN-v3.md` cuando se justifique.
