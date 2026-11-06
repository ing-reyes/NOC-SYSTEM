/**
 * ============================================================================
 * MÓDULO `os` DE NODE.JS - VERSIÓN ASINCRÓNICA
 * ============================================================================
 * NOTA IMPORTANTE: El módulo `os` NO tiene métodos asincrónicos nativos.
 * Todos los métodos de os son síncronos porque acceden a información del SO
 * que ya está disponible en memoria (no hay operaciones de E/S que esperen).
 *
 * Sin embargo, en este archivo mostraremos cómo ENVOLVER los métodos de os
 * en funciones asincrónicas cuando necesitamos integrarlos con código async.
 * ============================================================================
 * Contenido:
 *   1. Métodos de os como funciones async con Promise
 *   2. Usando os dentro de async/await
 *   3. Clase asíncrona para obtener info del sistema
 *   4. Ejercicio práctico: Verificador de requisitos async
 * ============================================================================
 */

import os from "os";

// ═════════════════════════════════════════════════════════════════════════════
// 1. MÉTODOS DE `os` ENVUELTOS EN PROMESAS
// ═════════════════════════════════════════════════════════════════════════════
// ¿Por qué hacer esto? Para integrar os con código que usa async/await
// y mantener consistencia en aplicaciones que manejan todo de forma asincrónica.

/**
 * Obtener plataforma de forma asincrónica
 */
async function getPlataformaAsync(): Promise<string> {
  return new Promise((resolve) => {
    // Simulamos un pequeño delay para ejemplificar comportamiento async
    setTimeout(() => {
      resolve(os.platform());
    }, 10);
  });
}

/**
 * Obtener información del usuario de forma asincrónica
 */
async function getUsuarioAsync(): Promise<os.UserInfo<string>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(os.userInfo());
    }, 10);
  });
}

/**
 * Obtener estadísticas de memoria de forma asincrónica
 */
async function getMemoriaAsync(): Promise<{ total: number; libre: number; porcentajeLibre: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const total = os.totalmem();
      const libre = os.freemem();
      resolve({
        total,
        libre,
        porcentajeLibre: (libre / total) * 100,
      });
    }, 10);
  });
}

/**
 * Obtener información del CPU de forma asincrónica
 */
async function getCpuAsync(): Promise<{ nucleos: number; modelo: string; velocidad: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const cpus = os.cpus();
      const cpuPrimero = cpus[0];
      resolve({
        nucleos: cpus.length,
        modelo: cpuPrimero?.model ?? "Desconocido",
        velocidad: cpuPrimero?.speed ?? 0,
      });
    }, 10);
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// 2. USANDO `os` DENTRO DE async/await
// ═════════════════════════════════════════════════════════════════════════════

async function mostrarInfoSistema() {
  console.log("Obteniendo información del sistema...\n");

  // Aunque os es síncrono, podemos usarlo en funciones async
  // La ventaja viene cuando combinamos con otras operaciones async (fs, http, etc.)

  const plataforma = os.platform();
  const usuario = os.userInfo();
  const memoria = await getMemoriaAsync(); // Ejemplo con Promise
  const cpu = await getCpuAsync(); // Ejemplo con Promise

  console.log("✅ Información obtenida:");
  console.log(`   Plataforma: ${plataforma}`);
  console.log(`   Usuario: ${usuario.username}`);
  console.log(`   CPU: ${cpu.modelo} (${cpu.nucleos} núcleos)`);
  console.log(`   RAM: ${(memoria.total / 1024 ** 3).toFixed(2)} GB total`);
  console.log(`   RAM libre: ${memoria.porcentajeLibre.toFixed(1)}%`);
}

mostrarInfoSistema();

// ═════════════════════════════════════════════════════════════════════════════
// 3. CLASE ASINCRONA PARA OBTENER INFO DEL SISTEMA
// ═════════════════════════════════════════════════════════════════════════════

/**
 * SistemaInfo: Una clase que encapsula toda la información del sistema
 * y la devuelve de forma asincrónica.
 */
class SistemaInfo {
  /**
   * Obtiene toda la información del sistema de forma asincrónica
   */
  static async obtenerTodo(): Promise<{
    sistema: { tipo: string; plataforma: string; version: string; arquitectura: string };
    usuario: { nombre: string; carpeta: string; equipo: string };
    hardware: { cpu: string; nucleos: number; velocidad: number };
    memoria: { total: number; libre: number; uso: number };
  }> {
    // Simulamos delay para comportamiento async
    await new Promise((resolve) => setTimeout(resolve, 50));

    const cpus = os.cpus();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();

    return {
      sistema: {
        tipo: os.type(),
        plataforma: os.platform(),
        version: os.version(),
        arquitectura: os.arch(),
      },
      usuario: {
        nombre: os.userInfo().username,
        carpeta: os.homedir(),
        equipo: os.hostname(),
      },
      hardware: {
        cpu: cpus[0]?.model ?? "Desconocido",
        nucleos: cpus.length,
        velocidad: cpus[0]?.speed ?? 0,
      },
      memoria: {
        total: totalMem,
        libre: freeMem,
        uso: ((totalMem - freeMem) / totalMem) * 100,
      },
    };
  }

