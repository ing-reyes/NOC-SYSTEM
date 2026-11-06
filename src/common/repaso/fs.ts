/**
 * ============================================================================
 * MÓDULO `fs` (File System) DE NODE.JS - VERSIÓN SÍNCRONA
 * ============================================================================
 * El módulo `fs` interactúa con archivos y carpetas del disco.
 * Versión SÍNCRONA: usa los métodos con sufijo "Sync" (writeFileSync, etc.)
 * 
 * ⚠️ ADVERTENCIA: Los métodos síncronos BLOQUEAN el proceso hasta terminar.
 *   En producción, prefiero los métodos asincrónicos (ver fs-async.ts)
 *   Los métodos sync son útiles para: scripts simples, configuración inicial,
 *   o cuando necesitas que algo se ejecute ANTES de continuar.
 * ============================================================================
 * Contenido:
 *   1. Verificar existencia
 *   2. Crear y eliminar carpetas
 *   3. Leer y escribir archivos
 *   4. Copiar, mover y renombrar
 *   5. Información de archivos (stat)
 *   6. Listar contenido de carpetas
 *   7. Ejercicios prácticos
 * ============================================================================
 */

import fs from "fs";
import path from "path";

// Ruta base del proyecto (usaremos path.join para construir rutas seguras)
const rutaBase = path.join(__dirname, "..", "..", "..");

// ═════════════════════════════════════════════════════════════════════════════
// 1. VERIFICAR EXISTENCIA
// ═════════════════════════════════════════════════════════════════════════════

/**
 * fs.existsSync(ruta)
 * Devuelve true si la ruta existe, false si no.
 * SÍNCRONO: espera a tener la respuesta.
 */
console.log("─── existsSync ───");

const rutaPackage = path.join(rutaBase, "package.json");
const rutaInexistente = path.join(rutaBase, "no-existe.txt");

console.log(`¿Existe package.json? ${fs.existsSync(rutaPackage)}`);
console.log(`¿Existe no-existe.txt? ${fs.existsSync(rutaInexistente)}`);

/**
 * Ejercicio: Función que verifica y muestra mensaje
 */
function verificarYNotificar(ruta: string): void {
  if (fs.existsSync(ruta)) {
    console.log(`✓ Existe: ${path.basename(ruta)}`);
  } else {
    console.log(`✗ No existe: ${path.basename(ruta)}`);
  }
}

console.log("\nVerificación:");
verificarYNotificar("./package.json");
verificarYNotificar("./tsconfig.json");
verificarYNotificar("./archivo-fantasma.txt");

// ═════════════════════════════════════════════════════════════════════════════
// 2. CREAR Y ELIMINAR CARPETAS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * fs.mkdirSync(ruta, opciones)
 * Crea una carpeta.
 * Opciones: { recursive: true } crea carpetas anidadas si no existen
 */
console.log("\n─── mkdirSync ───");

const rutaDemo = path.join(rutaBase, "demo-sync");

// Crear carpeta simple
if (!fs.existsSync(rutaDemo)) {
  fs.mkdirSync(rutaDemo);
  console.log(`✓ Carpeta creada: demo-sync`);
} else {
  console.log("La carpeta ya existe");
}

// Crear estructura profunda con recursive
const rutaProfunda = path.join(rutaDemo, "nivel1", "nivel2", "nivel3");
fs.mkdirSync(rutaProfunda, { recursive: true });
console.log(`✓ Estructura creada: nivel1/nivel2/nivel3`);

/**
 * fs.rmdirSync(ruta, opciones)
 * Elimina una carpeta.
 * ⚠️ Solo funciona si está VACÍA. Para carpetas con contenido, usa rmSync
 */
// fs.rmdirSync(rutaDemo) // Fallaría si tiene contenido

/**
 * fs.rmSync(ruta, opciones)
 * Elimina carpeta con todo su contenido.
 * Opciones: { recursive: true, force: true }
 *   - recursive: elimina todo lo de adentro
 *   - force: no falla si no existe
 */
function eliminarCarpetaCompleta(ruta: string): boolean {
  if (!fs.existsSync(ruta)) {
    console.log("La carpeta no existe");
    return false;
  }

  try {
    fs.rmSync(ruta, { recursive: true, force: true });
    console.log(`✓ Carpeta eliminada: ${path.basename(ruta)}`);
    return true;
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    return false;
  }
}

