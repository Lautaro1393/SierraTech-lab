# SierraTech Lab — Design System v2

Design system de la reconstrucción v2. Define **cómo se ve y se siente** el sitio: tokens, componentes, patrones de interacción. La base funcional está en `spec.md`.

La identidad toma como referencia el proyecto Stitch `SierraTech Digital Evolution` (projectId `6535730171644063083`), adaptando la paleta "Sierra Industrial" al glassmorphism que ya tenía el sitio.

---

## 1. Brand & voice

### 1.1 Personalidad

**Industrial Minimalism** con calidez técnica. La marca se siente como un banco de trabajo limpio: cada elemento tiene un propósito, nada es decorativo. No es la estética de un Apple Store (demasiado pulido), ni la de un taller de barrio (demasiado sucio). Es el punto medio: preciso, intencional, durable.

### 1.2 Voz

- **Honesta y directa.** Decimos lo que hacemos, sin marketing inflado.
- **Técnica cuando corresponde.** Si el visitante es ingeniero, queremos que se sienta en casa; si esPyME buscando una web, queremos que entienda igual.
- **Cero jerga sin explicar.** "Micro-soldadura" se complementa con un par de líneas sobre qué es.

### 1.3 Lo que la marca NO es

- No es agresiva ni gamer.
- No es "AI startup" ni "tech bro".
- No es retro/vaporwave.
- No es infantil ni ilustrativa: la iconografía es lineal y abstracta, no figurativa.

---

## 2. Paleta de colores

El sistema soporta **light y dark mode** con un toggle manual persistido en `localStorage` y respeto por `prefers-color-scheme` en el primer load. La paleta dark es la principal (es la que aparece en el proyecto Stitch de referencia); el light mode es su contraparte limpia para uso diurno.

### 2.1 Tokens semánticos

Estos son los tokens que consume el código. **Nunca** se referencian colores hex directos en componentes.

| Token | Light | Dark | Uso |
|---|---|---|---|
| `--surface` | `#F5F7FA` | `#0D1117` | Fondo base de la página |
| `--surface-elev` | `#FFFFFF` | `#18243D` | Cards, paneles elevados |
| `--surface-hi` | `#F9FAFB` | `#1F2937` | Surface alternativa (hovers sutiles) |
| `--ink-primary` | `#0D1117` | `#DCE2F3` | Texto principal |
| `--ink-secondary` | `#4B5563` | `#9CA3AF` | Texto secundario, captions |
| `--ink-muted` | `#9CA3AF` | `#6B7280` | Texto deshabilitado, placeholders |
| `--ink-inverse` | `#FFFFFF` | `#0D1117` | Texto sobre fondo accent |
| `--accent` | `#2EDC1B` | `#2EDC1B` | CTAs primarios, links, indicadores activos |
| `--accent-soft` | `#DCFCE7` | `rgba(46,220,27,0.12)` | Hover bg de elementos accent |
| `--outline` | `#E5E7EB` | `rgba(255,255,255,0.08)` | Bordes 1px, separadores |
| `--outline-strong` | `#D1D5DB` | `rgba(255,255,255,0.16)` | Bordes en hover/focus |
| `--glass-bg` | `rgba(255,255,255,0.55)` | `rgba(13,17,23,0.55)` | Fondo glass (cards, header) |
| `--glass-border` | `rgba(13,17,23,0.08)` | `rgba(255,255,255,0.06)` | Borde glass |
| `--shadow-sm` | `0 1px 2px rgba(13,17,23,0.04)` | `none` | Sombra sutil (solo light) |
| `--shadow-md` | `0 4px 12px rgba(13,17,23,0.06)` | `none` | Sombra media (solo light) |
| `--glow-accent` | `0 0 0 1px #2EDC1B, 0 0 24px rgba(46,220,27,0.20)` | `0 0 0 1px #2EDC1B, 0 0 24px rgba(46,220,27,0.20)` | Focus visible / active state |

### 2.2 Colores semánticos de estado

