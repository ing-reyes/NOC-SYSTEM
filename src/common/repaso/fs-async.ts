/**
 * ============================================================================
 * MÓDULO `fs` (File System) DE NODE.JS - VERSIÓN ASINCRÓNICA
 * ============================================================================
 * El módulo `fs` interactúa con archivos y carpetas del disco.
 * Versión ASINCRÓNICA: no bloquea el proceso, permite manejar múltiples
 * operaciones simultáneamente.
 * 
 * Hay 2 formas de hacer operaciones asincrónicas:
 *   1. Callbacks: fs.readFile(ruta, (err, data) => {...})
 *   2. Promesas:  await fs.promises.readFile(ruta)
 * 
 * RECOMENDADO: Usa Promesas con async/await (código más limpio y legible)
 * ============================================================================
 * Contenido:
 *   1. Operaciones con Promesas (async/await)
 *   2. Operaciones con Callbacks
 *   3. Ejemplos prácticos avanzados
 *   4. Ejercicio: Sistema de archivos completo
 * ============================================================================
 */

import fs from "fs";
import { promisify } from "util";
import path from "path";

// Importar la API de promesas de fs
const fsPromises = fs.promises;

// Ruta base del proyecto
const rutaBase = path.join(__dirname, "..", "..", "..");

// ═════════════════════════════════════════════════════════════════════════════
// 1. OPERACIONES CON PROMESAS (RECOMENDADO)
// ═════════════════════════════════════════════════════════════════════════════

async function demostracionBasica(): Promise<void> {
  console.log("═".repeat(60));
  console.log("1. OPERACIONES CON PROMESAS (async/await)");
  console.log("═".repeat(60));

  const rutaDemo = path.join(rutaBase, "demo-async");
  const rutaArchivo = path.join(rutaDemo, "ejemplo.txt");

  try {
    // CREAR CARPETA (async)
    // fsPromises.mkdir(ruta, { recursive: true })
    await fsPromises.mkdir(rutaDemo, { recursive: true });
    console.log("✓ Carpeta creada");

    // ESCRIBIR ARCHIVO (async)
    // No bloquea el proceso - puede hacer otras cosas mientras escribe
    const contenido = `
Archivo creado de forma ASINCRÓNICA
Fecha: ${new Date().toLocaleString()}
Método: fs.promises.writeFile()
    `.trim();

    await fsPromises.writeFile(rutaArchivo, contenido);
    console.log("✓ Archivo escrito");

    // LEER ARCHIVO (async)
    const contenidoLeido = await fsPromises.readFile(rutaArchivo, "utf-8");
    console.log("✓ Archivo leído");
    console.log("─".repeat(50));
    console.log(contenidoLeido);
    console.log("─".repeat(50));

    // AGREGAR CONTENIDO (async)
    await fsPromises.appendFile(rutaArchivo, "\nLínea agregada de forma async");
    console.log("✓ Contenido agregado");

    // OBTENER INFO (async)
    const stats = await fsPromises.stat(rutaArchivo);
    console.log(`✓ Tamaño: ${stats.size} bytes`);
    console.log(`✓ Modificado: ${stats.mtime.toLocaleString()}`);

    // LISTAR CONTENIDO DE CARPETA (async)
    const archivos = await fsPromises.readdir(rutaDemo);
    console.log(`✓ Archivos en carpeta: ${archivos.join(", ")}`);

    // LISTAR CON DETALLES (async)
    const items = await fsPromises.readdir(rutaDemo, { withFileTypes: true });
    console.log("✓ Con detalles:");
    items.forEach((item) => {
      const icono = item.isDirectory() ? "📁" : "📄";
      console.log(`   ${icono} ${item.name}`);
    });

    // VERIFICAR EXISTENCIA (async)
    try {
      await fsPromises.access(rutaArchivo);
      console.log("✓ El archivo existe (access exitoso)");
    } catch {
      console.log("✗ El archivo no existe");
    }

    // COPIAR ARCHIVO (async)
    const rutaCopia = path.join(rutaDemo, "copia.txt");
    await fsPromises.copyFile(rutaArchivo, rutaCopia);
    console.log("✓ Archivo copiado");

    // RENOMBRAR/MOVER (async)
    const rutaRenombrado = path.join(rutaDemo, "renombrado.txt");
    await fsPromises.rename(rutaCopia, rutaRenombrado);
    console.log("✓ Archivo renombrado");

    // ELIMINAR ARCHIVO (async)
    await fsPromises.unlink(rutaRenombrado);
    console.log("✓ Archivo eliminado");

    // ELIMINAR CARPETA CON CONTENIDO (async)
    await fsPromises.rm(rutaDemo, { recursive: true, force: true });
    console.log("✓ Carpeta demo eliminada");

  } catch (error: any) {
    console.error(`❌ Error: ${error.message}`);
  }
}

