/**
 * ============================================================================
 * MÓDULO `path` DE NODE.JS - VERSIÓN ASINCRÓNICA
 * ============================================================================
 * NOTA IMPORTANTE: El módulo `path` NO tiene métodos asincrónicos nativos.
 * Los métodos de path son operaciones matemáticas puras sobre strings de texto
 * - no acceden al disco duro - por lo tanto son instantáneos y síncronos.
 *
 * Sin embargo, en este archivo mostraremos cómo combinar `path` con
 * operaciones ASINCRÓNICAS reales (como leer archivos con fs.promises).
 * ============================================================================
 * Contenido:
 *   1. Funciones async que combinan path con fs.promises
 *   2. Clase asíncrona para gestión de archivos
 *   3. Utilidades async para trabajar con rutas
 *   4. Ejercicio práctico: Explorador de directorios async
 * ============================================================================
 */

import path from "node:path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

// ═════════════════════════════════════════════════════════════════════════════
// 1. FUNCIONES ASYNC QUE COMBINAN path CON fs.promises
// ═════════════════════════════════════════════════════════════════════════════
// Aquí es donde realmente necesitamos async: cuando accedemos al disco.

/**
 * Ejercicio 1: Verificar si un archivo existe de forma asincrónica
 */
async function existeArchivo(ruta: string): Promise<boolean> {
  try {
    await fs.access(ruta);
    return true;
  } catch {
    return false;
  }
}

/**
 * Ejercicio 2: Leer nombre y extensión de un archivo que existe
 */
async function infoArchivoAsync(ruta: string): Promise<{
  existe: boolean;
  nombre: string;
  extension: string;
  carpeta: string;
  esDirectorio: boolean;
  tamano?: number | undefined;
}> {
  const info = path.parse(ruta);

  const resultado: {
    existe: boolean;
    nombre: string;
    extension: string;
    carpeta: string;
    esDirectorio: boolean;
    tamano?: number | undefined;
  } = {
    existe: false,
    nombre: info.name,
    extension: info.ext,
    carpeta: info.dir,
    esDirectorio: false,
    tamano: undefined,
  };

  try {
    const stats = await fs.stat(ruta);
    resultado.existe = true;
    resultado.esDirectorio = stats.isDirectory();
    resultado.tamano = stats.size;
  } catch {
    resultado.existe = false;
  }

  return resultado;
}

/**
 * Ejercicio 3: Crear carpeta de forma asincrónica (si no existe)
 */
async function crearCarpetaSiNoExiste(ruta: string): Promise<boolean> {
  try {
    await fs.mkdir(ruta, { recursive: true });
    return true;
  } catch (error: any) {
    console.error(`Error creando carpeta: ${error.message}`);
    return false;
  }
}

/**
 * Ejercicio 4: Copiar archivo de forma asincrónica
 */