| Token | Valor | Uso |
|---|---|---|
| `--success` | `#2EDC1B` | Mismo que accent (chips "Activo", badges OK) |
| `--warning` | `#F59E0B` | Estados de atención |
| `--error` | `#EF4444` | Errores de validación |
| `--info` | `#38BDF8` | Información neutra |

### 2.3 Por qué `#2EDC1B` (acid-green) como accent

Es el color del proyecto Stitch y funciona mejor que el cyan anterior (`#00d2ff`) por dos razones:
- Sobre fondo dark, un verde saturado "respira" más y se asocia con LEDs de instrumental (microscopios, multímetros) — encaja con el discurso técnico.
- Tiene suficiente contraste en ambos modos (light: 7.2:1 sobre `#F5F7FA`; dark: 9.4:1 sobre `#0D1117`). WCAG AAA para texto normal.

### 2.4 Inversión de tema

El toggle vive en el header (icono sol/luna). Persistencia: `localStorage.setItem('theme', 'light'|'dark')`. En el `<head>` hay un script inline de **5 líneas** que aplica el tema antes del paint para evitar el "flash" de tema incorrecto.

---

## 3. Tipografía

### 3.1 Familias (cargadas vía Google Fonts en el `<head>`)

| Uso | Familia | Pesos | Estilo |
|---|---|---|---|
| Display, H1, H2, H3 | **Space Grotesk** | 600, 700 | Geométrica con aire industrial (extiende a Eurostile sin la cursiva) |
| Body, párrafos | **Geist** | 400, 500 | Moderna, alta legibilidad, escala bien en mobile |
| Labels, código, UI mono | **JetBrains Mono** | 500, 700 | Mono técnica para todo dato y control |

**Preconnect** a `fonts.googleapis.com` y `fonts.gstatic.com` para acelerar la carga.

### 3.2 Escala tipográfica

| Token | Familia | Tamaño / line-height | Peso | Letter-spacing | Uso |
|---|---|---|---|---|---|
| `--text-display-xl` | Space Grotesk | `56px / 1.05` | 700 | `-0.03em` | Hero H1 (desktop) |
| `--text-display-lg` | Space Grotesk | `40px / 1.1` | 700 | `-0.02em` | Hero H1 mobile, o H1 sección |
| `--text-h1` | Space Grotesk | `32px / 1.2` | 600 | `-0.02em` | H1 secundario |
| `--text-h2` | Space Grotesk | `24px / 1.25` | 600 | `0` | H2 sección |
| `--text-h3` | Space Grotesk | `20px / 1.3` | 600 | `0` | H3 card |
| `--text-body-lg` | Geist | `18px / 1.6` | 400 | `0` | Subtítulos, lead |
| `--text-body` | Geist | `16px / 1.6` | 400 | `0` | Body default |
| `--text-body-sm` | Geist | `14px / 1.5` | 400 | `0` | Caption, meta |
| `--text-label` | JetBrains Mono | `12px / 1.0` | 700 | `0.08em` (uppercase) | Labels de UI, chips, eyebrows |
| `--text-code` | JetBrains Mono | `14px / 1.4` | 500 | `0.05em` | Snippets, datos técnicos |

### 3.3 Reglas de aplicación

- **Eyebrows** (texto pequeño encima de un H2) usan `--text-label` uppercase en color `--ink-secondary`.
- **H2 de sección** llevan un border-left de 3px en `--accent` y un label `//` o número al lado (estilo "consola técnica"). Heredado del sitio actual.
- **Mono en UI**: todo lo que sea dato, número, código, status, botón pequeño → JetBrains Mono. Esto refuerza el discurso "industrial".
- **Cero serif**. La marca no usa serifs en ningún lado.
- **No usar cursivas decorativas**.

---

## 4. Espaciado

Sistema basado en grid de 4px. Se documenta como tokens que los componentes consumen.