// Probar al final del archivo
// eliminarCarpetaCompleta(rutaDemo);

// ═════════════════════════════════════════════════════════════════════════════
// 3. LEER Y ESCRIBIR ARCHIVOS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * fs.writeFileSync(ruta, contenido)
 * Escribe contenido en un archivo (crea si no existe, sobreescribe si existe)
 * ⚠️ BLOQUEA hasta que termine de escribir
 */
console.log("\n─── writeFileSync ───");

const rutaArchivo = path.join(rutaDemo, "ejemplo.txt");
const contenido = `
Hola, este es un archivo creado con Node.js (versión SÍNCRONA)
Fecha: ${new Date().toLocaleString()}
Sistema: ${process.platform}
Directorio: ${__dirname}
`.trim();

fs.writeFileSync(rutaArchivo, contenido);
console.log(`✓ Archivo creado: ejemplo.txt`);

/**
 * fs.readFileSync(ruta, codificacion)
 * Lee el contenido completo de un archivo.
 * codificacion: "utf-8" para texto, no especificar para Buffer binario
 * ⚠️ BLOQUEA hasta terminar de leer
 */
console.log("\n─── readFileSync ───");

const contenidoLeido = fs.readFileSync(rutaArchivo, "utf-8");
console.log("Contenido del archivo:");
console.log("─".repeat(50));
console.log(contenidoLeido);
console.log("─".repeat(50));

/**
 * fs.appendFileSync(ruta, contenido)
 * Agrega contenido al FINAL del archivo (sin sobreescribir)
 */
console.log("\n─── appendFileSync ───");

fs.appendFileSync(rutaArchivo, "\nLínea agregada con appendFileSync");
fs.appendFileSync(rutaArchivo, "\nOtra línea más");

const contenidoActualizado = fs.readFileSync(rutaArchivo, "utf-8");
console.log(`✓ Contenido agregado`);
console.log(`Total de líneas: ${contenidoActualizado.split("\n").length}`);

/**
 * Ejercicio: Crear archivo de configuración JSON
 */
console.log("\n─── Ejercicio: Archivo JSON ───");

const rutaJSON = path.join(rutaDemo, "config.json");
const configuracion = {
  app: "Demo Sync",
  version: "1.0.0",
  opciones: {
    tema: "oscuro",
    idioma: "es",
    notificaciones: true,
  },
  lista: ["uno", "dos", "tres"],
};

// Escribir JSON (JSON.stringify convierte objeto a string)
fs.writeFileSync(rutaJSON, JSON.stringify(configuracion, null, 2));
console.log("✓ Archivo JSON creado");

// Leer y parsear JSON (JSON.parse convierte string a objeto)
const configLeida = JSON.parse(fs.readFileSync(rutaJSON, "utf-8"));
console.log(`✓ JSON leído: app="${configLeida.app}", tema="${configLeida.opciones.tema}"`);

// ═════════════════════════════════════════════════════════════════════════════
// 4. COPIAR, MOVER Y RENOMBRAR
// ═════════════════════════════════════════════════════════════════════════════

/**
 * fs.copyFileSync(origen, destino)
 * Copia un archivo de una ubicación a otra.
 * No copia metadatos ni carpetas.
 */
console.log("\n─── copyFileSync ───");

const rutaCopia = path.join(rutaDemo, "ejemplo-copia.txt");
fs.copyFileSync(rutaArchivo, rutaCopia);
console.log("✓ Archivo copiado");

// Verificar que ambos existen
console.log(`   Original: ${fs.existsSync(rutaArchivo)}`);
console.log(`   Copia: ${fs.existsSync(rutaCopia)}`);

/**
 * fs.renameSync(origen, destino)
 * Renombra o mueve un archivo/carpeta.
 * - Mismo directorio → renombra
 * - Diferente directorio → mueve
 * ⚠️ En Windows falla si el destino ya existe
 */
console.log("\n─── renameSync ───");

const rutaRenombrado = path.join(rutaDemo, "archivo-renombrado.txt");
fs.renameSync(rutaCopia, rutaRenombrado);
console.log("✓ Archivo renombrado");