  /**
   * Verifica si el sistema cumple requisitos mínimos
   */
  static async verificarRequisitos(requisitos: {
    ramMinimaGB: number;
    nucleosMinimos: number;
    plataformasPermitidas: string[];
  }): Promise<{ cumple: boolean; detalles: string[] }> {
    await new Promise((resolve) => setTimeout(resolve, 30));

    const detalles: string[] = [];
    let cumple = true;

    // Verificar RAM
    const ramGB = os.totalmem() / 1024 ** 3;
    if (ramGB >= requisitos.ramMinimaGB) {
      detalles.push(`✓ RAM: ${ramGB.toFixed(1)} GB (mínimo: ${requisitos.ramMinimaGB} GB)`);
    } else {
      detalles.push(`✗ RAM: ${ramGB.toFixed(1)} GB (necesario: ${requisitos.ramMinimaGB} GB)`);
      cumple = false;
    }

    // Verificar CPU
    const nucleos = os.cpus().length;
    if (nucleos >= requisitos.nucleosMinimos) {
      detalles.push(`✓ CPU: ${nucleos} núcleos (mínimo: ${requisitos.nucleosMinimos})`);
    } else {
      detalles.push(`✗ CPU: ${nucleos} núcleos (necesario: ${requisitos.nucleosMinimos})`);
      cumple = false;
    }

    // Verificar plataforma
    if (requisitos.plataformasPermitidas.includes(os.platform())) {
      detalles.push(`✓ Plataforma: ${os.platform()} (compatibles: ${requisitos.plataformasPermitidas.join(", ")})`);
    } else {
      detalles.push(`✗ Plataforma: ${os.platform()} (no compatible)`);
      cumple = false;
    }

    return { cumple, detalles };
  }
}

// Ejemplo de uso
async function ejemploClase() {
  console.log("\n" + "═".repeat(60));
  console.log("EJEMPLO: Clase SistemaInfo");
  console.log("═".repeat(60));

  const info = await SistemaInfo.obtenerTodo();

  console.log("\n📊 Sistema:");
  console.log(`   ${info.sistema.tipo} - ${info.sistema.plataforma}`);
  console.log(`   Versión: ${info.sistema.version}`);

  console.log("\n👤 Usuario:");
  console.log(`   ${info.usuario.nombre} @ ${info.usuario.equipo}`);

  console.log("\n💻 Hardware:");
  console.log(`   ${info.hardware.cpu}`);
  console.log(`   ${info.hardware.nucleos} núcleos @ ${info.hardware.velocidad} MHz`);

  console.log("\n💾 Memoria:");
  console.log(`   Total: ${(info.memoria.total / 1024 ** 3).toFixed(2)} GB`);
  console.log(`   Libre: ${(info.memoria.libre / 1024 ** 3).toFixed(2)} GB`);
  console.log(`   Uso: ${info.memoria.uso.toFixed(1)}%`);
}

ejemploClase();

// ═════════════════════════════════════════════════════════════════════════════
// 4. EJERCICIO PRÁCTICO: VERIFICADOR DE REQUISITOS ASYNC
// ═════════════════════════════════════════════════════════════════════════════

async function ejercicioVerificador() {
  console.log("\n" + "═".repeat(60));
  console.log("EJERCICIO: Verificador de Requisitos para App");
  console.log("═".repeat(60));
  console.log("\nVerificando si tu sistema puede ejecutar una aplicación...\n");

  // Requisitos para ejecutar una app pesada
  const requisitos = {
    ramMinimaGB: 8,
    nucleosMinimos: 4,
    plataformasPermitidas: ["win32", "linux", "darwin"],
  };

  const resultado = await SistemaInfo.verificarRequisitos(requisitos);

  console.log("📋 Resultado de la verificación:");
  resultado.detalles.forEach((detalle) => console.log(`   ${detalle}`));

  console.log("\n" + "─".repeat(60));
  if (resultado.cumple) {
    console.log("✅ ¡Tu sistema CUMPLE todos los requisitos!");
    console.log("   Puedes ejecutar la aplicación sin problemas.");
  } else {
    console.log("❌ Tu sistema NO cumple con los requisitos mínimos.");
    console.log("   Considera actualizar tu hardware.");
  }
  console.log("─".repeat(60));
}

ejercicioVerificador();

// ═════════════════════════════════════════════════════════════════════════════
// RESUMEN: SÍNCRONO vs ASINCRÓNICO en `os`
// ═════════════════════════════════════════════════════════════════════════════
/*
 * ┌─────────────────────┬────────────────────────────────────────────────┐
 * │ SÍNCRONO (os.*)     │ ASINCRÓNICO (envuelto)                        │
 * ├─────────────────────┼────────────────────────────────────────────────┤
 * │ os.platform()       │ await getPlataformaAsync()                    │
 * │ os.userInfo()       │ await getUsuarioAsync()                       │
 * │ os.totalmem()       │ await getMemoriaAsync()                       │
 * │ os.cpus()           │ await getCpuAsync()                           │
 * │ os.hostname()       │ await SistemaInfo.obtenerTodo()               │
 * └─────────────────────┴────────────────────────────────────────────────┘
 *
 * ¿Cuándo usar la versión async?
 * - Cuando integras os con otras operaciones async (fs, http, base de datos)
 * - Cuando quieres un patrón uniforme en tu código async
 * - Cuando necesitas simular delays o agregar lógica compleja
 *
 * ¿Cuándo usar la versión sync?
 * - En la mayoría de casos, os síncrono es suficiente
 * - Cuando estás escribiendo scripts simples
 * - Cuando la información del SO es necesaria inmediatamente
 */