```
--space-0  : 0
--space-1  : 4px
--space-2  : 8px
--space-3  : 12px
--space-4  : 16px
--space-5  : 20px
--space-6  : 24px
--space-8  : 32px
--space-10 : 40px
--space-12 : 48px
--space-16 : 64px
--space-20 : 80px
--space-24 : 96px
--space-32 : 128px
```

### 4.1 Reglas de uso

- **Padding interno de cards**: `--space-6` (24px).
- **Gap entre cards en grid**: `--space-6` (24px) en mobile, `--space-8` (32px) en desktop.
- **Padding de sección** (top/bottom): `--space-16` (64px) en mobile, `--space-24` (96px) en desktop.
- **Container max-width**: `1280px`.
- **Container padding (margin)**: `16px` mobile, `32px` desktop.

---

## 5. Radios

```
--radius-sm   : 4px     Inputs, chips, badges
--radius-md   : 8px     Botones, cards chicas
--radius-lg   : 12px    Cards grandes, modales, lightbox
--radius-xl   : 16px    Hero blocks, secciones destacadas
--radius-full : 9999px  Avatars, FAB, dot indicators
```

**Regla**: no se usan radios mayores a 16px. La marca es "precisión-mecanizada", no "burbuja" ni "orgánica". Botones e inputs van en `md` por defecto, `sm` solo en controles compactos.

---

## 6. Sombras y elevación

La estética "Nothing/Teenage Engineering" que guía el proyecto Stitch **rechaza drop-shadows**. En su lugar se usan capas tonales y outlines de bajo contraste.

### 6.1 Sistema de elevación

| Nivel | Light mode | Dark mode |
|---|---|---|
| Base | `surface` | `surface` |
| Elevado (card) | `surface-elev` + `outline` 1px | `surface-elev` + `outline` 1px |
| Elevado alto (modal, lightbox) | `surface-elev` + `outline-strong` 1px | `surface-hi` + `outline-strong` 1px + `--glow-accent` sutil |
| Interactivo (hover) | outline pasa a `--accent`, `transform: translateY(-2px)` | idem |
| Focus visible | `--glow-accent` (anillo verde) | idem |

### 6.2 Glow accent

El único "shadow" permitido en dark mode es el glow del estado focus/active:

```css
box-shadow: 0 0 0 1px var(--accent), 0 0 24px rgba(46, 220, 27, 0.20);
```

Esto simula un "LED encendido" alrededor del elemento. Se usa **solo** en:
- Foco de teclado (`:focus-visible`).
- Estado activo de un toggle/tab.
- Indicador de "online" / status en chips.

---

## 7. Breakpoints y layout

### 7.1 Breakpoints

| Nombre | Rango | Cols | Margin | Gutter |
|---|---|---|---|---|
| `mobile` | `< 768px` | 1 | 16px | 16px |
| `tablet` | `768–1023px` | 2 | 24px | 24px |
| `desktop` | `1024–1439px` | 12 | 32px | 16px |
| `wide` | `≥ 1440px` | 12 | 32px | 16px (container max 1280px) |

### 7.2 Grid

CSS Grid de 12 columnas en desktop. En mobile todo fluye a 1 columna sin definir grid explícito.

```css
.container {
  width: 100%;
  max-width: 1280px;
  margin-inline: auto;
  padding-inline: var(--container-margin);
}

.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--gutter);
}
```

### 7.3 Comportamiento responsive

- **Servicios**: 1 col mobile, 2 col tablet, 4 col desktop.
- **Portafolio grid**: 1 col mobile, 2 col tablet, 3 col desktop, 4 col wide.
- **Sobre mí**: 1 col mobile, 2 col desktop.
- **Contacto**: stack vertical mobile, 3 col desktop.
- **Header**: hamburguesa mobile, nav inline desktop.

---

## 8. Glassmorphism (adaptado a la nueva paleta)

El glassmorphism sobrevive de la v1 pero se re-colorea y se racionaliza. La regla: **el glass se usa donde hay contenido superpuesto sobre algo visualmente rico (hero image, lightbox, header con scroll)**. En secciones con fondo plano, no hace falta glass.

