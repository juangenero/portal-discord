/**
 * Configuración del servidor Express.
 */

import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';

export default function configServer(app: express.Application) {
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // TODO - Realmente necesario? Sólo para favicon
  app.use(express.static(path.join(__dirname, '../../public')));
}
