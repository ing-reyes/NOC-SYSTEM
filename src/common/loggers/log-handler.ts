import chalk from "chalk";
import fs from "fs";
import os from "os";
import path from "path";

// Enum de severidad. El valor numérico permite comparar niveles y filtrar por un umbral mínimo.
export enum LogLevel {
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
    CRITICAL = 4,
}

// Opciones de configuración. Todas son opcionales y tienen valores por defecto.
export interface LogHandlerOptions {
    minLevel?: LogLevel;
    logsDirectory?: string;
    fileNamePrefix?: string;
    logToConsole?: boolean;
}

// Manejador de logs: escribe eventos en archivos .log (uno por día)
// y, opcionalmente, los replica en consola con colores.
export class LogHandler {

    private readonly minLevel: LogLevel;
    private readonly logsDirectory: string;
    private readonly fileNamePrefix: string;
    private readonly logToConsole: boolean;

    constructor(options: LogHandlerOptions = {}) {
        this.minLevel = options.minLevel ?? LogLevel.LOW;
        this.logsDirectory = options.logsDirectory ?? path.join(process.cwd(), "logs");
        this.fileNamePrefix = options.fileNamePrefix ?? "app";
        this.logToConsole = options.logToConsole ?? false;

        this.ensureLogsDirectory();
    }

    low(message: string, context?: string): void {
        this.write(LogLevel.LOW, message, context);
    }

    medium(message: string, context?: string): void {
        this.write(LogLevel.MEDIUM, message, context);
    }

    high(message: string, context?: string): void {
        this.write(LogLevel.HIGH, message, context);
    }

    critical(message: string, context?: string): void {
        this.write(LogLevel.CRITICAL, message, context);
    }

    private write(level: LogLevel, message: string, context?: string): void {
        if (level < this.minLevel) return;

        const line = this.formatLine(level, message, context);

        try {
            fs.appendFileSync(this.getLogFilePath(), line + os.EOL, "utf8");
        } catch (error) {
            console.error(chalk.redBright(`[LogHandler] Error al escribir en el archivo de log: ${error}`));
        }

        if (this.logToConsole) {
            this.printToConsole(level, message, context);
        }
    }

    // Formato de cada línea dentro del archivo .log:
    // 2026-10-29T14:03:22.451Z [CRITICAL] [MainTS] mensaje
    private formatLine(level: LogLevel, message: string, context?: string): string {
        const timestamp = new Date().toISOString();
        const levelTag = `[${LogLevel[level]}]`;
        const contextTag = context ? `[${context}]` : "";

        return [timestamp, levelTag, contextTag, message].filter(Boolean).join(" ");
    }

    // Ruta del archivo del día actual: logs/app-2026-10-29.log
    private getLogFilePath(): string {
        const date = new Date().toISOString().slice(0, 10);
        return path.join(this.logsDirectory, `${this.fileNamePrefix}-${date}.log`);
    }

    private ensureLogsDirectory(): void {
        if (!fs.existsSync(this.logsDirectory)) {
            fs.mkdirSync(this.logsDirectory, { recursive: true });
        }
    }

    private printToConsole(level: LogLevel, message: string, context?: string): void {
        const color = this.getColor(level);
        const timestamp = chalk.whiteBright(new Date().toLocaleString());
        const levelTag = color(`[${LogLevel[level]}]`);
        const contextTag = context ? chalk.yellowBright(`[${context}]`) : "";
        const line = `${timestamp} ${levelTag} ${contextTag} ${message}`;

        if (level >= LogLevel.HIGH) {
            console.error(line);
            return;
        }

        console.log(line);
    }

    private getColor(level: LogLevel): chalk.Chalk {
        const colors: Record<LogLevel, chalk.Chalk> = {
            [LogLevel.LOW]: chalk.green,
            [LogLevel.MEDIUM]: chalk.yellowBright,
            [LogLevel.HIGH]: chalk.magentaBright,
            [LogLevel.CRITICAL]: chalk.redBright,
        };

        return colors[level];
    }
}

// Instancia por defecto, lista para importar en toda la aplicación.
export const logHandler = new LogHandler();