### 8.1 Token del glass

```css
.glass {
  background-color: var(--glass-bg);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
}
```

### 8.2 Variantes

| Variante | Uso | Diferencia |
|---|---|---|
| `.glass` | Header sticky, lightbox overlay | Base, blur 16px |
| `.glass--card` | Cards del portafolio, servicios | Blur 12px, padding 24px |
| `.glass--elev` | Modal, menú mobile abierto | Blur 20px, bg más opaco (`--surface-elev/80`) |

### 8.3 Fallback para `prefers-reduced-transparency`

Cuando el usuario prefiere menos transparencia (configuración común para personas con sensibilidad visual o cognitive load):

```css
@media (prefers-reduced-transparency: reduce) {
  .glass, .glass--card, .glass--elev {
    background-color: var(--surface-elev);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border-color: var(--outline);
  }
}
```

Y para navegadores sin soporte de `backdrop-filter` (Firefox < 103, ya extinto, pero se deja el fallback):

```css
@supports not (backdrop-filter: blur(1px)) {
  .glass, .glass--card, .glass--elev {
    background-color: var(--surface-elev);
  }
}
```

---

## 9. Componentes

Cada componente se documenta con: **estructura HTML base**, **tokens que consume**, **estados**, **variantes**, **comportamiento responsive**, **notas de a11y**.

### 9.1 Header

```
[Logo SVG]                                [Nav links] [Theme toggle] [WhatsApp icon]
```

- **Estructura**: `<header>` con `<nav>` adentro, `<button>` para el toggle de tema, `<a>` para WhatsApp.
- **Sticky**: `position: sticky; top: 0; z-index: 100`.
- **Glass**: aplica `.glass` con bg `--glass-bg` y blur 16px.
- **Comportamiento scroll**: al pasar 80px, se le agrega clase `.is-scrolled` que reduce el bg a `--surface/70` y baja el blur a 12px.
- **Mobile**: hamburguesa reemplaza la nav. Al click, abre un sheet glass full-width desde la derecha (animación slide-in 220ms). El sheet tiene CTA WhatsApp prominente.
- **A11y**: el toggle de tema tiene `aria-label` dinámico ("Cambiar a modo oscuro" / "Cambiar a modo claro"). El sheet mobile es un `role="dialog"` con focus trap y `aria-modal="true"`.
- **Tokens**: `--glass-bg`, `--ink-primary`, `--accent`, `--space-4`, `--space-6`, `--radius-md`, `--space-1` (gap entre items).

### 9.2 Hero

```
                                      [Eyebrow: // Sierra Tech Lab]
                                      H1: Arquitectura Tecnológica (display-xl)
                                      Subtítulo: body-lg
                                      [CTA primary: Ver reparaciones] [CTA secondary: Ver proyectos]
                                      [↓ indicador de scroll animado]
```

- **Estructura**: `<section id="top" class="hero">` con un `<div class="hero__content">` y un `<div class="hero__bg">` (la imagen de fondo + overlay).
- **Background**: imagen fija (`background-attachment: fixed` en desktop, normal en mobile por performance), con `::before` de overlay negro al 60%.
- **Layout**: contenido centrado, max-width 720px.
- **CTAs**: dos botones lado a lado (stack vertical en mobile). El primario es filled accent, el secundario es ghost con outline.
- **Tokens**: `--text-display-xl`, `--text-body-lg`, `--accent`, `--ink-primary` (sobre el overlay), `--space-16`, `--space-24`.
- **A11y**: el H1 es el único de la página. El indicador de scroll es un link con `aria-label="Ir a servicios"`.

### 9.3 Section header

```
[// Servicios]  ──  H2 del título
```

- **Estructura**: `<h2>` con un span `.eyebrow` y el texto del título.
- **Estilo**: el `.eyebrow` es `--text-label` uppercase, en `--ink-secondary`. El h2 lleva `border-left: 3px solid var(--accent)` y `padding-left: var(--space-4)`.
- **Variante**: la línea puede ser sólida (default) o dashed (variante "schematic" para secciones técnicas como portafolio).
- **Tokens**: `--text-h2`, `--text-label`, `--accent`, `--ink-secondary`, `--space-4`.

