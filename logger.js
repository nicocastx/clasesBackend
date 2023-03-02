import winston, { format } from "winston";

const LEVEL = Symbol.for('level')

function filterOnly(level){
  return format(function(info){
    if (info[LEVEL] === level){
      return info
    }
  })()
}


function buildDefaultLogger() {
  return winston.createLogger({
    transports: [
      new winston.transports.Console({ level: "info" }),
      new winston.transports.File({ filename: "./logs/warn.log",format:filterOnly('warn'), level: "warn" }),
      new winston.transports.File({ filename: "./logs/error.log",format:filterOnly('error'), level: "error" }),
    ],
  });
}

const logger = buildDefaultLogger()

export default logger