# SierraTech Lab — Spec v2

Especificación funcional para la reconstrucción del sitio personal de SierraTech Lab. Este documento define **qué** se construye, no **cómo se ve** (eso vive en `design.md`).

---

## 1. Contexto y objetivos

### 1.1 Estado actual

- Sitio estático vanilla (HTML5 + CSS3 + JS sin dependencias) servido en GitHub Pages bajo la ruta `/SierraTech-lab/`.
- 4 commits en `main`. Estructura plana: `index.html` + `styles.css` + `script.js` + carpeta `img/`.
- Estética glassmorphism con acento cian (`#00d2ff`) sobre fondo de imagen IA.
- Contenido hardcodeado en `index.html`: 6 cards de reparaciones con fotos que se repiten entre cards.
- Carrousel de imágenes implementado con CSS scroll-snap + lightbox custom (sin librerías).
- Sin SEO, sin accesibilidad avanzada, sin dark mode, sin `prefers-reduced-motion`/`prefers-reduced-transparency`.
- Único canal de contacto: botón a WhatsApp.

### 1.2 Objetivos de la v2

1. **Unificar la propuesta de valor** bajo una marca consistente: laboratorio electrónico + desarrollo de software. Hoy se perciben como dos sitios distintos.
2. **Adoptar la identidad visual** del proyecto Stitch `SierraTech Digital Evolution` (projectId `6535730171644063083`) — específicamente la paleta "Sierra Industrial" y la tipografía técnica.
3. **Mantener el glassmorphism** como lenguaje de fondo, pero adaptarlo a la nueva paleta (no eliminarlo, re-colorarlo).
4. **Profesionalizar el portafolio** haciéndolo extensible: items de hardware (reparaciones) + items de software (proyectos como LaCocinaDeJose), desde un solo `data/portfolio.json`.
5. **Mejorar accesibilidad y performance** sin sacrificar el "feel" de la marca.
6. **Mantener vanilla + GitHub Pages**. Cero build step, cero dependencias npm. Costo de mantenimiento = bajo.

### 1.3 No-objetivos

- No se introduce framework (React/Astro/Next).
- No se agrega CMS, base de datos ni backend.
- No se migra a dominio propio (sigue en `lautaro1393.github.io/SierraTech-lab/`).
- No se rediseña el logo de marca (se vectoriza el actual `SIERRA TECH_LAB`).
- No se agrega e-commerce ni sistema de presupuestos online.

---

## 2. Audiencia

### 2.1 Primarias

- **Personas con dispositivos a reparar** (Almagro, CABA, GBA). Buscan en Google "reparar pin de carga", "reparación MacBook Almagro", "micro-soldadura Buenos Aires". Necesitan ver pruebas de trabajos previos (fotos) y un canal de contacto inmediato (WhatsApp).
- **PyMEs y profesionales** que necesitan una web o una automatización (AppSheet, formularios, stock, etc.). Buscan portfolio, ejemplos de deploys, y link a repositorio.

### 2.2 Secundarias

- **Reclutadores / colaboradores** que quieren entender qué hace SierraTech.
- **Comunidad técnica** (foros, GitHub) que llega desde un link compartido.

### 2.3 Implicancias de diseño

- Mobile-first obligatorio: ambos perfiles llegan desde celular.
- WhatsApp es el canal rey → un CTA persistente en el header o como FAB mobile no es opcional.
- El portafolio debe ser **escaneable en <10 segundos** desde la home: fotos grandes, títulos claros.
- Lenguaje en español rioplatense. Sin marketing inflado, tono técnico-honesto.

---

## 3. Secciones del sitio

Una sola `index.html` con navegación por anclas. El orden de scroll es intencional: primero la propuesta, después la prueba (portafolio), después la conversión (contacto).

### 3.1 Header (sticky)

- Logo `SIERRA TECH_LAB` (SVG vectorizado del actual) a la izquierda.
- Nav de escritorio a la derecha: Servicios · Portafolio · Sobre mí · Contacto. Anclas.
- Toggle de tema (light/dark) + botón WhatsApp abreviado (icono solo, con `aria-label`).
- Versión mobile: hamburguesa que abre un sheet glass con los mismos items.
- Comportamiento sticky con `backdrop-filter: blur(16px)`. Reduce su opacidad al hacer scroll down (de 1.0 a 0.7) para liberar vista.

### 3.2 Hero (`#top`)