### 9.4 Service card

```
[Icon 24px outline]    [Título h3]               [Descripción 1-2 líneas]
```

- **Estructura**: `<article class="service-card">` con un `<div>` para el icono (SVG inline 24x24, stroke 1.5), `<h3>`, `<p>`.
- **Estilo**: `.glass--card` con padding 24px, hover lift 2px + border accent.
- **Iconografía**: Lucide-style stroke icons. 4 íconos: `wrench` (reparación), `cpu` (micro-soldadura), `code` (web), `zap` (automatización).
- **Tokens**: `--text-h3`, `--text-body-sm`, `--ink-primary`, `--ink-secondary`, `--accent`, `--surface-elev`, `--space-6`, `--radius-lg`, `--space-4` (gap interno).
- **A11y**: el `<h3>` es el primer elemento focusable si la card fuera interactiva. En este caso, la card no es interactiva (no hay link), pero podría serlo en el futuro (link a un servicio específico).

### 9.5 Tab group (segmented control)

```
[ ● Reparaciones (4) | ○ Proyectos software (1) ]
```

- **Estructura**: `<div role="tablist">` con dos `<button role="tab">`, y debajo dos `<div role="tabpanel">` con el contenido.
- **Estilo**: contenedor `.glass--card` con padding 4px. Cada tab es un `<button>` con padding `8px 16px`, radius `md`. El activo tiene `background: var(--accent)`, `color: var(--ink-inverse)`, `--glow-accent` sutil. El inactivo es texto `--ink-secondary` que pasa a `--ink-primary` en hover.
- **Contador**: `(N)` pequeño al lado del label, en `--text-label` color `--ink-muted`.
- **Comportamiento**: el tab activo se indica con `aria-selected="true"` y un atributo `aria-controls` apuntando al panel. `Tab` navega al grupo, `←` / `→` cambia entre tabs (ARIA tabs pattern), `Home` / `End` van al primero/último. El contenido del panel inactivo se mantiene en el DOM con `hidden` (no se desmonta) para que la transición sea instantánea.
- **Estado en URL**: `replaceState` actualiza el hash sin scroll.
- **Tokens**: `--text-label`, `--accent`, `--ink-inverse`, `--ink-primary`, `--ink-secondary`, `--radius-md`, `--space-1`, `--space-4`.

### 9.6 Portfolio card

```
[Cover 4:3]                                          [stack chips]
[Título h3]
[fecha · categoría]
```

- **Estructura**: `<article class="portfolio-card" tabindex="0" role="button" aria-label="Ver detalle de [título]">`.
- **Estilo**: `.glass--card`. El cover es `<img>` con `aspect-ratio: 4/3`, `object-fit: cover`, `border-radius: var(--radius-md)`. La card tiene hover lift 2px + border accent.
- **Stack chips** (solo software): una fila de `<span class="chip">` con `--text-label`, padding `4px 8px`, `--radius-sm`, bg `--accent-soft`, color `--accent`.
- **Categoría** (solo hardware): texto `--text-label` en `--ink-muted` precedido por un dot de 6px en `--accent`.
- **Click**: abre el lightbox con el item correspondiente.
- **A11y**: la card entera es focusable y se puede activar con `Enter` / `Space`.
- **Tokens**: `--text-h3`, `--text-body-sm`, `--text-label`, `--accent`, `--accent-soft`, `--ink-muted`, `--surface-elev`, `--radius-md`, `--radius-lg`, `--space-6`, `--space-3`, `--space-4`.

### 9.7 Lightbox

```
[Overlay glass]                                                [X cerrar]
                                            
        [◀]  [Imagen activa centrada 16:10]  [▶]
            
        Título h2
        fecha · categoría · tags
        Descripción larga (markdown simple → HTML)
        [Ver deploy ↗] [Ver repo ↗]      (solo software)
        [1 / 5]
```

