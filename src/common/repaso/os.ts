/**
 * ============================================================================
 * MÓDULO `os` DE NODE.JS - VERSIÓN SÍNCRONA
 * ============================================================================
 * El módulo `os` obtiene información del sistema operativo.
 * TODOS sus métodos son SÍNCRONOS (devuelven el resultado directamente).
 * No existe versión asincrónica de este módulo.
 * ============================================================================
 * Contenido:
 *   1. Información básica del sistema
 *   2. Memoria RAM
 *   3. Procesador (CPU)
 *   4. Usuario y equipo
 *   5. Red
 *   6. Tiempo y carga del sistema
 *   7. Ejercicio práctico final: Reporte completo
 * ============================================================================
 */

import os from "os";

// ═════════════════════════════════════════════════════════════════════════════
// 1. INFORMACIÓN BÁSICA DEL SISTEMA OPERATIVO
// ═════════════════════════════════════════════════════════════════════════════

/**
 * os.platform()
 * Devuelve el identificador de la plataforma:
 * - 'win32' → Windows
 * - 'linux' → Linux
 * - 'darwin' → macOS
 */
const plataforma = os.platform();
console.log(`Plataforma: ${plataforma}`);

if (plataforma === "win32") {
  console.log("🖥️  Estás usando Windows");
} else if (plataforma === "linux") {
  console.log("🐧 Estás usando Linux");
} else if (plataforma === "darwin") {
  console.log("🍎 Estás usando macOS");
}

/**
 * os.type()
 * Devuelve el NOMBRE del sistema operativo:
 * - 'Windows_NT', 'Linux', 'Darwin'
 * Diferencia con platform(): type() da nombre legible, platform() da código
 */
console.log(`\nTipo de SO: ${os.type()}`);

/**
 * os.version()
 * Devuelve la versión del kernel o sistema operativo
 */
console.log(`Versión del SO: ${os.version()}`);

/**
 * os.arch()
 * Devuelve la arquitectura del procesador:
 * - 'x64' → 64 bits
 * - 'arm' → ARM (Raspberry Pi, Apple Silicon)
 * - 'ia32' → 32 bits
 */
const arquitectura = os.arch();
console.log(`Arquitectura: ${arquitectura}`);
console.log(`¿Es 64 bits? ${arquitectura === "x64" ? "Sí ✓" : "No ✗"}`);

/**
 * os.EOL
 * Carácter de fin de línea del sistema:
 * - Windows: \r\n
 * - Linux/Mac: \n
 * Útil para escribir archivos de texto compatibles
 */
console.log(`\nFin de línea (hex): ${os.EOL.charCodeAt(0).toString(16)}${os.EOL.charCodeAt(1) || ""}`);
console.log(`Hola${os.EOL}Mundo`);

// ═════════════════════════════════════════════════════════════════════════════
// 2. MEMORIA RAM
// ═════════════════════════════════════════════════════════════════════════════

/**
 * os.totalmem()
 * Devuelve la memoria RAM TOTAL en bytes
 */
const memoriaTotalBytes = os.totalmem();
const memoriaTotalGB = memoriaTotalBytes / 1024 ** 3;
console.log(`\n─── MEMORIA RAM ───`);
console.log(`Total: ${memoriaTotalGB.toFixed(2)} GB`);

/**
 * os.freemem()
 * Devuelve la memoria RAM LIBRE en bytes
 */
const memoriaLibreBytes = os.freemem();
const memoriaLibreGB = memoriaLibreBytes / 1024 ** 3;
console.log(`Libre: ${memoriaLibreGB.toFixed(2)} GB`);

/**
 * Ejercicio: Calcular porcentaje de RAM disponible
 */
const porcentajeLibre = ((memoriaLibreGB / memoriaTotalGB) * 100).toFixed(1);
const porcentajeUsado = (100 - parseFloat(porcentajeLibre)).toFixed(1);
console.log(`Disponible: ${porcentajeLibre}%`);
console.log(`En uso: ${porcentajeUsado}%`);

// ═════════════════════════════════════════════════════════════════════════════
// 3. PROCESADOR (CPU)
// ═════════════════════════════════════════════════════════════════════════════

/**
 * os.cpus()
 * Devuelve un array con información de cada núcleo del CPU.
 * Cada elemento tiene: model, speed, times (user, nice, sys, idle, irq)
 */
const nucleos = os.cpus();
const cpu0 = nucleos[0];
console.log(`\n─── PROCESADOR ───`);
console.log(`Núcleos: ${nucleos.length}`);
console.log(`Modelo: ${cpu0?.model ?? "Desconocido"}`);
console.log(`Velocidad: ${cpu0?.speed ?? 0} MHz`);

/**
 * Ejercicio: Calcular uso total del CPU sumando tiempos de todos los núcleos
 */
const tiempoTotal = nucleos.reduce(
  (acc, cpu) => acc + cpu.times.user + cpu.times.idle + cpu.times.sys,
  0
);
console.log(`Tiempo acumulado: ${(tiempoTotal / 1000 / 3600).toFixed(2)} horas`);
// ═════════════════════════════════════════════════════════════════════════════
// 4. USUARIO Y EQUIPO
// ═════════════════════════════════════════════════════════════════════════════

