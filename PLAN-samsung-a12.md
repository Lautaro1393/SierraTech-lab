# Plan de Acción — Video Samsung A12 Reparación

Documento operativo para la creación del video cinematográfico de la reparación de un Samsung A12 (cambio de pantalla y tapa trasera). Pensado para ejecutarse paso a paso sin volver a pensar decisiones de diseño — todo lo estratégico ya está validado en la conversación.

---

## 0. Contexto

- **Reparación documentada**: Samsung A12 — cambio de pantalla y tapa trasera.
- **Material de fuente**: `img/Reparaciones/Samsung A12/Samsung a12/` — 72 fotos únicas (filtrando duplicados `(1)`) en JPG 4080×2296 (HDR, moto g84 5G), tomadas entre 19:10:02 y 20:32:10.
- **Patrón a借鉴**: `studio/src/compositions/AuricularReparacion.tsx` (1136 líneas) — composición existente con 5 pasos + intro + outro + motion graphics. Es la **referencia estructural** de este nuevo video.
- **Skill cargada**: `remotion-best-practices` — reglas de `images.md`, `transitions.md`, `text-animations.md`, `compositions.md`, `timing.md`, `video-layout.md`.
- **Decisiones validadas con el usuario**:
  - Estilo: stop motion + motion graphics (mixto, secciones curadas)
  - Sin tiempo real en UI, solo motion graphics
  - Pre-procesamiento: resize 1280px ancho + WebP q=80
  - Formato de salida: **vertical 1080×1920** (Reels / TikTok / Shorts)
  - Sin subtítulos
  - Sin música (default; se puede agregar después)

---

## 1. Objetivos y métricas

| Métrica | Target |
|---|---|
| Duración final | 30–40s (óptimo para Reels / TikTok) |
| Resolución | 1080×1920 vertical |
| FPS | 30 |
| Tamaño MP4 | < 5 MB |
| Score Lighthouse del sitio (sin cambios estructurales) | 100/100/100 |
| A11y del sitio | Sin regresiones |
| Build time del video | < 5 min |
| Reusabilidad del script de preprocesamiento | Sí, parametrizable para futuras reparaciones |

---

## 2. Estructura del video

3 bloques diferenciados con timing calculado a 30 fps:

### Bloque 1 — Apertura stop motion (5s, 150 frames)
- Las 72 fotos pasando rápido (1 cada 2 frames de Remotion = **15 fps percibido**)
- Color grade sutil: +10% saturación, contraste alzado, tinte frío en highlights
- Velocidad progresiva: 0.5× al inicio, 1.5× al final → genera urgencia
- Sin texto, sin HUD. Solo el visual + un scan line verde vertical cruzando
- Tag final del bloque: `// SAMSUNG A12 · REPARACIÓN` aparece con wipe horizontal

### Bloque 2 — 4 secciones curadas con motion graphics (24s, 720 frames, 6s c/u)

Selección curada de las mejores fotos para narrar la reparación real (pantalla + tapa trasera):

| # | Sección | Texto | Texto auxiliar | Duración |
|---|---|---|---|---|
| 2.1 | **Apertura del equipo** | `// 01 / APERTURA` | `calor + spudger` | 6s |
| 2.2 | **Cambio de pantalla** | `// 02 / PANTALLA` | `display + adhesivo` | 6s |
| 2.3 | **Cambio de tapa trasera** | `// 03 / TAPA TRASERA` | `housing + sellado` | 6s |
| 2.4 | **Prueba final** | `// 04 / ENCENDIDO` | `power on · test display` | 6s |

**Motion graphics por sección** (basado en `AuricularReparacion.tsx`):
- Eyebrow mono `// NN / TÍTULO` con slide-in
- Contador `01 / 04` abajo a la derecha
- 3 fotos por sección con Ken Burns vertical (panY + zoom animado)
- Color grade distinto por sección (tinte diferenciador)
- Brackets verdes + scan line + reticle sutil sincronizados

### Bloque 3 — Cierre stop motion + logo (5–6s, 180 frames)
- Stop motion rápido en reversa (las últimas fotos, rápido)
- Logo `SierraTech` con wipe horizontal + chromatic aberration
- Tag final: `Hardware + Software · Almagro, Buenos Aires`
- Fade out al void

