/**
 * ============================================================================
 * MÓDULO `path` DE NODE.JS - VERSIÓN SÍNCRONA
 * ============================================================================
 * El módulo `path` sirve para trabajar con rutas de archivos y carpetas.
 * TODOS sus métodos son SÍNCRONOS (no hay versión asincrónica).
 * Es crucial porque las rutas son diferentes en Windows (C:\Users) y
 * Linux/Mac (/home/usuario). Con `path` tu código funciona en ambos.
 * ============================================================================
 * Contenido:
 *   1. Obtener partes de una ruta (basename, dirname, extname)
 *   2. Analizar rutas completas (parse)
 *   3. Construir rutas (join, resolve, format)
 *   4. Comparar rutas (relative, isAbsolute)
 *   5. Ejercicios prácticos
 * ============================================================================
 */

import path from "node:path";
import fs from "fs";

// ═════════════════════════════════════════════════════════════════════════════
// 1. OBTENER PARTES DE UNA RUTA
// ═════════════════════════════════════════════════════════════════════════════

/**
 * path.basename(ruta)
 * Devuelve SOLO el nombre del archivo (sin la ruta completa)
 */
console.log("─── basename ───");
console.log(path.basename("./main.ts")); // main.ts
console.log(path.basename("/usuarios/docs/archivo.txt")); // archivo.txt
console.log(path.basename("C:\\Users\\PC\\foto.png")); // foto.png

/**
 * path.basename(ruta, extension)
 * También puedes quitar la extensión directamente
 */
console.log(`\nSin extensión: ${path.basename("./main.ts", ".ts")}`); // main

/**
 * path.dirname(ruta)
 * Devuelve la CARPETA que contiene el archivo (sin el nombre)
 */
console.log("\n─── dirname ───");
console.log(path.dirname("./common/loggers/logger.ts")); // ./common/loggers
console.log(path.dirname("/home/usuario/docs/archivo.txt")); // /home/usuario/docs
console.log(path.dirname("C:\\Users\\PC\\documento.pdf")); // C:\Users\PC

/**
 * path.extname(ruta)
 * Devuelve la extensión del archivo CON el punto (.ts, .txt, etc.)
 */
console.log("\n─── extname ───");
console.log(path.extname("./app.ts")); // .ts
console.log(path.extname("./documento.txt")); // .txt
console.log(path.extname("./imagen.png")); // .png
console.log(path.extname("./sin-extension")); // (vacío)

/**
 * Ejercicio: Detectar tipo de archivo por extensión
 */
function tipoArchivo(archivo: string): string {
  const ext = path.extname(archivo).toLowerCase();

  const tipos: Record<string, string> = {
    ".ts": "TypeScript",
    ".js": "JavaScript",
    ".json": "JSON",
    ".txt": "Texto plano",
    ".md": "Markdown",
    ".png": "Imagen PNG",
    ".jpg": "Imagen JPG",
    ".pdf": "Documento PDF",
  };

  return tipos[ext] || "Desconocido";
}

console.log(`\ntipoArchivo("app.ts") = ${tipoArchivo("app.ts")}`);
console.log(`tipoArchivo("foto.png") = ${tipoArchivo("foto.png")}`);
console.log(`tipoArchivo("leeme.md") = ${tipoArchivo("leeme.md")}`);

// ═════════════════════════════════════════════════════════════════════════════
// 2. ANALIZAR RUTAS COMPLETAS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * path.parse(ruta)
 * Devuelve un objeto con TODAS las partes de la ruta:
 * - root: raíz del sistema (C:\ o /)
 * - dir: carpeta contenedora
 * - base: nombre completo del archivo (con extensión)
 * - name: nombre sin extensión
 * - ext: extensión
 */
console.log("\n" + "═".repeat(60));
console.log("parse: Análisis completo de ruta");
console.log("═".repeat(60));

const rutaEjemplo = "./common/loggers/logger.ts";
const infoRuta = path.parse(rutaEjemplo);