/**
 * os.hostname()
 * Devuelve el nombre del equipo en la red
 */
console.log(`\n─── USUARIO Y EQUIPO ───`);
console.log(`Nombre del equipo: ${os.hostname()}`);

/**
 * os.homedir()
 * Devuelve la carpeta personal del usuario actual
 * Windows: C:\Users\PC
 * Linux/Mac: /home/usuario
 */
const carpetaUsuario = os.homedir();
console.log(`Carpeta personal: ${carpetaUsuario}`);

/**
 * os.userInfo()
 * Devuelve información completa del usuario:
 * - username: nombre de usuario
 * - homedir: carpeta personal
 * - shell: terminal por defecto
 * - uid/gid: identificadores (en Windows son -1)
 */
const usuario = os.userInfo();
console.log(`Usuario: ${usuario.username}`);
console.log(`Shell: ${usuario.shell}`);

// ═════════════════════════════════════════════════════════════════════════════
// 5. RED
// ═════════════════════════════════════════════════════════════════════════════

/**
 * os.networkInterfaces()
 * Devuelve un objeto con todas las interfaces de red.
 * Cada interfaz tiene: address, netmask, family, mac, internal
 */
const interfaces = os.networkInterfaces();
console.log(`\n─── INTERFACES DE RED ───`);

for (const [nombre, direcciones] of Object.entries(interfaces)) {
  console.log(`\n${nombre}:`);
  if (direcciones) {
    for (const dir of direcciones) {
      console.log(`  ${dir.family}: ${dir.address}`);
    }
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 6. TIEMPO Y CARGA DEL SISTEMA
// ═════════════════════════════════════════════════════════════════════════════

/**
 * os.uptime()
 * Devuelve los segundos que lleva encendida la computadora
 */
const segundosEncendido = os.uptime();
const horas = Math.floor(segundosEncendido / 3600);
const minutos = Math.floor((segundosEncendido % 3600) / 60);
const segundos = Math.floor(segundosEncendido % 60);

console.log(`\n─── TIEMPO Y CARGA ───`);
console.log(`Encendido desde hace: ${horas}h ${minutos}m ${segundos}s`);

/**
 * os.loadavg()
 * Devuelve un array de 3 valores [1 min, 5 min, 15 min].
 * Es el promedio de procesos en cola de ejecución.
 * Si loadavg[0] > número de núcleos → sistema sobrecargado
 */
const carga = os.loadavg();
console.log(`Carga promedio (1, 5, 15 min):`);
console.log(`  ${carga.map((c) => c.toFixed(2)).join("  ")}`);

const sistemaOcupado = (carga[0] ?? 0) > nucleos.length;
console.log(`¿Sistema sobrecargado? ${sistemaOcupado ? "Sí ⚠️" : "No ✓"}`);

// ═════════════════════════════════════════════════════════════════════════════
// 7. EJERCICIO PRÁCTICO: REPORTE COMPLETO DEL SISTEMA
// ═════════════════════════════════════════════════════════════════════════════

function generarReporteSistema(): string {
  const cpuInfo = os.cpus();
  const cpuPrimero = cpuInfo[0];
  const cargaActual = os.loadavg();

  const lineas = [
    "╔══════════════════════════════════════════════════════════════╗",
    "║              REPORTE COMPLETO DEL SISTEMA                   ║",
    "╚══════════════════════════════════════════════════════════════╝",
    "",
    "📌 SISTEMA OPERATIVO",
    "───────────────────────────────────────────────────────────────",
    `   Tipo: ${os.type()}`,
    `   Plataforma: ${os.platform()} (${os.arch()})`,
    `   Versión: ${os.version()}`,
    "",
    "🖥️  HARDWARE",
    "───────────────────────────────────────────────────────────────",
    `   CPU: ${cpuPrimero?.model ?? "Desconocido"}`,
    `   Núcleos: ${cpuInfo.length}`,
    `   Velocidad: ${cpuPrimero?.speed ?? 0} MHz`,
    "",
    "💾 MEMORIA",
    "───────────────────────────────────────────────────────────────",
    `   Total: ${(os.totalmem() / 1024 ** 3).toFixed(2)} GB`,
    `   Libre: ${(os.freemem() / 1024 ** 3).toFixed(2)} GB`,
    `   Uso: ${(100 - (os.freemem() / os.totalmem()) * 100).toFixed(1)}%`,
    "",
    "👤 USUARIO",
    "───────────────────────────────────────────────────────────────",
    `   Nombre: ${os.userInfo().username}`,
    `   Equipo: ${os.hostname()}`,
    `   Home: ${os.homedir()}`,
    "",
    "📊 ESTADO",
    "───────────────────────────────────────────────────────────────",
    `   Tiempo encendido: ${horas}h ${minutos}m ${segundos}s`,
    `   Carga (1 min): ${(cargaActual[0] ?? 0).toFixed(2)}`,
    `   Interfaces de red: ${Object.keys(os.networkInterfaces()).length}`,
    "",
    "═══════════════════════════════════════════════════════════════",
  ];

  return lineas.join("\n");
}

console.log("\n" + generarReporteSistema());
