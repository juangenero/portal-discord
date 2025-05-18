/**
 * Configuración del servidor Express.
 */

import cookieParser from 'cookie-parser';
import express from 'express';

export default function configServer(app: express.Application) {
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
}