console.log(`Ruta original: ${rutaEjemplo}`);
console.log(`\nResultado de parse():`);
console.log(`  root:  "${infoRuta.root}"`); // "" (vacío, es relativa)
console.log(`  dir:   "${infoRuta.dir}"`); // ./common/loggers
console.log(`  base:  "${infoRuta.base}"`); // logger.ts
console.log(`  name:  "${infoRuta.name}"`); // logger
console.log(`  ext:   "${infoRuta.ext}"`); // .ts

/**
 * Ejemplo con ruta absoluta en Windows
 */
const rutaWindows = "C:\\Users\\PC\\Documentos\\archivo.txt";
const infoWindows = path.parse(rutaWindows);

console.log(`\nRuta Windows: ${rutaWindows}`);
console.log(`  root:  "${infoWindows.root}"`); // C:\
console.log(`  dir:   "${infoWindows.dir}"`); // C:\Users\PC\Documentos
console.log(`  base:  "${infoWindows.base}"`); // archivo.txt
console.log(`  name:  "${infoWindows.name}"`); // archivo
console.log(`  ext:   "${infoWindows.ext}"`); // .txt

// ═════════════════════════════════════════════════════════════════════════════
// 3. CONSTRUIR RUTAS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * path.join(...partes)
 * UNE varias partes en una sola ruta limpia.
 * - Agrega las barras correctas según tu SO
 * - Elimina barras duplicadas
 * - Simplifica "y" y ".."
 * Devuelve RUTA RELATIVA (siempre)
 */
console.log("\n" + "═".repeat(60));
console.log("join: Unir partes de ruta");
console.log("═".repeat(60));

console.log(path.join("src", "common", "repaso", "os.ts"));
// Resultado: src\common\repaso\os.ts (en Windows)

console.log(path.join("./", "king/", "kin2/", "main2.ts"));
// Resultado: king\kin2\main2.ts (limpia barras dobles)

console.log(path.join("/home", "usuario", "docs", "archivo.txt"));
// Resultado: /home/usuario/docs/archivo.txt

console.log(path.join("src", "..", "archivo.txt"));
// Resultado: archivo.txt (resuelve ..)

/**
 * path.resolve(...partes)
 * Convierte una ruta RELATIVA en ABSOLUTA.
 * Usa el directorio actual (cwd) como base.
 * DEVUELVE RUTA ABSOLUTA siempre.
 */
console.log("\n" + "═".repeat(60));
console.log("resolve: Convertir a ruta absoluta");
console.log("═".repeat(60));

console.log(path.resolve("src", "archivo.txt"));
// Resultado: C:\Users\PC\OneDrive\Desktop\NOC\src\archivo.txt

console.log(path.resolve("./docs", "leeme.md"));
// Resultado: C:\Users\PC\OneDrive\Desktop\NOC\docs\leeme.md

console.log(path.resolve("/absoluta", "ruta"));
// Resultado: /absoluta/ruta (si ya es absoluta, la mantiene)

/**
 * DIFERENCIA CLAVE:
 * ┌─────────────────┬─────────────────────────────────────────────┐
 * │ path.join()     │ Une texto → ruta relativa                  │
 * │ path.resolve()  │ Une y convierte a ruta ABSOLUTA            │
 * └─────────────────┴─────────────────────────────────────────────┘
 */
console.log("\n📌 Comparación join vs resolve:");
console.log(`  join("docs", "archivo.txt") = "${path.join("docs", "archivo.txt")}"`);
console.log(`  resolve("docs", "archivo.txt") = "${path.resolve("docs", "archivo.txt")}"`);

/**
 * path.format(info)
 * INVERSO de parse(): reconstruye una ruta desde sus partes
 */
console.log("\n" + "═".repeat(60));
console.log("format: Reconstruir ruta desde partes");
console.log("═".repeat(60));

const partesParaFormat = {
  dir: "./src/componentes",
  name: "boton",
  ext: ".tsx",
};

console.log(`Partes: ${JSON.stringify(partesParaFormat)}`);
console.log(`Ruta reconstruida: ${path.format(partesParaFormat)}`);
// Resultado: src/componentes/boton.tsx

// También se puede usar con el objeto de parse()
console.log(`\nReconstruyendo ruta original con format(parse()):`);
console.log(`${path.format(path.parse(rutaEjemplo))}`);