- **H1** display-xl: "Arquitectura Tecnológica" (o variante más fuerte a definir en copy en fase de implementación — esta sección necesita revisión de copy).
- **Subtítulo** body-lg: "Desde la soldadura de precisión hasta el despliegue de software."
- 2 CTAs primarios: "Ver reparaciones" (ancla `#portafolio` + tab hardware) y "Ver proyectos" (ancla `#portafolio` + tab software).
- Background: imagen fija con overlay oscuro al 60% (mantener la estética actual) o, si se reemplaza, una composición industrial (placeholder por ahora).
- Indicador de scroll (chevron animado) al pie.

### 3.3 Servicios (`#servicios`)

Grid de 4 cards. Cada card: icono SVG outline 24px (Lucide-style) + título + 1–2 líneas de descripción. Sin precio, sin botón "ver más" (el CTA está al final del bloque).

| # | Título | Descripción corta |
|---|--------|-------------------|
| 1 | Reparación de Alta Complejidad | Diagnóstico por termografía y micro-soldadura en equipos portátiles y dispositivos móviles. |
| 2 | Micro-soldadura | Reconstrucción de pistas, pines de carga, conectores FPC y componentes SMD. |
| 3 | Web a Medida | Sitios estáticos y dinámicos con foco en performance, accesibilidad y diseño técnico. |
| 4 | Automatización con AppSheet | Digitalización de procesos: stock con QR, formularios, firma digital, tableros. |

### 3.4 Portafolio (`#portafolio`)

- **Tabs** segmented-control: `Reparaciones` (default) · `Proyectos software`.
- Estado del tab persistido en `location.hash` (ej. `#portafolio/hardware` o `#portafolio/software`) para deep-linking.
- **Grid responsive** de cards. Cada card abre un **lightbox** único al click (no mini-carrousel por card).
- Cada card muestra:
  - Cover 4:3 (object-fit: cover, lazy loading).
  - Título (h3).
  - Chips de stack (solo en proyectos software) o categoría (solo en hardware).
  - Meta: fecha en formato `MMM YYYY` (es-AR).
- Hover: lift de 2px + border accent sutil.
- **Lightbox**:
  - Overlay glass con `backdrop-filter: blur(20px)`.
  - Gallery navegable con flechas ← / →, swipe en touch, y teclas.
  - Contador `1 / 5` arriba a la derecha.
  - Caption + descripción larga + meta (fecha, categoría/tags) abajo.
  - Para software: botones `Ver deploy` y `Ver repo` (con `target="_blank"` + `rel="noopener noreferrer"`).
  - Para hardware: `Cerrar` + indicador de cuántas fotos tiene.
  - Cerrar con X, click en overlay, o tecla `Escape`.
  - Focus trap: el foco se mueve al primer elemento focusable al abrir, y vuelve al disparador al cerrar.
  - `aria-modal="true"`, `role="dialog"`, `aria-labelledby` apuntando al título.

### 3.5 Sobre mí (`#sobre-mi`)

Bloque más narrativo. Estructura:

- Párrafo de 3–4 líneas: quién sos, qué hacés, dónde estás (Almagro, Buenos Aires).
- Lista compacta de habilidades clave (icono + texto), 2 columnas en desktop.
- CTA: "Ver más en GitHub" → `https://github.com/Lautaro1393`.

### 3.6 Contacto (`#contacto`)

- **3 vías** de contacto en columnas iguales (1 col en mobile):
  1. **WhatsApp**: link directo con mensaje pre-armado → `https://wa.me/5491178267986?text=Hola%20SierraTech%2C%20me%20interesa...`
  2. **Email**: `mailto:` (placeholder por ahora, completar en implementación).
  3. **Ubicación**: Almagro, Buenos Aires — link a Google Maps.
- Cada vía: icono + label mono + valor + acción primaria.
- Sin formulario (decisión explícita: el sitio no quiere datos en su propio backend; el formulario suma fricción sin valor para este caso de uso).

### 3.7 Footer

3 columnas (1 col en mobile):

1. **Marca + tagline**: logo chico + "Sierra Tech © 2026 · Almagro, Buenos Aires".
2. **Navegación**: links a las mismas anclas del header.
3. **Social**: GitHub, LinkedIn (opcional, si existe), WhatsApp, Email.

---

## 4. Modelo de datos

Un solo archivo: `data/portfolio.json`. Se carga con `fetch()` desde `script.js` en el `DOMContentLoaded`.

### 4.1 Forma del JSON

