import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { Prisma, PrismaClient } from '../../prisma/generated/client';
import log from '../shared/utils/log/logger';
import CONFIG from './env.config';

const { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, DEBUG_PRISMA } = CONFIG;

const tursoAdapter = new PrismaLibSQL({
  url: `${TURSO_DATABASE_URL}`,
  authToken: `${TURSO_AUTH_TOKEN}`,
});

// Se añaden logs que serán siempre visibles
const logConfig: Prisma.LogDefinition[] = [
  { emit: 'event', level: 'warn' },
  { emit: 'event', level: 'error' },
];

// En modo DEBUG saldrán los logs de querys e info
if (DEBUG_PRISMA) {
  logConfig.unshift({ emit: 'event', level: 'info' }, { emit: 'event', level: 'query' });
}

// Se configura prisma con el adaptador de turso y para emitir los eventos de los logs
const prisma = new PrismaClient({
  adapter: tursoAdapter,
  log: logConfig,
}) as PrismaClient<
  {
    log: [
      { level: 'query'; emit: 'event' },
      { level: 'error'; emit: 'event' },
      { level: 'info'; emit: 'event' },
      { level: 'warn'; emit: 'event' }
    ];
  },
  'query' | 'info' | 'warn' | 'error'
>;

// Suscripción a los logs de prisma para pasarlos al logger
prisma.$on('query', (e) => {
  log.debug(`[PRISMA QUERY]: ${e.query} - Parámetros: ${e.params} - Duración: ${e.duration}ms`);
});

prisma.$on('info', (e) => {
  log.debug(`[PRISMA INFO]: ${e.message}`);
});

prisma.$on('warn', (e) => {
  log.warn(`[PRISMA WARN]: ${e.message}`);
});

prisma.$on('error', (e) => {
  log.error(`[PRISMA ERROR]: ${e.message}`);
});

export default prisma;