### Duración total objetivo

- Bloque 1: 150 frames
- Bloque 2: 4 × 180 = 720 frames
- Bloque 3: 180 frames
- **Total: 1050 frames = 35s @ 30fps** ✓ (en rango 30–40s)

---

## 3. Decisiones técnicas

### 3.1 Pre-procesamiento de imágenes

**Por qué pre-resize**: las 72 imágenes pesan 277 MB en disco. Sin resize, Remotion decodifica cada JPG 4080×2296 en RAM durante el render → pico de 1–2 GB y render 2–3× más lento. Resize a 1280px + WebP q=80 baja el peso total a ~10–15 MB.

**Script**: `studio/scripts/preprocess-samsung-a12.mjs` (Node ESM, usa `sharp`).

Inputs:
- Directorio: `../img/Reparaciones/Samsung A12/Samsung a12/` (relativo a `studio/`)
- Filtro: ignorar archivos con sufijo `(1)` (duplicados)
- Orden: por timestamp EXIF (`DateTimeOriginal`)

Outputs:
- Directorio: `public/samsung-a12/`
- Naming: `a12-001.webp`, `a12-002.webp`, …, `a12-072.webp` (zero-padded para sort lexicográfico)
- Transformación: resize a 1280px ancho + WebP q=80
- Resultado esperado: 72 archivos de ~150–200 KB c/u → total ~12 MB

**Decisión sobre el path de la imagen fuente**:
- Las imágenes fuente viven en `../img/Reparaciones/Samsung A12/Samsung a12/` (del repo principal).
- El script usa `path.resolve` para que sea agnóstico al CWD.
- Si el script se corre desde `studio/`, el path es relativo al cwd.

**Reusabilidad**: el script acepta el directorio de origen y el prefijo de output como args CLI para futuras reparaciones (ej. `node preprocess.mjs ../img/Reparaciones/Auricular ./public/auricular aur-`).

### 3.2 Composición Remotion

**Archivo nuevo**: `studio/src/compositions/SamsungA12Reparacion.tsx`

**Componentes hijos propuestos** (siguiendo el patrón de `AuricularReparacion.tsx`):

```tsx
// Componente principal que orquesta todo
<SamsungA12Reparacion>
  ├── <Opening />              // stop motion de las 72 fotos
  ├── <Section />              // x4, una por bloque de motion graphics
  └── <Closing />              // stop motion reverso + logo
```

**Constantes del timeline** (en frames @ 30 fps):

```tsx
const FPS = 30;
const OPENING_DURATION = 150;       // 5s, stop motion
const SECTION_DURATION = 180;        // 6s por sección
const SECTION_COUNT = 4;
const CLOSING_DURATION = 180;        // 6s
const TOTAL = OPENING_DURATION + SECTION_DURATION * SECTION_COUNT + CLOSING_DURATION;
// = 150 + 720 + 180 = 1050 frames = 35s

const PHOTO_COUNT = 72;
const FRAMES_PER_PHOTO_OPENING = 2;  // 15 fps stop motion
const FRAMES_PER_PHOTO_CLOSING = 2;

// Selección curada: 3 fotos por sección, de las 72 disponibles.
// Índices en 0..71. El usuario completará estos valores mirando el material,
// pero inicialmente se propone:
const SECTION_PHOTOS = [
  [3, 8, 14],     // Apertura del equipo
  [22, 28, 35],   // Cambio de pantalla
  [45, 52, 58],   // Cambio de tapa trasera
  [63, 68, 71],   // Prueba final / encendido
];
```

**Motion graphics de cada sección** (replicando lo que funciona en `AuricularReparacion`):

```tsx
// 1. Imagen principal con Ken Burns vertical:
//    - object-fit: cover
//    - transform: translateY(panY) scale(zoom)
//    - panY: -10% → +10% del alto de la foto
//    - zoom: 1.0 → 1.15 a lo largo de 6s

// 2. Eyebrow con slide-in:
//    - opacity: 0 → 1 en frames [0, 15]
//    - translateX: -20px → 0 con easing bezier(0.16, 1, 0.3, 1)

// 3. Contador grande "0X / 04":
//    - Position absolute abajo derecha
//    - Font mono, 48px, color accent
//    - Interpolar de "0X" al número correcto via modulo del frame

// 4. Brackets verdes y scan line sincronizados
```