```json
{
  "version": 2,
  "items": [
    {
      "id": "hw-reconstruccion-pistas",
      "tipo": "hardware",
      "slug": "reconstruccion-pistas",
      "titulo": "Reconstrucción de pistas",
      "categoria": "Micro-soldadura",
      "fecha": "2025-04-24",
      "descripcionCorta": "Reconstrucción de pistas quemadas en placa lógica de MacBook con puente de micro-cable y resina epóxica.",
      "descripcionLarga": "El equipo presentaba cortocircuito en la línea de carga. Se removió el componente quemado con estación de aire caliente, se reconstruyó la pista con micro-cable AWG 40, se aplicó máscara UV y se verificó continuidad con multímetro de precisión.",
      "fotos": [
        { "src": "img/Reparaciones/reconstruccion-pistas-01.webp", "alt": "Vista superior de la placa con la zona dañada" },
        { "src": "img/Reparaciones/reconstruccion-pistas-02.webp", "alt": "Detalle del micro-cable puente" },
        { "src": "img/Reparaciones/reconstruccion-pistas-03.webp", "alt": "Resultado final con máscara UV" }
      ],
      "tags": ["MacBook", "micro-soldadura", "SMD"]
    },
    {
      "id": "sw-lacocinadejose",
      "tipo": "software",
      "slug": "la-cocina-de-jose",
      "titulo": "LaCocinaDeJose",
      "categoria": "Web a medida",
      "fecha": "2026-06-15",
      "descripcionCorta": "Sitio web institucional para restaurante, con carta digital y formulario de reservas.",
      "descripcionLarga": "Desarrollo completo de la presencia digital del restaurante. Diseño responsive, carta editable sin redeploy, integración con WhatsApp para reservas y SEO local para Almagro.",
      "cover": "img/proyectos/la-cocina-de-jose.webp",
      "stack": ["HTML", "CSS", "JavaScript", "Vercel"],
      "links": {
        "deploy": "https://la-cocina-de-jose.vercel.app",
        "repo": "https://github.com/Lautaro1393/la-cocina-de-jose"
      }
    }
  ]
}
```

### 4.2 Validación del shape

- `id`: slug único, prefijo `hw-` o `sw-` según tipo.
- `tipo`: `"hardware"` | `"software"` (únicos valores aceptados).
- `slug`: kebab-case, coincide con la carpeta de imágenes.
- `fecha`: ISO 8601 `YYYY-MM-DD`. La UI formatea a `es-AR` en runtime.
- `fotos[]` (hardware): mínimo 1, recomendado 2-4. Cada item: `src` (relativo a raíz del sitio) + `alt` obligatorio.
- `cover` (software): un solo `src` + `alt`.
- `stack[]` (software): strings cortas (1–2 palabras).
- `links.deploy` y `links.repo` (software): URLs absolutas https.

### 4.3 Migración desde el estado actual

Los 6 items de `index.html:51-128` migran al JSON como items `tipo: "hardware"`. Durante la migración se resuelve el problema de **fotos duplicadas** entre cards (ej. `IMG_20251223_005815010_AE.webp` aparecía en "Reconstrucción de pistas" y "Cambio de batería"). Estrategia: revisar las 10 fotos en `img/Reparaciones/`, asignar a la reparación correcta según contenido, y elegir 2–4 representativas por item. Si una foto sobra, queda en disco sin referenciar (no se borra en esta versión para no perder material de referencia).

---

## 5. Navegación y comportamiento

### 5.1 Anclas

- `#top` (header) · `#servicios` · `#portafolio` · `#sobre-mi` · `#contacto`.
- Scroll suave (`scroll-behavior: smooth` + JS fallback para Safari < 15.4).
- En la URL, el tab activo del portafolio se codifica como `#portafolio/hardware` o `#portafolio/software`.

### 5.2 Header sticky

- `position: sticky; top: 0; z-index: 100`.
- `backdrop-filter: blur(16px)` sobre fondo translúcido.
- Reduce opacidad del fondo al hacer scroll > 80px.
- En mobile: hamburguesa a la derecha, abre un panel glass con los links + CTA WhatsApp.

### 5.3 Tabs del portafolio

- Estado inicial: lee `location.hash` → si vacío, default `hardware`.
- Al cambiar de tab: actualiza `location.hash` (sin scroll), y dispara `replaceState` para no ensuciar el history.
- ARIA: `role="tablist"` en el contenedor, `role="tab"` + `aria-selected` en cada tab, `role="tabpanel"` en cada panel.

---

## 6. Accesibilidad

### 6.1 Estándar objetivo

WCAG 2.1 AA.

### 6.2 Contraste mínimo

- Texto principal sobre fondo: 4.5:1.
- Texto grande (≥ 18px bold / 24px regular): 3:1.
- Componentes UI y foco: 3:1.

