import { logHandler } from "./common/loggers/log-handler";

logHandler.low("Aplicación iniciada correctamente", "MainTS");
logHandler.medium("Uso de memoria por encima del 70%", "MainTS");
logHandler.high("Latencia de red elevada en el enlace WAN", "MainTS");
logHandler.critical("Servidor de base de datos inaccesible", "MainTS");
