import chalk from "chalk";

export enum LogLevel {
    LOG = "LOG",
    INFO = "INFO",
    WARN = "WARN",
    VERBOSE = "VERBOSE",
    ERROR = "ERROR",
}


export class Logger {


    getTimestamp(){
        return new Date().toLocaleString().toUpperCase();
    }

    getColorByLogLevel(logLevel: LogLevel){
        let color = {
            [LogLevel.LOG]: chalk.green,
            [LogLevel.INFO]: chalk.blue,
            [LogLevel.ERROR]: chalk.red,
            [LogLevel.VERBOSE]: chalk.cyanBright,
            [LogLevel.WARN]: chalk.yellowBright,
        }

        return color[logLevel]??chalk.whiteBright;
    }

    formatMessage(message: string, logLevel: LogLevel, context?: string){
        const color = this.getColorByLogLevel(logLevel);
        const technology = color("[NodeJS]")
        const PID = color(`${process.pid} -`)
        const date = chalk.whiteBright(this.getTimestamp())
        const formatContext = chalk.yellowBright(`[${context}]`)
        const messageFormat = color(message)
        const logLevelStatus= color("LOG")

        return `${technology} ${PID} ${date} ${logLevelStatus} ${formatContext} ${messageFormat}`;
    }


    log(message: string, context?: string) {
        console.log(this.formatMessage(message, LogLevel.LOG))
    }

    error(message: string, context?: string) {
        console.error(this.formatMessage(message, LogLevel.ERROR))
    }

    warn(message: string, context?: string) {
        console.warn(this.formatMessage(message, LogLevel.WARN))
    }
}

export const logger = new Logger();