**Adaptación a vertical 1080×1920**:

Las fotos son 16:9 horizontales. Para encajar en 9:16 vertical uso **Ken Burns vertical**: la imagen se muestra a 1080px de ancho (con `object-fit: cover` → recorta arriba y abajo), y se hace pan de arriba a abajo a lo largo de la sección. Esto:
- Mantiene la información visual completa
- Da sensación de movimiento cinemático
- Cada sección muestra una zona diferente de la misma foto si la duración es suficiente

```tsx
<Img
  src={staticFile(`samsung-a12/a12-${paddedIndex}.webp`)}
  style={{
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    transform: `translateY(${panY}px) scale(${zoom})`,
  }}
/>
```

### 3.3 Render

- Codec: H.264 (compatibilidad universal en Reels/TikTok)
- CRF: 28 (mismo usado en el hero, balance calidad/tamaño)
- Codec adicional: en el script, dejar commented-out un flag `--codec=vp9` para futuro (mejor compresión, no soportado en Safari)
- Concurrency: 4 (default del `remotion.config.ts`)
- Output: `studio/out/samsung-a12.mp4`

**Comando del script npm**:
```json
"render:samsung": "remotion render src/Root.tsx SamsungA12Reparacion out/samsung-a12.mp4 --codec=h264 --crf=28 --concurrency=4"
```

### 3.4 Verificación

**Pre-render (rápido)**: capturar 4 frames clave con `npx remotion still`:
- `frame=30` → mid-opening
- `frame=200` → primera sección
- `frame=500` → mitad del bloque 2
- `frame=900` → cierre

**Post-render**:
- `ffprobe` o análisis manual de `studio/out/samsung-a12.mp4` para verificar resolución, duración, códec
- Cargar el video en Chrome con DevTools para verificar visualmente cada segundo
- Si hay tiempo, capturar 8–10 screenshots de momentos diferentes

---

## 4. Plan de ejecución paso a paso

### Paso 1 — Documentación (5 min)
- [x] Escribir este `PLAN-samsung-a12.md`
- [ ] **Importante**: confirmar con el usuario la **selección de fotos curadas** (índices 0..71 por sección). Sin esta confirmación, la composición usa índices tentativos que se ajustan en el primer render test.

### Paso 2 — Pre-procesamiento (5 min)
- [ ] Instalar `sharp` en el studio: `cd studio && npm install --save-dev sharp`
- [ ] Crear `studio/scripts/preprocess-samsung-a12.mjs`
- [ ] Correr el script: `node scripts/preprocess-samsung-a12.mjs`
- [ ] Verificar output: `ls -lh public/samsung-a12/ | head -10 && du -sh public/samsung-a12/`

### Paso 3 — Composición (45 min)
- [ ] Crear `studio/src/compositions/SamsungA12Reparacion.tsx`
- [ ] Implementar componentes: `Opening`, `Section`, `Closing`
- [ ] Implementar motion graphics: Ken Burns, eyebrow, contador, brackets, scan line
- [ ] Aplicar color grade por sección (filtros CSS `filter: hue-rotate()` o overlays con `mix-blend-mode`)

### Paso 4 — Registro (5 min)
- [ ] Editar `studio/src/Root.tsx`: importar y registrar `SamsungA12Reparacion`
- [ ] Calcular `durationInFrames` correcto
- [ ] Editar `studio/package.json`: añadir script `render:samsung`

### Paso 5 — Render tests (10 min)
- [ ] `npx remotion still src/Root.tsx SamsungA12Reparacion --frame=30 --scale=0.5`
- [ ] `npx remotion still src/Root.tsx SamsungA12Reparacion --frame=200 --scale=0.5`
- [ ] `npx remotion still src/Root.tsx SamsungA12Reparacion --frame=500 --scale=0.5`
- [ ] `npx remotion still src/Root.tsx SamsungA12Reparacion --frame=900 --scale=0.5`
- [ ] Ajustar la composición si algo se ve mal