demostracionBasica();

// ═════════════════════════════════════════════════════════════════════════════
// 2. OPERACIONES CON CALLBACKS (forma antigua)
// ═════════════════════════════════════════════════════════════════════════════
// Los callbacks son la forma original de Node.js. Todavía se usan, pero
// async/await es más limpo y fácil de leer.

function demostracionCallbacks(): void {
  console.log("\n" + "═".repeat(60));
  console.log("2. OPERACIONES CON CALLBACKS (forma tradicional)");
  console.log("═".repeat(60));

  const rutaDemo = path.join(rutaBase, "demo-callbacks");
  const rutaArchivo = path.join(rutaDemo, "con-callback.txt");

  // Crear carpeta con callback
  fs.mkdir(rutaDemo, { recursive: true }, (err) => {
    if (err) {
      console.error("Error creando carpeta:", err.message);
      return;
    }
    console.log("✓ Carpeta creada (callback)");

    // Escribir archivo con callback
    const contenido = "Archivo con callback asíncrono";
    fs.writeFile(rutaArchivo, contenido, (err) => {
      if (err) {
        console.error("Error escribiendo:", err.message);
        return;
      }
      console.log("✓ Archivo escrito (callback)");

      // Leer archivo con callback
      fs.readFile(rutaArchivo, "utf-8", (err, data) => {
        if (err) {
          console.error("Error leyendo:", err.message);
          return;
        }
        console.log("✓ Archivo leído (callback):");
        console.log(`   Contenido: ${data}`);

        // Limpiar
        fs.rm(rutaDemo, { recursive: true, force: true }, (err) => {
          if (err) {
            console.error("Error limpiando:", err.message);
            return;
          }
          console.log("✓ Carpeta eliminada (callback)\n");
        });
      });
    });
  });
}

demostracionCallbacks();

// ═════════════════════════════════════════════════════════════════════════════
// 3. EJEMPLOS PRÁCTICOS AVANZADOS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Ejemplo 1: Leer múltiples archivos en PARALELO (Promise.all)
 * Ventaja: es mucho más rápido que leerlos uno por uno
 */
async function leerArchivosEnParalelo(rutas: string[]): Promise<Map<string, string>> {
  console.log("\n📖 Ejemplo: Leer archivos en paralelo");

  try {
    // Promise.all ejecuta TODAS las promesas simultáneamente
    const promesas = rutas.map(async (ruta) => {
      try {
        const contenido = await fsPromises.readFile(ruta, "utf-8");
        return { ruta, contenido, exito: true };
      } catch {
        return { ruta, contenido: "", exito: false };
      }
    });

    const resultados = await Promise.all(promesas);

    const mapa = new Map<string, string>();
    for (const resultado of resultados) {
      if (resultado.exito) {
        mapa.set(resultado.ruta, resultado.contenido);
        console.log(`   ✓ ${path.basename(resultado.ruta)}`);
      } else {
        console.log(`   ✗ ${path.basename(resultado.ruta)} (error)`);
      }
    }

    return mapa;
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    return new Map();
  }
}

