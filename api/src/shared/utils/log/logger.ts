import { join } from 'path';
import { createLogger, format, transports } from 'winston';
import CONFIG from '../../../config/env.config';

const { MODE_DEBUG, ENABLE_FILE_LOGGING } = CONFIG;
const logDir = 'logs';

const buildLogger = () => {
  const baseFormat = format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  );

  // Configuración del transport
  const loggerTransports: [transports.FileTransportInstance | transports.ConsoleTransportInstance] =
    [new transports.Console()];

  if (ENABLE_FILE_LOGGING) {
    // Transporte para app.log (todos los niveles)
    const appFileTransport = new transports.File({
      filename: join(logDir, 'app.log'),
      format: baseFormat,
    });

    // Transporte para error.log (solo errores)
    const errorFileTransport = new transports.File({
      filename: join(logDir, 'error.log'),
      level: 'error',
      format: baseFormat,
    });

    // Agregar a la configuración los 2 transports creados
    loggerTransports.push(appFileTransport, errorFileTransport);
  }

  const logger = createLogger({
    level: MODE_DEBUG ? 'debug' : 'info',
    format: baseFormat,
    transports: loggerTransports,
  });

  return {
    info: (message: string) => logger.info(message),
    warn: (message: string) => logger.warn(message),
    error: (message: string) => logger.error(message),
    debug: (message: string) => logger.debug(message),
  };
};

const log = buildLogger();
export default log;