### 6.3 Reduced motion / transparency

- `@media (prefers-reduced-motion: reduce)`: desactiva transiciones, hovers lift, smooth scroll, autoplay de cualquier animación.
- `@media (prefers-reduced-transparency: reduce)` o fallback para navegadores sin `backdrop-filter`: el glassmorphism se reemplaza por fondo opaco + outline 1px del color de marca. La marca sigue funcionando, sin blur.

### 6.4 Foco

- `:focus-visible` con outline 2px color accent + offset 2px en todos los elementos interactivos.
- Skip link `#skip-to-content` al inicio del `<body>`, oculto hasta recibir foco.
- Lightbox: focus trap con `Tab` ciclando dentro del modal; al cerrar, foco vuelve al disparador.

### 6.5 Semántica

- `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` correctamente usados.
- Un solo `<h1>` (en el hero). `<h2>` por sección, `<h3>` por card.
- Imágenes: `alt` obligatorio. Si es decorativa, `alt=""`.

### 6.6 Teclado

- Todo interactuable accesible por teclado.
- Lightbox: `Esc` cierra, `←` / `→` navega fotos.
- Tabs: `←` / `→` cambia de tab (ARIA tabs pattern), `Home` / `End` van al primero/último.

---

## 7. Performance

### 7.1 Imágenes

- `loading="lazy"` en todas las imágenes del portafolio y secciones debajo del hero.
- Hero image: `loading="eager"` + `fetchpriority="high"`.
- `<img>` con `width` y `height` explícitos (o `aspect-ratio` en CSS) para reservar espacio y evitar layout shift.
- Formato: mantener `.webp` (ya están optimizadas).
- Opcional a futuro: AVIF o `srcset` responsivo.

### 7.2 JS

- Sin frameworks, sin bundler. ~3–5 KB estimado para `script.js` v2.
- `fetch()` del JSON con caché HTTP (revisar `Cache-Control` en headers de GitHub Pages — probablemente ya cachea lo suficiente para un sitio estático).
- Sin JS bloqueante: `<script defer>` en `index.html`.

### 7.3 CSS

- Un solo `styles.css`, no crítico para el LCP (puede ir en el head sin `media="print"`).
- Selectores planos, sin universal ni descendientes profundos.

### 7.4 Métricas objetivo

- Lighthouse Performance: ≥ 90 (mobile).
- LCP: < 2.5s.
- CLS: < 0.1.
- TBT: < 200ms.

---

## 8. SEO y meta

### 8.1 Meta tags (en `<head>`)

```html
<title>SierraTech Lab · Reparación & Software</title>
<meta name="description" content="Laboratorio electrónico en Almagro: micro-soldadura, reconstrucción de pistas, diagnóstico. Además, desarrollo web a medida y automatización con AppSheet.">
<meta name="theme-color" content="#0D1117">
<meta name="color-scheme" content="light dark">

<!-- OpenGraph -->
<meta property="og:type" content="website">
<meta property="og:title" content="SierraTech Lab · Reparación & Software">
<meta property="og:description" content="...">
<meta property="og:image" content="https://lautaro1393.github.io/SierraTech-lab/img/og-cover.webp">
<meta property="og:url" content="https://lautaro1393.github.io/SierraTech-lab/">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="SierraTech Lab · Reparación & Software">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="https://lautaro1393.github.io/SierraTech-lab/img/og-cover.webp">
```

### 8.2 JSON-LD (en `<head>`)

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "SierraTech Lab",
  "description": "Reparación electrónica y desarrollo de software",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Almagro",
    "addressRegion": "Buenos Aires",
    "addressCountry": "AR"
  },
  "url": "https://lautaro1393.github.io/SierraTech-lab/",
  "telephone": "+54 9 11 7826-7986"
}
```

### 8.3 Archivos

- `robots.txt`: permite todo, declara `Sitemap`.
- `sitemap.xml`: solo una URL (la home).
- Favicon SVG inline en `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,...">` para evitar una request extra.

---

## 9. Deploy y entorno

### 9.1 Hosting

GitHub Pages, branch `main`, root del repo. URL pública: `https://lautaro1393.github.io/SierraTech-lab/`.

### 9.2 Path base

Todos los links internos y referencias a assets son **relativos a la raíz del repo** (ej. `img/Reparaciones/foo.webp`, `data/portfolio.json`, `styles.css`). Esto funciona tanto en local como en GitHub Pages sin `<base href>`.

### 9.3 Archivos de soporte