/**
 * Ejemplo 2: Escribir archivos secuencialmente
 */
async function escribirArchivosSecuencial(
  carpeta: string,
  archivos: Record<string, string>
): Promise<void> {
  console.log("\n✍️  Ejemplo: Escribir archivos secuencialmente");

  try {
    await fsPromises.mkdir(carpeta, { recursive: true });

    for (const [nombre, contenido] of Object.entries(archivos)) {
      const ruta = path.join(carpeta, nombre);
      await fsPromises.writeFile(ruta, contenido);
      console.log(`   ✓ ${nombre}`);
    }
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
  }
}

/**
 * Ejemplo 3: Buscar archivos de forma recursiva (async)
 */
async function buscarArchivosAsync(
  directorio: string,
  condicion: (nombre: string) => boolean
): Promise<string[]> {
  const resultados: string[] = [];

  async function buscar(dir: string): Promise<void> {
    try {
      const items = await fsPromises.readdir(dir, { withFileTypes: true });

      for (const item of items) {
        const rutaCompleta = path.join(dir, item.name);

        if (item.isDirectory()) {
          await buscar(rutaCompleta); // Recursión async
        } else if (condicion(item.name)) {
          resultados.push(rutaCompleta);
        }
      }
    } catch {
      // Ignorar errores de permisos
    }
  }

  await buscar(directorio);
  return resultados;
}

/**
 * Ejemplo 4: Copia de seguridad incremental
 */