- **Estructura**: `<div role="dialog" aria-modal="true" aria-labelledby="lightbox-title">` con un `<button class="close">`, `<button class="nav prev">`, `<button class="nav next">`, `<div class="gallery">`, `<div class="meta">`.
- **Estilo**: el overlay es `.glass--elev` con `position: fixed; inset: 0; z-index: 1000`. La imagen tiene `max-height: 70vh`, `object-fit: contain`, sobre un fondo `--surface-elev`.
- **Comportamiento**:
  - Click en overlay (fuera del contenido) cierra.
  - `Esc` cierra.
  - `←` / `→` navega.
  - Swipe en touch (touchstart/touchend con threshold de 50px).
  - Al abrir: el primer elemento focusable recibe foco, el resto queda atrapado (focus trap con `Tab`).
  - Al cerrar: foco vuelve al disparador (la card que abrió el lightbox).
  - Body scroll lock (`overflow: hidden` en `<body>`) mientras está abierto.
  - Animación de entrada: fade-in 220ms con `transform: scale(0.96) → 1`.
- **Imagen counter**: posición absoluta arriba a la derecha del viewport (no de la imagen), estilo `--text-label` uppercase en `--ink-secondary`.
- **Meta**: `fecha` formateada a `es-AR` con `Intl.DateTimeFormat`. `descripcionLarga` se interpreta como párrafos separados por `\n\n` (sin markdown completo para no agregar dependencias).
- **Tokens**: `--surface-elev`, `--ink-primary`, `--ink-secondary`, `--accent`, `--radius-lg`, `--space-6`, `--space-8`, `--text-h2`, `--text-body`, `--text-label`, `--text-body-sm`.

### 9.8 Button

```
[ primary   ]    [ secondary  ]    [ ghost  ]
```

- **Estructura**: `<button>` o `<a>` (mismo estilo).
- **Variantes**:
  - `primary`: `background: var(--accent); color: var(--ink-inverse); border: 1px solid var(--accent);`
  - `secondary`: `background: var(--surface-elev); color: var(--ink-primary); border: 1px solid var(--outline);`
  - `ghost`: `background: transparent; color: var(--ink-primary); border: 1px solid var(--outline);` (hover: `border-color: var(--accent)`)
- **Tamaño default**: `padding: 10px 18px; font-family: var(--font-mono); font-size: 14px; font-weight: 500; letter-spacing: 0.05em;` texto uppercase.
- **Tamaño sm**: `padding: 6px 12px; font-size: 12px;`
- **Tamaño lg**: `padding: 14px 24px; font-size: 16px;`
- **Estados**:
  - Hover: en primary invierte colores (bg `--ink-primary`, color `--accent`, border `--accent`). En otros: border `--accent`.
  - Active: `transform: translateY(1px)`.
  - Focus visible: `--glow-accent`.
  - Disabled: `opacity: 0.4; cursor: not-allowed;`
- **Iconos**: si lleva icono, va a la izquierda del texto con `gap: 8px;`. El icono es SVG 16x16 stroke 1.5.
- **A11y**: el texto del botón debe ser claro, no "Click aquí". Si es solo icono, `aria-label` obligatorio.

### 9.9 Chip / Status dot

```
[● Activo]   [● Standby]   [● Error]
```

- **Estructura**: `<span class="chip">` con un `<span class="dot">` adentro + texto.
- **Dot**: `width: 6px; height: 6px; border-radius: var(--radius-full); background: var(--success | --warning | --error | --ink-muted);`
- **Texto**: `--text-label` uppercase, color `--ink-secondary`.
- **Chip container**: `display: inline-flex; align-items: center; gap: 6px; padding: 4px 8px; background: var(--surface-hi); border: 1px solid var(--outline); border-radius: var(--radius-sm);`

### 9.10 Input / Textarea (no usado en v2, pero documentado por completitud)