// Mover a otra ubicación
const rutaMovido = path.join(rutaDemo, "nivel1", "movido.txt");
fs.renameSync(rutaRenombrado, rutaMovido);
console.log("✓ Archivo movido a nivel1/");

/**
 * fs.unlinkSync(ruta)
 * Elimina un archivo.
 * ⚠️ No sirve para carpetas (usa rmSync)
 */
console.log("\n─── unlinkSync ───");

if (fs.existsSync(rutaMovido)) {
  fs.unlinkSync(rutaMovido);
  console.log("✓ Archivo eliminado");
}

// ═════════════════════════════════════════════════════════════════════════════
// 5. INFORMACIÓN DE ARCHIVOS (STAT)
// ═════════════════════════════════════════════════════════════════════════════

/**
 * fs.statSync(ruta)
 * Devuelve información detallada sobre un archivo/carpeta:
 * - size: tamaño en bytes
 * - isFile(): ¿es archivo?
 * - isDirectory(): ¿es carpeta?
 * - birthtime: fecha de creación
 * - mtime: última modificación
 * - mode: permisos
 */
console.log("\n─── statSync ───");

const stats = fs.statSync(rutaPackage);

console.log(`Archivo: package.json`);
console.log(`  Tamaño: ${stats.size} bytes (${(stats.size / 1024).toFixed(2)} KB)`);
console.log(`  ¿Es archivo? ${stats.isFile()}`);
console.log(`  ¿Es carpeta? ${stats.isDirectory()}`);
console.log(`  Creado: ${stats.birthtime.toLocaleString()}`);
console.log(`  Modificado: ${stats.mtime.toLocaleString()}`);

/**
 * Ejercicio: Función para mostrar info de cualquier ruta
 */
