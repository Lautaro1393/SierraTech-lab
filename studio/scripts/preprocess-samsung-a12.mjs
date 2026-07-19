#!/usr/bin/env node
/**
 * Pre-procesa las fotos de una reparacion para usarlas en una composicion
 * de Remotion. Convierte cada JPG a WebP q=80, redimensiona al ancho
 * objetivo, y emite un nombre secuencial zero-padded.
 *
 * Por defecto apunta a la reparacion del Samsung A12.
 *
 * Uso:
 *   node scripts/preprocess-samsung-a12.mjs
 *   node scripts/preprocess-samsung-a12.mjs --prefix=a12 --width=1280 --quality=80
 *   node scripts/preprocess-samsung-a12.mjs --src="../img/Reparaciones/Auricular" --prefix=aur
 *
 * Salida:
 *   public/<output-dir>/<prefix>-001.webp, <prefix>-002.webp, ...
 *
 * Parametros:
 *   --src=<path>         directorio fuente (default: ../img/Reparaciones/Samsung A12/Samsung a12)
 *   --dst=<path>         directorio destino (default: public/samsung-a12)
 *   --prefix=<string>    prefijo del archivo (default: a12)
 *   --width=<px>         ancho objetivo (default: 1280)
 *   --quality=<0-100>    calidad WebP (default: 80)
 *   --dry-run            solo listar lo que se haria, no escribir
 */

import sharp from "sharp";
import { readdir, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const STUDIO_ROOT = resolve(__dirname, "..");

// Parse simple de args CLI (sin dependencias)
const args = Object.fromEntries(
  process.argv
    .slice(2)
    .filter((a) => a.startsWith("--"))
    .map((a) => {
      const [k, v] = a.replace(/^--/, "").split("=");
      return [k, v ?? "true"];
    })
);

const SRC = resolve(
  STUDIO_ROOT,
  args.src ?? "../img/Reparaciones/Samsung A12/Samsung a12"
);
const DST = resolve(STUDIO_ROOT, args.dst ?? "public/samsung-a12");
const PREFIX = args.prefix ?? "a12";
const WIDTH = Number(args.width ?? 1280);
const QUALITY = Number(args.quality ?? 80);
const DRY_RUN = "dry-run" in args;

console.log("--- Pre-procesamiento de imagenes ---");
console.log(`SRC:       ${SRC}`);
console.log(`DST:       ${DST}`);
console.log(`PREFIX:    ${PREFIX}`);
console.log(`WIDTH:     ${WIDTH}px`);
console.log(`QUALITY:   ${QUALITY}`);
console.log(`DRY_RUN:   ${DRY_RUN}`);
console.log("");

if (!existsSync(SRC)) {
  console.error(`ERROR: directorio fuente no existe: ${SRC}`);
  process.exit(1);
}

const all = await readdir(SRC);

// Filtrar duplicados (sufijo "(1)") y quedarnos con JPGs
const unique = all
  .filter((f) => /\.(jpe?g)$/i.test(f))
  .filter((f) => !/\(1\)/.test(f));

if (unique.length === 0) {
  console.error(`ERROR: no se encontraron JPGs en ${SRC}`);
  process.exit(1);
}

// Ordenar por timestamp EXIF si exiftool disponible, sino por nombre
// (los nombres ya vienen ordenados por timestamp porque el celular
//  numera correlativamente, pero con microsegundos pueden desordenarse).
// Orden seguro: nombre lexicografico, que respeta el ordenamiento del celular.
unique.sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

console.log(`Encontradas ${unique.length} imagenes unicas (sin dup "(1)").\n`);

if (!DRY_RUN && !existsSync(DST)) {
  await mkdir(DST, { recursive: true });
  console.log(`Directorio destino creado: ${DST}\n`);
}

let totalIn = 0;
let totalOut = 0;
const start = Date.now();

for (let i = 0; i < unique.length; i++) {
  const srcFile = unique[i];
  const srcPath = join(SRC, srcFile);
  const paddedIdx = String(i + 1).padStart(3, "0");
  const outName = `${PREFIX}-${paddedIdx}.webp`;
  const outPath = join(DST, outName);

  const { size: srcSize } = await stat(srcPath);
  totalIn += srcSize;

  if (DRY_RUN) {
    console.log(`  [${i + 1}/${unique.length}] ${srcFile} -> ${outName}`);
    continue;
  }

  try {
    const info = await sharp(srcPath)
      .rotate() // respetar orientacion EXIF
      .resize({ width: WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outPath);

    totalOut += info.size;
    const ratio = ((info.size / srcSize) * 100).toFixed(1);
    console.log(
      `  [${i + 1}/${unique.length}] ${srcFile} -> ${outName}  ` +
        `(${(srcSize / 1024).toFixed(0)} KB -> ${(info.size / 1024).toFixed(0)} KB, ${ratio}%)`
    );
  } catch (err) {
    console.error(`  ERROR procesando ${srcFile}: ${err.message}`);
    process.exit(1);
  }
}

const elapsed = ((Date.now() - start) / 1000).toFixed(1);
console.log("");
console.log(`Total entrada:  ${(totalIn / 1024 / 1024).toFixed(1)} MB`);
if (!DRY_RUN) {
  console.log(`Total salida:   ${(totalOut / 1024 / 1024).toFixed(1)} MB`);
  console.log(
    `Reduccion:      ${(((totalIn - totalOut) / totalIn) * 100).toFixed(1)}%`
  );
}
console.log(`Tiempo:         ${elapsed}s`);
console.log(`Archivos:       ${unique.length}`);
if (DRY_RUN) console.log("(dry-run, no se escribio nada)");