// ═════════════════════════════════════════════════════════════════════════════
// 4. COMPARAR RUTAS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * path.isAbsolute(ruta)
 * Devuelve true si la ruta es ABSOLUTA (empieza desde la raíz)
 * - true: C:\Users, /home, /var
 * - false: src/docs, ./archivo, ../otro
 */
console.log("\n" + "═".repeat(60));
console.log("isAbsolute: ¿Es ruta absoluta?");
console.log("═".repeat(60));

const rutas = [
  "./../src/main.ts",
  "/home/usuario/main.ts",
  "C:\\Users\\PC\\main.ts",
  "docs/archivo.txt",
  "../otra-carpeta/archivo.txt",
  "C:\\Users\\PC\\OneDrive\\Desktop\\NOC\\src",
];

for (const ruta of rutas) {
  const esAbsoluta = path.isAbsolute(ruta);
  const icono = esAbsoluta ? "🔒" : "📁";
  console.log(`  ${icono} "${ruta}" → ${esAbsoluta ? "Absoluta ✓" : "Relativa"}`);
}

/**
 * path.relative(desde, hasta)
 * Devuelve la ruta RELATIVA desde un punto hasta otro
 */
console.log("\n" + "═".repeat(60));
console.log("relative: Ruta relativa entre dos puntos");
console.log("═".repeat(60));

const desde = path.resolve("./src");
const hasta = path.resolve("./src/common/repaso");

console.log(`Desde: ${desde}`);
console.log(`Hasta: ${hasta}`);
console.log(`Relativa: ${path.relative(desde, hasta)}`);
// Resultado: common\repaso

// ═════════════════════════════════════════════════════════════════════════════
// 5. EJERCICIOS PRÁCTICOS
// ═════════════════════════════════════════════════════════════════════════════

// EJERCICIO 1: Cambiar extensión de archivo
console.log("\n" + "═".repeat(60));
console.log("EJERCICIO 1: Cambiar extensión de archivo");
console.log("═".repeat(60));

function cambiarExtension(archivo: string, nuevaExt: string): string {
  const info = path.parse(archivo);
  return path.format({ ...info, ext: nuevaExt });
}

console.log(`TS → JS: ${cambiarExtension("./src/main.ts", ".js")}`);
// Resultado: src/main.js

console.log(`JS → TS: ${cambiarExtension("./dist/app.js", ".ts")}`);
// Resultado: dist/app.ts

console.log(`TXT → MD: ${cambiarExtension("./docs/leeme.txt", ".md")}`);
// Resultado: docs/leeme.md

// EJERCICIO 2: Obtener información completa de un archivo
console.log("\n" + "═".repeat(60));
console.log("EJERCICIO 2: Análisis completo de archivo");
console.log("═".repeat(60));

function analizarArchivo(ruta: string): void {
  const info = path.parse(ruta);

  console.log(`\n📄 Archivo: ${ruta}`);
  console.log(`   Carpeta:   ${info.dir}`);
  console.log(`   Nombre:    ${info.name}`);
  console.log(`   Extensión: ${info.ext}`);
  console.log(`   Completo:  ${info.base}`);
  console.log(`   Absoluta:  ${path.isAbsolute(ruta) ? "Sí" : "No"}`);
}

analizarArchivo("./src/common/repaso/path.ts");
analizarArchivo("C:\\Users\\PC\\Documentos\\proyecto\\index.html");
analizarArchivo("/var/log/sistema.log");

// EJERCICIO 3: Clasificar archivos por extensión
console.log("\n" + "═".repeat(60));
console.log("EJERCICIO 3: Clasificar archivos por extensión");
console.log("═".repeat(60));

const archivosParaClasificar = [
  "./src/main.ts",
  "./src/utils.js",
  "./docs/leeme.md",
  "./src/app.ts",
  "./dist/bundle.js",
  "./foto.png",
  "./datos.json",
  "./src/componentes/boton.tsx",
  "./backup/datos.csv",
];

function clasificarArchivos(archivos: string[]): Record<string, string[]> {
  const clasificados: Record<string, string[]> = {};

  for (const archivo of archivos) {
    const ext = path.extname(archivo) || "sin-extensión";
    if (!clasificados[ext]) {
      clasificados[ext] = [];
    }
    clasificados[ext].push(archivo);
  }

  return clasificados;
}