function mostrarInfoRuta(ruta: string): void {
  console.log(`\n📋 Info: ${path.basename(ruta)}`);

  if (!fs.existsSync(ruta)) {
    console.log("   ❌ No existe");
    return;
  }

  const stats = fs.statSync(ruta);

  if (stats.isDirectory()) {
    console.log(`   📁 Es una CARPETA`);
    const archivos = fs.readdirSync(ruta);
    console.log(`   Contiene ${archivos.length} elementos`);
  } else {
    console.log(`   📄 Es un ARCHIVO`);
    console.log(`   Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`   Extensión: ${path.extname(ruta)}`);
  }
}

mostrarInfoRuta("./package.json");
mostrarInfoRuta("./src");
mostrarInfoRuta("./no-existe");

// ═════════════════════════════════════════════════════════════════════════════
// 6. LISTAR CONTENIDO DE CARPETAS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * fs.readdirSync(ruta)
 * Devuelve un array con los nombres de los archivos/carpetas dentro de una ruta.
 * Opciones: { withFileTypes: true } → devuelve objetos con info de tipo
 */
console.log("\n─── readdirSync ───");

const rutaSrc = path.join(rutaBase, "src");

if (fs.existsSync(rutaSrc)) {
  const archivos = fs.readdirSync(rutaSrc);
  console.log(`Contenido de src/ (${archivos.length} elementos):`);
  archivos.forEach((archivo, i) => {
    console.log(`  ${i + 1}. ${archivo}`);
  });

  // Con withFileTypes: obtener info de cada elemento
  console.log("\nCon detalles (withFileTypes):");
  const items = fs.readdirSync(rutaSrc, { withFileTypes: true });
  items.forEach((item) => {
    const icono = item.isDirectory() ? "📁" : "📄";
    console.log(`  ${icono} ${item.name}`);
  });
}

/**
 * Ejercicio: Listar solo archivos .ts en una carpeta
 */
function listarArchivosTS(directorio: string): string[] {
  if (!fs.existsSync(directorio)) {
    return [];
  }

  const items = fs.readdirSync(directorio, { withFileTypes: true });
  const archivosTS = items
    .filter((item) => item.isFile() && item.name.endsWith(".ts"))
    .map((item) => item.name);

  return archivosTS;
}

console.log("\nArchivos .ts en src/:");
const archivosTS = listarArchivosTS(rutaSrc);
archivosTS.forEach((f) => console.log(`  • ${f}`));

// ═════════════════════════════════════════════════════════════════════════════
// 7. EJERCICIOS PRÁCTICOS
// ═════════════════════════════════════════════════════════════════════════════

// EJERCICIO 1: Sistema de logs simple
console.log("\n" + "═".repeat(60));
console.log("EJERCICIO 1: Sistema de Logs");
console.log("═".repeat(60));

class LoggerSync {
  private rutaLog: string;

  constructor(rutaLog: string) {
    this.rutaLog = rutaLog;
    // Asegurar que la carpeta existe
    const carpeta = path.dirname(rutaLog);
    if (!fs.existsSync(carpeta)) {
      fs.mkdirSync(carpeta, { recursive: true });
    }
  }

  log(mensaje: string): void {
    const timestamp = new Date().toISOString();
    const linea = `[${timestamp}] LOG: ${mensaje}\n`;
    fs.appendFileSync(this.rutaLog, linea);
    console.log(`📝 ${mensaje}`);
  }

  error(mensaje: string): void {
    const timestamp = new Date().toISOString();
    const linea = `[${timestamp}] ERROR: ${mensaje}\n`;
    fs.appendFileSync(this.rutaLog, linea);
    console.error(`❌ ${mensaje}`);
  }

  leerLog(): string {
    if (!fs.existsSync(this.rutaLog)) {
      return "(sin logs)";
    }
    return fs.readFileSync(this.rutaLog, "utf-8");
  }
}

const logger = new LoggerSync(path.join(rutaDemo, "app.log"));
logger.log("Aplicación iniciada");
logger.log("Usuario conectado");
logger.error("Error de conexión");
logger.log("Reconectado exitosamente");

console.log("\nContenido del log:");
console.log(logger.leerLog());

// EJERCICIO 2: Copia de seguridad automática
console.log("═".repeat(60));
console.log("EJERCICIO 2: Copia de Seguridad");
console.log("═".repeat(60));

function copiaSeguridad(origen: string, carpetaBackup: string): boolean {
  try {
    if (!fs.existsSync(origen)) {
      throw new Error("El archivo de origen no existe");
    }

    // Crear carpeta backup si no existe
    if (!fs.existsSync(carpetaBackup)) {
      fs.mkdirSync(carpetaBackup, { recursive: true });
    }

    // Generar nombre con fecha
    const fecha = new Date().toISOString().replace(/[:.]/g, "-");
    const nombreOriginal = path.basename(origen);
    const nombreBackup = `${fecha}_${nombreOriginal}`;
    const destino = path.join(carpetaBackup, nombreBackup);

    // Copiar
    fs.copyFileSync(origen, destino);
    console.log(`✓ Backup creado: ${nombreBackup}`);

    return true;
  } catch (error: any) {
    console.error(`Error en backup: ${error.message}`);
    return false;
  }
}

copiaSeguridad("./package.json", path.join(rutaDemo, "backups"));

// EJERCICIO 3: Buscador de archivos por extensión
console.log("\n" + "═".repeat(60));
console.log("EJERCICIO 3: Buscador de Archivos");
console.log("═".repeat(60));

function buscarArchivos(directorio: string, extension: string): string[] {
  const resultados: string[] = [];

  function buscar(dir: string): void {
    try {
      const items = fs.readdirSync(dir, { withFileTypes: true });

      for (const item of items) {
        const rutaCompleta = path.join(dir, item.name);

        if (item.isDirectory()) {
          buscar(rutaCompleta); // Recursión: buscar en subcarpetas
        } else if (item.name.endsWith(extension)) {
          resultados.push(rutaCompleta);
        }
      }
    } catch (error) {
      // Ignorar carpetas sin permisos
    }
  }

  buscar(directorio);
  return resultados;
}

console.log(`Buscando archivos .ts en src/...`);
const encontrados = buscarArchivos(path.join(rutaBase, "src"), ".ts");
encontrados.forEach((f) => {
  console.log(`  • ${path.relative(rutaBase, f)}`);
});
console.log(`\nTotal encontrados: ${encontrados.length}`);

// EJERCICIO 4: Generador de reportes
console.log("\n" + "═".repeat(60));
console.log("EJERCICIO 4: Generador de Reportes");
console.log("═".repeat(60));

function generarReporte(directorio: string): string {
  const lineas: string[] = [];
  lineas.push("REPORTE DE DIRECTORIO");
  lineas.push("=".repeat(60));
  lineas.push(`Directorio: ${directorio}`);
  lineas.push(`Fecha: ${new Date().toLocaleString()}`);
  lineas.push("");

  if (!fs.existsSync(directorio)) {
    lineas.push("❌ El directorio no existe");
    return lineas.join("\n");
  }

  const items = fs.readdirSync(directorio, { withFileTypes: true });

  let totalArchivos = 0;
  let totalCarpetas = 0;
  let tamanoTotal = 0;

  lineas.push("CONTENIDO:");
  lineas.push("-".repeat(60));

  for (const item of items.sort((a, b) => a.name.localeCompare(b.name))) {
    const rutaCompleta = path.join(directorio, item.name);

    if (item.isDirectory()) {
      totalCarpetas++;
      lineas.push(`📁 ${item.name}/`);
    } else {
      totalArchivos++;
      const stats = fs.statSync(rutaCompleta);
      tamanoTotal += stats.size;
      lineas.push(`📄 ${item.name} (${(stats.size / 1024).toFixed(2)} KB)`);
    }
  }

  lineas.push("");
  lineas.push("RESUMEN:");
  lineas.push("-".repeat(60));
  lineas.push(`Carpetas: ${totalCarpetas}`);
  lineas.push(`Archivos: ${totalArchivos}`);
  lineas.push(`Tamaño total: ${(tamanoTotal / 1024).toFixed(2)} KB`);
  lineas.push("=".repeat(60));

  return lineas.join("\n");
}

const reporte = generarReporte(path.join(rutaBase, "src"));
console.log(reporte);

// Guardar reporte en archivo
const rutaReporte = path.join(rutaDemo, "reporte.txt");
fs.writeFileSync(rutaReporte, reporte);
console.log(`\n✓ Reporte guardado en: ${path.basename(rutaReporte)}`);

// ═════════════════════════════════════════════════════════════════════════════
// LIMPIEZA: Eliminar carpeta demo
// ═════════════════════════════════════════════════════════════════════════════

console.log("\n" + "═".repeat(60));
console.log("LIMPIEZA");
console.log("═".repeat(60));

if (fs.existsSync(rutaDemo)) {
  fs.rmSync(rutaDemo, { recursive: true, force: true });
  console.log("✓ Carpeta 'demo-sync' eliminada");
}

// ═════════════════════════════════════════════════════════════════════════════
// RESUMEN: MÉTODOS SÍNCRONOS DE `fs`
// ═════════════════════════════════════════════════════════════════════════════
/*
 * ┌─────────────────────────┬────────────────────────────────────────────┐
 * │ Método                  │ Función                                   │
 * ├─────────────────────────┼────────────────────────────────────────────┤
 * │ existsSync(ruta)        │ ¿Existe? true/false                       │
 * │ mkdirSync(ruta, opts)   │ Crear carpeta                             │
 * │ rmdirSync(ruta)         │ Eliminar carpeta vacía                    │
 * │ rmSync(ruta, opts)      │ Eliminar carpeta con contenido            │
 * │ writeFileSync(ruta,dat) │ Escribir/crear archivo                    │
 * │ readFileSync(ruta,enc)  │ Leer archivo completo                     │
 * │ appendFileSync(ruta,dat)│ Agregar al final del archivo              │
 * │ copyFileSync(orig,dest) │ Copiar archivo                            │
 * │ renameSync(orig,dest)   │ Renombrar/mover archivo                   │
 * │ unlinkSync(ruta)        │ Eliminar archivo                          │
 * │ statSync(ruta)          │ Info del archivo (tamaño, fechas)         │
 * │ readdirSync(ruta)       │ Listar contenido de carpeta               │
 * └─────────────────────────┴────────────────────────────────────────────┘
 *
 * ⚠️ IMPORTANTE: Estos métodos BLOQUEAN el proceso hasta terminar.
 *   Para no bloquear, usa fs-async.ts (promesas o callbacks)
 */