async function copiarArchivoAsync(origen: string, destino: string): Promise<boolean> {
  try {
    // Verificar que existe el origen
    if (!(await existeArchivo(origen))) {
      throw new Error(`El archivo de origen no existe: ${origen}`);
    }

    // Crear carpeta destino si no existe
    const carpetaDestino = path.dirname(destino);
    await crearCarpetaSiNoExiste(carpetaDestino);

    // Copiar
    await fs.copyFile(origen, destino);
    return true;
  } catch (error: any) {
    console.error(`Error copiando archivo: ${error.message}`);
    return false;
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 2. CLASE ASINCRONA PARA GESTIÓN DE ARCHIVOS
// ═════════════════════════════════════════════════════════════════════════════

class GestorArchivos {
  private baseDir: string;

  constructor(baseDir: string) {
    this.baseDir = baseDir;
  }

  /**
   * Obtiene ruta absoluta desde una ruta relativa
   */
  getRutaAbsoluta(rutaRelativa: string): string {
    return path.resolve(this.baseDir, rutaRelativa);
  }

  /**
   * Obtiene ruta relativa desde una ruta absoluta
   */
  getRutaRelativa(rutaAbsoluta: string): string {
    return path.relative(this.baseDir, rutaAbsoluta);
  }

  /**
   * Verifica si un archivo existe de forma asincrónica
   */
  async existe(rutaRelativa: string): Promise<boolean> {
    const rutaAbsoluta = this.getRutaAbsoluta(rutaRelativa);
    try {
      await fs.access(rutaAbsoluta);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Lee un archivo de forma asincrónica
   */
  async leerArchivo(rutaRelativa: string): Promise<string> {
    const rutaAbsoluta = this.getRutaAbsoluta(rutaRelativa);
    const contenido = await fs.readFile(rutaAbsoluta, "utf-8");
    return contenido;
  }

  /**
   * Escribe un archivo de forma asincrónica
   */
  async escribirArchivo(rutaRelativa: string, contenido: string): Promise<void> {
    const rutaAbsoluta = this.getRutaAbsoluta(rutaRelativa);

    // Crear carpeta si no existe
    const carpeta = path.dirname(rutaAbsoluta);
    await fs.mkdir(carpeta, { recursive: true });

    // Escribir
    await fs.writeFile(rutaAbsoluta, contenido, "utf-8");
  }

  /**
   * Lista archivos en una carpeta de forma asincrónica
   */
  async listarArchivos(rutaRelativa: string = "."): Promise<string[]> {
    const rutaAbsoluta = this.getRutaAbsoluta(rutaRelativa);
    const archivos = await fs.readdir(rutaAbsoluta);
    return archivos;
  }

  /**
   * Obtiene información completa de un archivo
   */
  async info(rutaRelativa: string): Promise<{
    nombre: string;
    extension: string;
    carpeta: string;
    existe: boolean;
    esDirectorio: boolean;
    tamanoBytes?: number | undefined;
    modificado?: Date | undefined;
  }> {
    const rutaAbsoluta = this.getRutaAbsoluta(rutaRelativa);
    const infoPath = path.parse(rutaRelativa);

    const resultado: {
      nombre: string;
      extension: string;
      carpeta: string;
      existe: boolean;
      esDirectorio: boolean;
      tamanoBytes?: number | undefined;
      modificado?: Date | undefined;
    } = {
      nombre: infoPath.name,
      extension: infoPath.ext,
      carpeta: infoPath.dir,
      existe: false,
      esDirectorio: false,
      tamanoBytes: undefined,
      modificado: undefined,
    };

    try {
      const stats = await fs.stat(rutaAbsoluta);
      resultado.existe = true;
      resultado.esDirectorio = stats.isDirectory();
      resultado.tamanoBytes = stats.size;
      resultado.modificado = stats.mtime;
    } catch {
      resultado.existe = false;
    }

    return resultado;
  }

  /**
   * Busca archivos con una extensión específica (recursivo)
   */
  async buscarArchivos(
    rutaRelativa: string = ".",
    extension: string = ""
  ): Promise<string[]> {
    const rutaAbsoluta = this.getRutaAbsoluta(rutaRelativa);
    const archivosEncontrados: string[] = [];

    async function buscar(dir: string): Promise<void> {
      try {
        const items = await fs.readdir(dir, { withFileTypes: true });

        for (const item of items) {
          const rutaCompleta = path.join(dir, item.name);

          if (item.isDirectory()) {
            await buscar(rutaCompleta);
          } else if (!extension || item.name.endsWith(extension)) {
            archivosEncontrados.push(rutaCompleta);
          }
        }
      } catch (error) {
        // Ignorar errores de permisos
      }
    }

    await buscar(rutaAbsoluta);
    return archivosEncontrados;
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 3. UTILIDADES ASYNC PARA TRABAJAR CON RUTAS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Ejercicio 5: Obtener nombre único para archivo (evitar sobreescribir)
 */
async function obtenerNombreUnico(rutaBase: string): Promise<string> {
  let contador = 1;
  let ruta = rutaBase;
  const info = path.parse(rutaBase);

  while (await existeArchivo(ruta)) {
    const nombreNuevo = `${info.name}-${contador}${info.ext}`;
    ruta = path.join(info.dir, nombreNuevo);
    contador++;
  }

  return ruta;
}

/**
 * Ejercicio 6: Mover archivo de forma asincrónica
 */
async function moverArchivoAsync(origen: string, destino: string): Promise<boolean> {
  try {
    // Verificar origen
    if (!(await existeArchivo(origen))) {
      throw new Error(`Archivo no encontrado: ${origen}`);
    }

    // Crear carpeta destino
    await crearCarpetaSiNoExiste(path.dirname(destino));

    // Intentar rename (rápido en mismo disco)
    try {
      await fs.rename(origen, destino);
    } catch {
      // Si falla (diferente disco), copiar y eliminar
      await fs.copyFile(origen, destino);
      await fs.unlink(origen);
    }

    return true;
  } catch (error: any) {
    console.error(`Error moviendo archivo: ${error.message}`);
    return false;
  }
}

/**
 * Ejercicio 7: Eliminar carpeta con todo su contenido
 */
async function eliminarCarpeta(ruta: string, verificar: boolean = true): Promise<boolean> {
  try {
    if (verificar) {
      const stats = await fs.stat(ruta);
      if (!stats.isDirectory()) {
        throw new Error("La ruta no es una carpeta");
      }
    }

    await fs.rm(ruta, { recursive: true, force: true });
    return true;
  } catch (error: any) {
    console.error(`Error eliminando carpeta: ${error.message}`);
    return false;
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 4. EJERCICIO PRÁCTICO: EXPLORADOR DE DIRECTORIOS ASYNC
// ═════════════════════════════════════════════════════════════════════════════

interface EntradaDirectorio {
  nombre: string;
  esDirectorio: boolean;
  tamano?: number;
  extension?: string;
}

async function explorarDirectorio(ruta: string, profundidad: number = 0): Promise<void> {
  const indentacion = "  ".repeat(profundidad);
  const icono = profundidad === 0 ? "📁" : "📂";

  console.log(`${indentacion}${icono} ${path.basename(ruta)}/`);

  try {
    const items = await fs.readdir(ruta, { withFileTypes: true });

    // Ordenar: carpetas primero, luego archivos
    items.sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

    for (const item of items) {
      const rutaCompleta = path.join(ruta, item.name);
      const indentacionHijo = "  ".repeat(profundidad + 1);

      if (item.isDirectory()) {
        await explorarDirectorio(rutaCompleta, profundidad + 1);
      } else {
        try {
          const stats = await fs.stat(rutaCompleta);
          const tamanoKB = (stats.size / 1024).toFixed(2);
          const ext = path.extname(item.name) || "sin ext";
          console.log(`${indentacionHijo}📄 ${item.name} (${tamanoKB} KB, ${ext})`);
        } catch {
          console.log(`${indentacionHijo}📄 ${item.name}`);
        }
      }
    }
  } catch (error: any) {
    console.log(`${indentacion}   ❌ Error: ${error.message}`);
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// EJEMPLOS DE USO
// ═════════════════════════════════════════════════════════════════════════════

async function ejemplosPrincipales() {
  console.log("═".repeat(60));
  console.log("EJEMPLOS: path con operaciones ASINCRÓNICAS");
  console.log("═".repeat(60));

  // Ejemplo 1: Usar GestorArchivos
  console.log("\n📁 Ejemplo 1: GestorArchivos");
  const gestor = new GestorArchivos("./mi-proyecto");

  await gestor.escribirArchivo("docs/leeme.md", "# Mi Proyecto\n\nDescripción aquí");
  console.log("   ✓ Archivo leeme.md creado");

  await gestor.escribirArchivo("src/index.ts", "console.log('Hola');");
  console.log("   ✓ Archivo index.ts creado");

  const existe = await gestor.existe("docs/leeme.md");
  console.log(`   ¿Existe leeme.md? ${existe ? "Sí" : "No"}`);

  const archivos = await gestor.listarArchivos(".");
  console.log(`   Archivos en raíz: ${archivos.join(", ")}`);

  // Ejemplo 2: Buscar archivos
  console.log("\n🔍 Ejemplo 2: Buscar archivos .ts");
  const archivosTs = await gestor.buscarArchivos(".", ".ts");
  console.log(`   Encontrados: ${archivosTs.length}`);
  archivosTs.forEach((f) => console.log(`   • ${path.basename(f)}`));

  // Ejemplo 3: Info de archivo
  console.log("\n📊 Ejemplo 3: Info de archivo");
  const info = await gestor.info("src/index.ts");
  console.log(`   Nombre: ${info.nombre}`);
  console.log(`   Extensión: ${info.extension}`);
  console.log(`   Tamaño: ${info.tamanoBytes} bytes`);
  console.log(`   Modificado: ${info.modificado?.toLocaleString()}`);

  // Ejemplo 4: Nombre único
  console.log("\n✨ Ejemplo 4: Generar nombre único");
  const ruta1 = await obtenerNombreUnico("./reporte.txt");
  console.log(`   Primera vez: ${path.basename(ruta1)}`);
  // Simular que ya existe
  await gestor.escribirArchivo("reporte.txt", "contenido");
  const ruta2 = await obtenerNombreUnico("./reporte.txt");
  console.log(`   Segunda vez: ${path.basename(ruta2)}`);

  // Ejemplo 5: Explorar directorio
  console.log("\n🌳 Ejemplo 5: Explorar estructura");
  console.log("─".repeat(40));
  await explorarDirectorio("./mi-proyecto");
  console.log("─".repeat(40));

  // Limpiar
  await eliminarCarpeta("./mi-proyecto", false);
  console.log("\n✓ Carpeta temporal eliminada");
}

ejemplosPrincipales();

// ═════════════════════════════════════════════════════════════════════════════
// EJERCICIO: SISTEMA DE BACKUP ASINCRÓNICO
// ═════════════════════════════════════════════════════════════════════════════

async function sistemaBackup() {
  console.log("\n" + "═".repeat(60));
  console.log("EJERCICIO: Sistema de Backup Asincrónico");
  console.log("═".repeat(60));

  const baseDir = "./backup-demo";
  const gestor = new GestorArchivos(baseDir);

  try {
    // 1. Crear estructura
    console.log("\n1️⃣  Creando estructura...");
    await gestor.escribirArchivo("datos/importantes/archivo1.txt", "Datos importantes 1");
    await gestor.escribirArchivo("datos/importantes/archivo2.txt", "Datos importantes 2");
    await gestor.escribirArchivo("config/app.json", '{"nombre": "Mi App"}');
    console.log("   ✓ Estructura creada");

    // 2. Listar archivos
    console.log("\n2️⃣  Archivos encontrados:");
    const archivos = await gestor.buscarArchivos(".", "");
    archivos.forEach((f) => console.log(`   • ${path.relative(process.cwd(), f)}`));

    // 3. Crear backup
    console.log("\n3️⃣  Creando backup...");
    const fechaBackup = new Date().toISOString().split("T")[0] ?? "backup";
    const carpetaBackup = path.join(baseDir, "backups", fechaBackup);

    await crearCarpetaSiNoExiste(carpetaBackup);

    for (const archivo of archivos) {
      const relativo = path.relative(baseDir, archivo);
      if (relativo.startsWith("backups")) continue; // No copiar backups a sí mismos

      const destino = path.join(carpetaBackup, relativo);
      await copiarArchivoAsync(archivo, destino);
    }

    console.log(`   ✓ Backup creado en: ${carpetaBackup}`);

    // 4. Verificar backup
    console.log("\n4️⃣  Verificando backup...");
    const archivosBackup = await gestor.buscarArchivos("backups", "");
    console.log(`   Archivos respaldados: ${archivosBackup.length}`);

    // 5. Resumen
    console.log("\n✅ Backup completado exitosamente!");

  } catch (error: any) {
    console.error(`❌ Error en backup: ${error.message}`);
  } finally {
    // Limpiar
    await eliminarCarpeta(baseDir, false);
    console.log("\n✓ Demostración finalizada");
  }
}

sistemaBackup();

// ═════════════════════════════════════════════════════════════════════════════
// RESUMEN: path SÍNCRONO vs COMBINADO CON ASINCRÓNICO
// ═════════════════════════════════════════════════════════════════════════════
/*
 * ┌─────────────────────────┬────────────────────────────────────────────┐
 * │ path SÍNCRONO           │ path + fs ASINCRÓNICO                     │
 * │ (operaciones de string) │ (operaciones de disco)                    │
 * ├─────────────────────────┼────────────────────────────────────────────┤
 * │ path.join()             │ await fs.readFile(path.join(...))         │
 * │ path.resolve()          │ await fs.writeFile(path.resolve(...))     │
 * │ path.basename()         │ await fs.access(path.basename(...))       │
 * │ path.extname()          │ await fs.stat(path.extname(...))          │
 * │ path.parse()            │ await fs.readdir(path.parse(...).dir)     │
 * └─────────────────────────┴────────────────────────────────────────────┘
 *
 * REGLA: 
 * - path por sí solo → SIEMPRE síncrono (son cálculos de strings)
 * - path + fs → usa async cuando necesites leer/escribir disco
 */