### Paso 6 — Render final (5 min)
- [ ] `npm run render:samsung` (toma 2-3 min)
- [ ] Verificar `studio/out/samsung-a12.mp4`:
  - Tamaño < 5 MB
  - Resolución 1080×1920
  - Duración ~35s
  - Codec H.264

### Paso 7 — Verificación en browser (5 min)
- [ ] Servir el video con `python3 -m http.server`
- [ ] Cargar en Chrome DevTools y capturar screenshots a 0s, 5s, 15s, 25s, 35s
- [ ] Confirmar legibilidad, motion graphics, color grade

### Paso 8 — Commit (5 min)
- [ ] Mover MP4 a `studio/public/videos/samsung-a12.mp4` si se quiere accesible desde el sitio
- [ ] Commit con mensaje descriptivo
- [ ] Push a `origin/main`

**Total estimado**: 85 min de trabajo concentrado.

---

## 5. Estructura de archivos resultante

```
img/Reparaciones/Samsung A12/Samsung a12/   (input, sin cambios)
└── *.jpg                                    (72 fotos originales, 277 MB)

studio/
├── public/
│   └── samsung-a12/
│       ├── a12-001.webp                    (output del pre-procesamiento)
│       ├── a12-002.webp
│       └── a12-072.webp
├── scripts/
│   └── preprocess-samsung-a12.mjs         (script de resize)
├── src/
│   ├── Root.tsx                             (modificado: nueva composition)
│   └── compositions/
│       ├── AuricularReparacion.tsx         (existente, sin cambios)
│       └── SamsungA12Reparacion.tsx        (NUEVO)
├── out/
│   └── samsung-a12.mp4                      (output, opcional commit)
└── package.json                             (modificado: script render:samsung)
```

---

## 6. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Selección de fotos curadas no cuenta la historia bien | Verificar visualmente con still frames; ajustar índices en el primer render test |
| Color grade por sección no se diferencia lo suficiente | Usar `filter: hue-rotate(20deg)` o `sepia(0.3)` claramente distintos por sección; testear |
| Render tarda más de 5 min | Bajar a `--concurrency=2` o usar `OFFTHREAD_VIDEO_CACHE_SIZE_IN_BYTES` para limitar memoria |
| `sharp` falla en Linux por build nativo | `npm install sharp --build-from-source` o usar `jimp` puro JS como fallback (más lento pero funciona siempre) |
| El reencuadre vertical pierde información en los costados | Ken Burns vertical panea, asegurando que la zona central de la foto (la placa) siempre sea visible. Verificar con stills. |
| El tamaño final del MP4 es > 5 MB | Subir CRF a 32 o usar `vp9` (experimental) |

---

## 7. Decisiones pendientes / opcionales (no bloquean)

- **Música de fondo**: el usuario no la pidió. Se puede agregar después pasando un MP3/OGG a `public/audio/`. Si se agrega, calcular timing con la skill `audio-visualization.md` o `audio.md`.
- **Logotipo SierraTech al final**: incluido en el plan como parte del bloque de cierre. El SVG ya existe en `img/logo.svg` y se puede usar con `staticFile` y `Img`.
- **Audio de SFX (sonidos técnicos de la reparación)**: descartado por ahora, se puede sumar después.

---

## 8. Definición de "hecho"

El video está listo cuando:
- ✅ Existe `studio/out/samsung-a12.mp4` con resolución 1080×1920, códec H.264, tamaño < 5 MB
- ✅ Duración entre 30 y 40 segundos
- ✅ Las 4 secciones son visualmente distinguibles (color grade + título + contador)
- ✅ El stop motion de apertura genera la sensación de "timelapse cinematográfico"
- ✅ El cierre incluye el logo SierraTech
- ✅ El sitio en producción sigue 100/100/100 en Lighthouse
- ✅ El script de pre-procesamiento es reusable (parametrizable)
- ✅ El commit documenta el contexto (Samsung A12, cambio de pantalla y tapa trasera)