- Estilo "bracket": `<div class="input-group">` con `<label>` visible arriba en `--text-label` y `<input>` con `border: none; border-bottom: 1px solid var(--outline); padding: 8px 0;` `background: transparent;`
- Focus visible: `border-bottom-color: var(--accent); box-shadow: 0 1px 0 0 var(--accent);` (un underline glow).
- Error state: `border-bottom-color: var(--error);` + mensaje de error en `--text-body-sm` color `--error`.

### 9.11 Footer

```
[Logo + tagline]    [Navegación]    [Social]
─────────────────────────────────────────────────
Sierra Tech © 2026 · Almagro, Buenos Aires
```

- 3 columnas en desktop, 1 stack en mobile.
- Fondo: `--surface-elev`. Sin glass (es un bloque de cierre, no superpuesto).
- **Tokens**: `--text-body-sm`, `--text-label`, `--ink-secondary`, `--ink-muted`, `--accent`, `--space-8`, `--space-12`.

---

## 10. Iconografía

### 10.1 Fuente

Lucide icons (`https://lucide.dev`), usados como SVG inline. **No se carga la fuente completa** (sería overkill para 8–10 íconos). Se incluyen como SVG en el HTML o se renderizan en runtime desde una constante JS.

### 10.2 Estilo

- Stroke `1.5`.
- Tamaño default 24x24. En UI densa (chips, buttons), 16x16.
- Color: `currentColor` para heredar.
- Sin fill, solo stroke.

### 10.3 Inventario

| Icono | Uso |
|---|---|
| `wrench` | Servicio: Reparación |
| `cpu` | Servicio: Micro-soldadura |
| `code` | Servicio: Web a medida |
| `zap` | Servicio: Automatización |
| `github` | Footer: GitHub |
| `linkedin` | Footer: LinkedIn (si aplica) |
| `message-circle` | CTA WhatsApp / contacto |
| `mail` | Footer: Email |
| `map-pin` | Footer: Ubicación |
| `x` | Lightbox: cerrar |
| `chevron-left` | Lightbox: prev |
| `chevron-right` | Lightbox: next |
| `arrow-down` | Hero: scroll indicator |
| `menu` | Header: hamburguesa |
| `sun` / `moon` | Header: theme toggle |
| `external-link` | Lightbox: links a deploy/repo |
| `search` | No usado en v2 (referencia) |

---

## 11. Motion

### 11.1 Transición default

```css
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-fast: 120ms;
  --duration-base: 180ms;
  --duration-slow: 280ms;
}

button, a, .card, .chip, .tab, .lightbox {
  transition: 
    background-color var(--duration-base) var(--ease-out),
    border-color var(--duration-base) var(--ease-out),
    color var(--duration-base) var(--ease-out),
    transform var(--duration-base) var(--ease-out),
    opacity var(--duration-base) var(--ease-out);
}
```

### 11.2 Animaciones específicas

| Elemento | Animación | Duración |
|---|---|---|
| Hover lift (card, button) | `translateY(-2px)` | 180ms |
| Lightbox entrada | `opacity 0→1` + `scale(0.96)→1` | 220ms |
| Sheet mobile | `translateX(100%)→0` | 240ms |
| Theme toggle | crossfade entre iconos sol/luna | 180ms |
| Tab indicator | slide horizontal del underline accent | 200ms |
| Hero scroll chevron | bounce vertical sutil | 1500ms infinite |

### 11.3 `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 12. Estados interactivos (resumen)