- `.nojekyll`: vacío, evita que GitHub Pages procese el sitio con Jekyll (no queremos liquid templates ni reglas raras con `_` en nombres de archivo).
- `404.html`: minimal, en español, con un link a la home y un "Volver" grande estilo del sitio.

### 9.4 Sin CI

No se configura Actions por ahora. El deploy es push-to-main y listo. Si en el futuro se quiere validar HTML/CSS o ejecutar Lighthouse, se puede agregar sin cambiar el modelo.

### 9.5 CORS del `fetch()` local

Al probar en local con `python -m http.server` o `npx serve` no hay problemas: ambos sirven el JSON con el MIME correcto. GitHub Pages también lo sirve con `Content-Type: application/json` cuando el archivo termina en `.json`, así que el `fetch('./data/portfolio.json')` funciona en ambos entornos.

---

## 10. Estructura final del repo

```
SierraTech-lab/
├── index.html
├── styles.css
├── script.js
├── data/
│   └── portfolio.json
├── img/
│   ├── preview.webp                  (preview para README, ya existe)
│   ├── og-cover.webp                 (nuevo, 1200x630)
│   ├── logo.svg                      (nuevo, vectorización del actual)
│   ├── favicon.svg                   (nuevo, derivado del logo)
│   ├── hero-bg.webp                  (nuevo o reutilizar Gemini actual)
│   ├── Reparaciones/
│   │   ├── reconstruccion-pistas-01.webp
│   │   ├── reconstruccion-pistas-02.webp
│   │   ├── reconstruccion-pistas-03.webp
│   │   ├── limpieza-quimica-sulfato-01.webp
│   │   ├── limpieza-quimica-sulfato-02.webp
│   │   ├── pin-de-carga-01.webp
│   │   ├── pin-de-carga-02.webp
│   │   ├── cambio-bateria-01.webp
│   │   ├── cambio-bateria-02.webp
│   │   ├── conector-fpc-01.webp
│   │   ├── conector-fpc-02.webp
│   │   ├── mantenimiento-01.webp
│   │   └── mantenimiento-02.webp
│   └── proyectos/
│       └── la-cocina-de-jose.webp    (cover, screenshot del deploy)
├── .nojekyll
├── 404.html
├── robots.txt
├── sitemap.xml
├── spec.md                           (este archivo)
├── design.md                         (siguiente)
├── PLAN.md                           (siguiente)
└── README.md                         (actualizar con link de preview correcto)
```

---

## 11. Riesgos y decisiones pendientes

### 11.1 Decisiones a tomar en fase de implementación

- **Copy del H1 del hero**: el actual ("Arquitectura Tecnológica") es conceptualmente fuerte pero poco claro para el visitante nuevo. Opciones a evaluar: mantenerlo, "Laboratorio + Software", o "Reparamos. Construimos." (decisión final al armar `index.html`).
- **Email de contacto**: no está documentado en el repo actual. Si no querés exponerlo, dejar solo WhatsApp y ubicación.
- **Foto del hero**: la actual (`Gemini_Generated_Image_l23ckil23ckil23c.webp`) es IA. Si querés reemplazarla por una foto real del banco de trabajo, capturarla y reemplazar el archivo con el mismo nombre para no tocar CSS.
- **Imágenes IA sin usar** (`Gemini_Generated_Image_l8i5bhl8i5bhl8i5.webp` 190 KB, `Gemini_Generated_Image_ud6m70ud6m70ud6m.webp` 43 KB): candidatas a borrado (233 KB liberados), confirmar antes.

### 11.2 Riesgos técnicos

- **`backdrop-filter` no soportado en Firefox < 103, Safari < 9** (en la práctica: 99%+ de usuarios lo soporta en 2026, pero el fallback con `prefers-reduced-transparency` es importante para Lighthouse y para usuarios sensibles al blur).
- **GitHub Pages y el path base `/SierraTech-lab/`**: si en el futuro se renombra el repo, todos los paths se rompen. Mitigación: usar siempre paths relativos y documentar en el README.
- **JSON cargado con `fetch()` y SEO**: Google indexa el contenido renderizado si no hay JavaScript bloqueante, pero el portafolio no se indexa sin JS. Si SEO de las cards individuales es crítico, considerar un paso de build o server-side render. Para este sitio personal, aceptable que solo la home se indexe.

### 11.3 Lo que NO se hace en esta versión

- Multi-idioma (es-AR hardcodeado).
- Blog / sección de posts.
- Sistema de tags / filtros en el portafolio.
- Modo "alto contraste" explícito (cubre con `prefers-contrast: more` en CSS).
- PWA / manifest.json (considerar para v3 si se quiere "instalar" en el celular).