const resultadoClasificacion = clasificarArchivos(archivosParaClasificar);

for (const [ext, lista] of Object.entries(resultadoClasificacion)) {
  console.log(`\n${ext}: (${lista.length} archivos)`);
  lista.forEach((archivo) => console.log(`   • ${archivo}`));
}

// EJERCICIO 4: Construir rutas seguras con join
console.log("\n" + "═".repeat(60));
console.log("EJERCICIO 4: Construir ruta de salida de reporte");
console.log("═".repeat(60));

function construirRutaReporte(
  directorioBase: string,
  nombreReporte: string,
  fecha: Date,
  extension: string = ".txt"
): string {
  const fechaStr = fecha.toISOString().split("T")[0] ?? "sin-fecha"; // YYYY-MM-DD
  const carpeta = path.join(directorioBase, "reportes", fechaStr);
  const archivo = `${nombreReporte}-${fechaStr}${extension}`;
  return path.join(carpeta, archivo);
}

const rutaReporte = construirRutaReporte("./output", "ventas", new Date(), ".txt");
console.log(`Ruta del reporte: ${rutaReporte}`);
// Resultado: output/reportes/2026-10-31/ventas-2026-10-31.txt

// EJERCICIO 5: Verificar si dos rutas apuntan al mismo archivo
console.log("\n" + "═".repeat(60));
console.log("EJERCICIO 5: Comparar si dos rutas son el mismo archivo");
console.log("═".repeat(60));

function mismaRuta(ruta1: string, ruta2: string): boolean {
  // Resolver ambas a rutas absolutas y comparar
  return path.resolve(ruta1) === path.resolve(ruta2);
}

console.log(`¿Mismo archivo? ${mismaRuta("./src/app.ts", "./src/../src/app.ts")}`);
// Resultado: true (resuelve ".." correctamente)

console.log(`¿Mismo archivo? ${mismaRuta("./src/app.ts", "./src/main.ts")}`);
// Resultado: false

// EJERCICIO 6: Función que existe? (path + fs)
console.log("\n" + "═".repeat(60));
console.log("EJERCICIO 6: Verificar existencia con path");
console.log("═".repeat(60));

function verificarRuta(ruta: string): string {
  if (!fs.existsSync(ruta)) {
    return "❌ No existe";
  }
  const stats = fs.statSync(ruta);
  if (stats.isDirectory()) {
    return "📁 Es una carpeta";
  }
  return `📄 Es un archivo (${(stats.size / 1024).toFixed(2)} KB)`;
}

console.log(`./package.json → ${verificarRuta("./package.json")}`);
console.log(`./src → ${verificarRuta("./src")}`);
console.log(`./no-existe → ${verificarRuta("./no-existe")}`);

// ═════════════════════════════════════════════════════════════════════════════
// RESUMEN: MÉTODOS DE `path`
// ═════════════════════════════════════════════════════════════════════════════
/*
 * ┌────────────────────────┬─────────────────────────────────────────────┐
 * │ Método                 │ Función                                    │
 * ├────────────────────────┼─────────────────────────────────────────────┤
 * │ basename(ruta)         │ Obtiene nombre del archivo                 │
 * │ dirname(ruta)          │ Obtiene carpeta contenedora                │
 * │ extname(ruta)          │ Obtiene extensión (.ts, .txt, etc)         │
 * │ parse(ruta)            │ Divide ruta en todas sus partes            │
 * │ format(info)           │ Reconstruye ruta desde partes              │
 * │ join(...partes)        │ Une partes → ruta relativa                 │
 * │ resolve(...partes)     │ Une partes → ruta ABSOLUTA                 │
 * │ isAbsolute(ruta)       │ ¿Es ruta absoluta?                         │
 * │ relative(desde, hasta) │ Ruta relativa entre dos puntos             │
 * └────────────────────────┴─────────────────────────────────────────────┘
 *
 * CONSEJO: Usa join() para construir rutas relativas
 *          Usa resolve() cuando necesites rutas absolutas
 */
