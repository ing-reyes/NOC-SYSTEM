import os from "os";
import fs from "fs";
import { logger } from "./logger";

// Enunciado: Diseña una función llamada registrarLog(mensaje). Cada vez que sea invocada, 
// debe añadir (sin borrar el contenido previo) una nueva línea al archivo access.log. 
// La línea añadida debe registrar la fecha y hora actual en formato legible seguido del 
// mensaje de actividad.

// 31-10-2026, 11:03:231 A.M [severidad] Error inesperado, verifica el archivo tal

export class SaveLog {
    save(message: string, severyLevel: string, context?: string) {
        const date = new Date().toLocaleString().toUpperCase();
        const formatMessage = `${date} [${severyLevel}] ${message} ${ context?`- [${context}]`:"" } ${os.EOL}`;

        const nameFile = new Date().toISOString().split("T").at(0);

        fs.appendFile(`${nameFile??"access"}.log`, formatMessage, (err) => {
            if (err) throw err;
            logger.log("Log guardado");
        })
    }
}


export const saveLog = new SaveLog();