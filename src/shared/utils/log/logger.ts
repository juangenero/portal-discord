import { join } from 'path';
import { createLogger, format, transports } from 'winston';
import CONFIG from '../../../config/env.config';

const { LEVEL_LOG } = CONFIG;
const logDir = 'logs';

const buildLogger = () => {
  const baseFormat = format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  );

  // Transporte para error.log (solo errores)
  const errorFileTransport = new transports.File({
    filename: join(logDir, 'error.log'),
    level: 'error',
    format: baseFormat,
  });

  // Transporte para app.log (todos los niveles)
  const appFileTransport = new transports.File({
    filename: join(logDir, 'app.log'),
    format: baseFormat,
  });

  const logger = createLogger({
    level: LEVEL_LOG,
    format: baseFormat,
    transports: [new transports.Console(), errorFileTransport, appFileTransport],
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