async function backupIncremental(
  origen: string,
  destino: string
): Promise<{ copiados: number; omitidos: number }> {
  console.log("\n💾 Ejemplo: Backup incremental");

  let copiados = 0;
  let omitidos = 0;

  try {
    await fsPromises.mkdir(destino, { recursive: true });

    const archivos = await buscarArchivosAsync(origen, () => true);

    for (const archivo of archivos) {
      const relativo = path.relative(origen, archivo);
      const rutaDestino = path.join(destino, relativo);

      try {
        // Verificar si ya existe y es más reciente
        const statsOrigen = await fsPromises.stat(archivo);

        try {
          const statsDestino = await fsPromises.stat(rutaDestino);
          if (statsDestino.mtime >= statsOrigen.mtime) {
            omitidos++;
            continue; // Ya está actualizado
          }
        } catch {
          // No existe en destino, hay que copiar
        }

        // Crear carpeta destino si no existe
        await fsPromises.mkdir(path.dirname(rutaDestino), { recursive: true });
        await fsPromises.copyFile(archivo, rutaDestino);
        copiados++;

      } catch {
        // Ignorar error en este archivo
      }
    }

    console.log(`   Copiados: ${copiados}, Omitidos: ${omitidos}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
  }

  return { copiados, omitidos };
}

// ═════════════════════════════════════════════════════════════════════════════
// 4. EJERCICIO: SISTEMA DE ARCHIVOS COMPLETO
// ═════════════════════════════════════════════════════════════════════════════

class SistemaArchivosAsync {
  private baseDir: string;

  constructor(baseDir: string) {
    this.baseDir = baseDir;
  }

  private getRuta(rutaRelativa: string): string {
    return path.resolve(this.baseDir, rutaRelativa);
  }

  /**
   * Verificar si existe
   */
  async existe(rutaRelativa: string): Promise<boolean> {
    try {
      await fsPromises.access(this.getRuta(rutaRelativa));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Crear carpeta (si no existe)
   */
  async crearCarpeta(rutaRelativa: string): Promise<void> {
    await fsPromises.mkdir(this.getRuta(rutaRelativa), { recursive: true });
  }

  /**
   * Escribir archivo (crea carpeta si no existe)
   */
  async escribir(rutaRelativa: string, contenido: string): Promise<void> {
    const ruta = this.getRuta(rutaRelativa);
    await fsPromises.mkdir(path.dirname(ruta), { recursive: true });
    await fsPromises.writeFile(ruta, contenido, "utf-8");
  }

  /**
   * Escribir JSON
   */
  async escribirJSON(rutaRelativa: string, datos: any): Promise<void> {
    const contenido = JSON.stringify(datos, null, 2);
    await this.escribir(rutaRelativa, contenido);
  }

  /**
   * Leer archivo
   */
  async leer(rutaRelativa: string): Promise<string> {
    const contenido = await fsPromises.readFile(this.getRuta(rutaRelativa), "utf-8");
    return contenido;
  }

  /**
   * Leer JSON
   */
  async leerJSON<T = any>(rutaRelativa: string): Promise<T> {
    const contenido = await this.leer(rutaRelativa);
    return JSON.parse(contenido) as T;
  }

  /**
   * Agregar contenido al final
   */
  async agregar(rutaRelativa: string, contenido: string): Promise<void> {
    await fsPromises.appendFile(this.getRuta(rutaRelativa), contenido, "utf-8");
  }

  /**
   * Eliminar archivo
   */
  async eliminar(rutaRelativa: string): Promise<void> {
    await fsPromises.unlink(this.getRuta(rutaRelativa));
  }

  /**
   * Eliminar carpeta con contenido
   */
  async eliminarCarpeta(rutaRelativa: string): Promise<void> {
    await fsPromises.rm(this.getRuta(rutaRelativa), { recursive: true, force: true });
  }

  /**
   * Copiar archivo
   */
  async copiar(origen: string, destino: string): Promise<void> {
    const rutaOrigen = this.getRuta(origen);
    const rutaDestino = this.getRuta(destino);

    await fsPromises.mkdir(path.dirname(rutaDestino), { recursive: true });
    await fsPromises.copyFile(rutaOrigen, rutaDestino);
  }

  /**
   * Listar contenido de carpeta
   */
  async listar(rutaRelativa: string = "."): Promise<string[]> {
    const archivos = await fsPromises.readdir(this.getRuta(rutaRelativa));
    return archivos;
  }

  /**
   * Obtener info de archivo
   */
  async info(rutaRelativa: string): Promise<{
    existe: boolean;
    esDirectorio: boolean;
    tamano?: number;
    modificado?: Date;
  }> {
    const ruta = this.getRuta(rutaRelativa);

    try {
      const stats = await fsPromises.stat(ruta);
      return {
        existe: true,
        esDirectorio: stats.isDirectory(),
        tamano: stats.size,
        modificado: stats.mtime,
      };
    } catch {
      return { existe: false, esDirectorio: false };
    }
  }

  /**
   * Buscar archivos por extensión
   */
  async buscar(extension: string, rutaRelativa: string = "."): Promise<string[]> {
    return buscarArchivosAsync(
      this.getRuta(rutaRelativa),
      (nombre) => nombre.endsWith(extension)
    );
  }

  /**
   * Crear backup de una carpeta
   */
  async backup(rutaOrigen: string, nombreBackup?: string): Promise<string> {
    const fecha = new Date().toISOString().replace(/[:.]/g, "-");
    const nombre = nombreBackup || `backup-${fecha}`;
    const rutaDestino = path.join(this.baseDir, "backups", nombre);

    await backupIncremental(this.getRuta(rutaOrigen), rutaDestino);
    return rutaDestino;
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// EJEMPLOS DE USO DEL SISTEMA
// ═════════════════════════════════════════════════════════════════════════════

async function ejemplosSistema(): Promise<void> {
  console.log("\n" + "═".repeat(60));
  console.log("SISTEMA DE ARCHIVOS ASYNC - EJEMPLOS");
  console.log("═".repeat(60));

  const sistema = new SistemaArchivosAsync("./mi-proyecto-async");

  try {
    // Ejemplo 1: Crear estructura
    console.log("\n📁 Ejemplo 1: Crear estructura de proyecto");
    await sistema.escribir("src/index.ts", "console.log('Hola Mundo');");
    await sistema.escribir("src/utils/helper.ts", "export const util = () => {};");
    await sistema.escribir("docs/leeme.md", "# Mi Proyecto\n\nDescripción aquí");
    await sistema.escribirJSON("package.json", {
      nombre: "mi-proyecto",
      version: "1.0.0",
    });
    console.log("   ✓ Estructura creada");

    // Ejemplo 2: Leer archivos
    console.log("\n📖 Ejemplo 2: Leer archivos");
    const index = await sistema.leer("src/index.ts");
    console.log(`   index.ts: ${index.substring(0, 30)}...`);

    const config = await sistema.leerJSON("package.json");
    console.log(`   package.json: ${config.nombre} v${config.version}`);

    // Ejemplo 3: Listar contenido
    console.log("\n📋 Ejemplo 3: Listar contenido");
    const archivosSrc = await sistema.listar("src");
    console.log(`   src/: ${archivosSrc.join(", ")}`);

    // Ejemplo 4: Info de archivo
    console.log("\n📊 Ejemplo 4: Info de archivo");
    const info = await sistema.info("src/index.ts");
    console.log(`   Tamaño: ${info.tamano} bytes`);
    console.log(`   Modificado: ${info.modificado?.toLocaleString()}`);

    // Ejemplo 5: Buscar archivos
    console.log("\n🔍 Ejemplo 5: Buscar archivos .ts");
    const archivosTs = await sistema.buscar(".ts");
    archivosTs.forEach((f) => {
      console.log(`   • ${path.relative(process.cwd(), f)}`);
    });

    // Ejemplo 6: Agregar a log
    console.log("\n📝 Ejemplo 6: Sistema de logs");
    await sistema.escribir("logs/app.log", "");
    for (let i = 1; i <= 5; i++) {
      await sistema.agregar(
        "logs/app.log",
        `[${new Date().toISOString()}] Evento ${i}\n`
      );
    }
    const logs = await sistema.leer("logs/app.log");
    console.log(`   Total líneas de log: ${logs.split("\n").length - 1}`);

    // Ejemplo 7: Copia de seguridad
    console.log("\n💾 Ejemplo 7: Copia de seguridad");
    const rutaBackup = await sistema.backup("src");
    console.log(`   Backup creado en: ${path.relative(process.cwd(), rutaBackup)}`);

    // Ejemplo 8: Leer múltiples archivos en paralelo
    console.log("\n⚡ Ejemplo 8: Lectura en paralelo");
    const rutas = [
      sistema["getRuta"]("src/index.ts"),
      sistema["getRuta"]("src/utils/helper.ts"),
      sistema["getRuta"]("package.json"),
    ];
    const contenidos = await leerArchivosEnParalelo(rutas);
    console.log(`   Archivos leídos: ${contenidos.size}`);

    // Limpiar
    console.log("\n🧹 Limpiando...");
    await sistema.eliminarCarpeta(".");
    console.log("   ✓ Proyecto temporal eliminado");

    console.log("\n✅ Todos los ejemplos completados exitosamente!");

  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}`);
  }
}

