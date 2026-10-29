// Importamos chalk: librería que nos permite colorear el texto en la consola
import chalk from "chalk";

// Enum (enumeración): define un conjunto fijo de niveles de log.
// Sirve para clasificar la importancia/tipo de mensaje que vamos a imprimir.
export enum LogLevel {
    LOG = "LOG",         // Mensaje general (informativo simple)
    INFO = "INFO",       // Información detallada del sistema
    WARN = "WARN",       // Advertencia: algo no crítico pero que conviene revisar
    VERBOSE = "VERBOSE", // Mensaje detallado (modo verbose / depuración)
    DEBUG = "DEBUG",     // Mensaje de depuración (para rastrear valores internos)
    ERROR = "ERROR",     // Error: algo falló o no se pudo completar
}


// Clase Logger: encapsula la lógica para imprimir mensajes formateados en consola.
// Permite crear instancias con un "contexto" (por ejemplo: el nombre del módulo/servicio).
export class Logger {

    // Constructor: recibe un contexto opcional.
    // 'private context?: string' significa que el contexto se guarda como propiedad
    // de la instancia y puede no venir (por eso el '?').
    constructor(private context?: string){}

    // Obtiene la fecha y hora actual del sistema.
    // toLocaleString() la formatea según la configuración regional del equipo.
    // toUpperCase() la convierte a mayúsculas para que se vea uniforme en el log.
    private getTimestamp(){
        return new Date().toLocaleString().toUpperCase();
    }

    // Devuelve el color (función de chalk) correspondiente según el nivel del log.
    // Así cada nivel se muestra con un color distinto en consola para identificarlo rápido.
    // Si el nivel no existe en el mapa, usa blanco brillante por defecto (??).
    private getColorByLogLevel(logLevel: LogLevel){
        let color = {
            [LogLevel.LOG]: chalk.green,           // LOG → verde
            [LogLevel.INFO]: chalk.blue,           // INFO → azul
            [LogLevel.ERROR]: chalk.red,           // ERROR → rojo
            [LogLevel.VERBOSE]: chalk.gray,        // VERBOSE → gris
            [LogLevel.DEBUG]: chalk.magentaBright, // DEBUG → magenta brillante
            [LogLevel.WARN]: chalk.yellowBright,   // WARN → amarillo brillante
        }

        return color[logLevel]??chalk.whiteBright;
    }

    // Construye el mensaje final con el formato:
    // [NodeJS] PID - FECHA LOG [contexto] mensaje
    // Cada parte se colorea según el nivel del log para facilitar la lectura en consola.
    private formatMessage(message: string, logLevel: LogLevel, context?: string){
        // 1) Obtiene el color según el nivel
        const color = this.getColorByLogLevel(logLevel);
        // 2) Etiqueta de la tecnología (NodeJS)
        const technology = color("[NodeJS]")
        // 3) PID: identificador del proceso actual (process.pid). Útil cuando hay varios procesos.
        const PID = color(`${process.pid} -`)
        // 4) Fecha y hora del momento del log (siempre en blanco brillante)
        const date = chalk.whiteBright(this.getTimestamp())
        // 5) Contexto: usa el pasado por parámetro o el de la instancia.
        //    Si no hay, imprime cadena vacía. Se muestra entre corchetes [ ] en amarillo.
        const formatContext = chalk.yellowBright( (context??this.context)?`[${context}]`: "" )
        // 6) El texto del mensaje con el color del nivel
        const messageFormat = color(message)
        // 7) Etiqueta del nivel (siempre es "LOG" en este formateador)
        const logLevelStatus= color(logLevel)

        // 8) Une todas las partes en un solo string y lo retorna
        return `${technology} ${PID} ${date} ${logLevelStatus} ${formatContext} ${messageFormat}`;
    }


    // Método público para imprimir un mensaje de nivel LOG (general).
    // Usa console.log (salida estándar).
    log(message: string, context?: string) {
        console.log(this.formatMessage(message, LogLevel.LOG, context))
    }

    // Método público para imprimir un mensaje de nivel INFO (información del sistema).
    // Se usa para comunicar el estado o eventos importantes del módulo/servicio.
    // Usa console.log (salida estándar), pero con color azul para distinguirlo.
    info(message: string, context?: string) {
        console.log(this.formatMessage(message, LogLevel.INFO, context))
    }

    // Método público para imprimir un mensaje de nivel VERBOSE (detallado/depuración).
    // Se usa cuando se necesita más detalle del flujo interno (modo verbose).
    // Usa console.log, pero con color gris para distinguirlo.
    verbose(message: string, context?: string) {
        console.log(this.formatMessage(message, LogLevel.VERBOSE, context))
    }

    // Método público para imprimir un mensaje de nivel DEBUG (depuración).
    // Se usa para rastrear valores internos, variables o el flujo de ejecución
    // durante el desarrollo. En producción normalmente se desactiva.
    // Usa console.log, pero con color magenta brillante para distinguirlo.
    debug(message: string, context?: string) {
        console.log(this.formatMessage(message, LogLevel.DEBUG, context))
    }

    // Método público para imprimir un mensaje de nivel ERROR.
    // Usa console.error (salida de error, útil para filtrar errores en la consola).
    error(message: string, context?: string) {
        console.error(this.formatMessage(message, LogLevel.ERROR, context))
    }

    // Método público para imprimir un mensaje de nivel WARN (advertencia).
    // Usa console.warn (salida de advertencias).
    warn(message: string, context?: string) {
        console.warn(this.formatMessage(message, LogLevel.WARN, context))
    }
}

// Exportamos una instancia única (singleton) del logger sin contexto.
// Se importa en otros archivos con: import { logger } from "..."
// Permite usar logger.log(...), logger.error(...) y logger.warn(...) en toda la app.
export const logger = new Logger();