import fs from 'fs';
import { logger } from '../loggers/logger';
// Enunciado: Desarrolla un script orientado a mantenimiento que elimine un archivo pesado o residual 
// llamado temp.log utilizando fs.unlink. Para mitigar excepciones fatales del sistema, realiza una 
// comprobación previa de su existencia física utilizando fs.access.

// fs.unlink()

// const hoy = new Date().toISOString().split("T").at(0)

// const ayer = new Date("2026-10-31")
// ayer.setDate(ayer.getDate()-2);
// const ayerFormat = ayer.toISOString().split("T").at(0)
// console.log(hoy, ayer.toISOString().split("T").at(0))

// fs.unlink(`${ayerFormat}.log`, (err)=>{
//    if(err) throw err;
//    logger.log("Memoria liberada"); 
// })


fs.access("temp.log", fs.constants.F_OK, (err)=>{
    if(err) throw err;
    logger.log("Archivo comprobado")
})


fs.unlink("temp.log", (err)=>{
   if(err) throw err;
   logger.log("Memoria liberada"); 
})