ejemplosSistema();

// ═════════════════════════════════════════════════════════════════════════════
// EJERCICIO FINAL: API DE ARCHIVOS PARA SERVIDOR WEB
// ═════════════════════════════════════════════════════════════════════════════

class ServidorArchivos {
  private directorioPublico: string;

  constructor(directorioPublico: string) {
    this.directorioPublico = directorioPublico;
  }

  /**
   * Servir un archivo estático (como hace un servidor web)
   */
  async servirArchivo(rutaRelativa: string): Promise<{
    exito: boolean;
    contenido?: Buffer | string;
    tipoMime?: string;
    error?: string;
  }> {
    try {
      // Prevenir ataques de path traversal (../../etc/passwd)
      const rutaLimpia = path.normalize(rutaRelativa).replace(/^(\.\.(\/|\\|$))+/, "");
      const rutaCompleta = path.join(this.directorioPublico, rutaLimpia);

      // Verificar que esté dentro del directorio público
      if (!rutaCompleta.startsWith(path.resolve(this.directorioPublico))) {
        return { exito: false, error: "Acceso denegado" };
      }

      // Verificar existencia
      const stats = await fsPromises.stat(rutaCompleta);
      if (stats.isDirectory()) {
        return { exito: false, error: "Es un directorio" };
      }

      // Determinar tipo MIME
      const ext = path.extname(rutaCompleta).toLowerCase();
      const tiposMime: Record<string, string> = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "application/javascript",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".txt": "text/plain",
      };

      // Leer archivo
      const contenido = await fsPromises.readFile(rutaCompleta);

      return {
        exito: true,
        contenido,
        tipoMime: tiposMime[ext] || "application/octet-stream",
      };

    } catch (error: any) {
      return { exito: false, error: error.message };
    }
  }

  /**
   * Listar archivos disponibles
   */
  async listarArchivos(): Promise<{ nombre: string; tamano: number; tipo: string }[]> {
    try {
      const items = await fsPromises.readdir(this.directorioPublico, {
        withFileTypes: true,
      });

      const archivos = [];
      for (const item of items) {
        if (item.isFile()) {
          const ruta = path.join(this.directorioPublico, item.name);
          const stats = await fsPromises.stat(ruta);
          archivos.push({
            nombre: item.name,
            tamano: stats.size,
            tipo: path.extname(item.name),
          });
        }
      }

      return archivos;
    } catch {
      return [];
    }
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// RESUMEN: ASINCRÓNICO vs SÍNCRONO
// ═════════════════════════════════════════════════════════════════════════════
/*
 * ┌─────────────────────────┬─────────────────────┬─────────────────────┐
 * │ Operación               │ SÍNCRONO            │ ASINCRÓNICO         │
 * │                         │ (bloquea)           │ (no bloquea)        │
 * ├─────────────────────────┼─────────────────────┼─────────────────────┤
 * │ Leer archivo            │ readFileSync()      │ await readFile()    │
 * │ Escribir archivo        │ writeFileSync()     │ await writeFile()   │
 * │ Agregar contenido       │ appendFileSync()    │ await appendFile()  │
 * │ Crear carpeta           │ mkdirSync()         │ await mkdir()       │
 * │ Eliminar carpeta        │ rmSync()            │ await rm()          │
 * │ Copiar archivo          │ copyFileSync()      │ await copyFile()    │
 * │ Renombrar               │ renameSync()        │ await rename()      │
 * │ Eliminar archivo        │ unlinkSync()        │ await unlink()      │
 * │ Info de archivo         │ statSync()          │ await stat()        │
 * │ Listar carpeta          │ readdirSync()       │ await readdir()     │
 * │ Verificar existencia    │ existsSync()        │ await access()      │
 * └─────────────────────────┴─────────────────────┴─────────────────────┘
 *
 * ¿CUÁNDO USAR CADA UNO?
 * 
 * SÍNCRONO:
 *   - Scripts simples que se ejecutan una vez
 *   - Archivos de configuración al iniciar
 *   - Cuando necesitas que algo se complete ANTES de continuar
 *   - Pruebas y scripts de terminal
 * 
 * ASINCRÓNICO:
 *   - Servidores web y APIs (MUY importante)
 *   - Cuando manejas muchas peticiones simultáneas
 *   - Operaciones que toman tiempo (muchos archivos)
 *   - Cualquier aplicación en producción
 *
 * RECOMENDACIÓN: Usa ASINCRÓNICO con async/await siempre que puedas.
 *   Es más rápido y no bloquea el evento de Node.js.
 */
