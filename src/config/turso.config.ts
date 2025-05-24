import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { PrismaClient } from '../../prisma/generated/client';
import CONFIG from './env.config';

const { TURSO_DATABASE_URL: tursoUrl, TURSO_AUTH_TOKEN: tursoToken } = CONFIG;

const adapter = new PrismaLibSQL({
  url: `${tursoUrl}`,
  authToken: `${tursoToken}`,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