| Elemento | Hover | Focus | Active | Disabled |
|---|---|---|---|---|
| Link | `color: var(--accent)` | `--glow-accent` 2px offset | `opacity: 0.7` | — |
| Button primary | invierte (bg ink, color accent) | `--glow-accent` | `translateY(1px)` | `opacity: 0.4` |
| Button secondary | `border: var(--accent)` | `--glow-accent` | `translateY(1px)` | `opacity: 0.4` |
| Button ghost | `border: var(--accent)`, `bg: var(--accent-soft)` | `--glow-accent` | `translateY(1px)` | `opacity: 0.4` |
| Service card | `translateY(-2px)`, `border: var(--accent)` | `--glow-accent` | — | — |
| Portfolio card | `translateY(-2px)`, `border: var(--accent)` | `--glow-accent` | `transform: scale(0.99)` | — |
| Tab | bg `--accent-soft` si no activo | `--glow-accent` | — | — |
| Tab activo | — | (mantiene `--glow-accent`) | — | — |
| Chip | `border: var(--accent)` | `--glow-accent` | — | — |
| Input | — | `border-bottom: var(--accent)` + underline glow | — | — |
| Theme toggle | rota 15° | `--glow-accent` | `rotate(0)` | — |

---

## 13. Assets gráficos

### 13.1 Logo

Vectorización del actual `SIERRA TECH_LAB` (texto + span con `TECH` en color). Formato SVG inline en el HTML (no archivo externo para ahorrar request). Se le agrega una marca de "industrial" sutil: un pequeño triángulo o muesca en la `L` final de `LAB`, o un guion bajo antes de `LAB` ya presente, simplificado.

Versión: full (`SIERRA TECH_LAB`) para header en desktop, short (`ST·L`) para mobile / favicon.

### 13.2 Favicon

SVG inline declarado como data URI en `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,...">`. Mismo logo short, sobre fondo `--surface` o `--accent`.

### 13.3 Hero background

Mantener la imagen IA actual (`Gemini_Generated_Image_l23ckil23ckil23c.webp`) renombrada a `hero-bg.webp` para consistencia semántica. Si se quiere reemplazar, capturarla en el banco de trabajo con luz controlada. El archivo actual pesa 46 KB — aceptable.

### 13.4 OG cover

Imagen 1200x630 para compartir en redes. Una composición: logo + tagline + un accent stroke. Se puede generar como SVG exportado a PNG/webp, o como una composición del hero + texto. **Pendiente definir en implementación.**

### 13.5 Iconografía de categorías

No se usan imágenes para "reparación" / "software" en la home; la categorización es por dot color en chips. La distinción principal se hace con el tab group y los chips de stack en cards de software.

---

## 14. Accesibilidad visual (no técnica)

- **Contraste verificado** con WebAIM Contrast Checker para todas las combinaciones texto/fondo.
- **No se confía solo en color** para transmitir estado: un chip "Activo" tiene dot + texto, no solo verde.
- **Tamaños touch mínimos**: 44x44px en mobile para todos los controles (botones, tabs, hamburger).
- **Espaciado entre links adyacentes** ≥ 8px para evitar clicks erróneos.

---

## 15. Convenciones de código (resumen)

- **CSS**: variables para todos los tokens, no valores mágicos.
- **Nomenclatura**: BEM ligero para clases (`.glass--card`, `.portfolio-card__cover`, `.lightbox__nav--prev`).
- **HTML**: semántico, ARIA solo cuando el rol nativo no alcanza.
- **JS**: vanilla, sin `var`, con `const`/`let`. Funciones puras para el render, side-effects solo en el `DOMContentLoaded`.
- **Comentarios**: español, solo donde la intención no es obvia.
- **Indentación**: 2 espacios en HTML/JS, 2 espacios en CSS.

---

## 16. Anti-patrones explícitos

Lo que **no** se hace en este design system:

- **No drop-shadows** estilo Material Design. La elevación es tonal, no proyectada.
- **No gradientes** de más de 2 stops, y solo en acentos puntuales (no fondos).
- **No emojis** como iconografía. Solo SVG.
- **No glassmorphism en todo**. Solo donde aporta (header, cards sobre imágenes, lightbox).
- **No "AI gradient"** (violeta-rosa-cyan) en ningún lugar.
- **No animaciones decorativas** largas. Todo movimiento tiene propósito.
- **No más de 2 niveles de jerarquía visual** por sección. Si tenés un H2 y un H3, el H3 ya no compite con elementos accent.
