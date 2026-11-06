import fs from 'fs';
import { logger } from '../loggers/logger';
// Enunciado: Dado un objeto nativo de JavaScript const config = { port: 3000, db: 'mongo' };, 
// utiliza fs.writeFile para transformarlo en texto plano y guardarlo en un archivo llamado config.json. 
// Asegúrate de que el JSON resultante esté indentado y sea fácil de leer para un humano.


const config = { port: 3000, db: 'mongo' };
const jsonToStringify = JSON.stringify(config, null, 2)

fs.writeFile("config.json", jsonToStringify, (err)=>{
    if(err) throw err;
    logger.log("Archivo guardado correctamente");
})

