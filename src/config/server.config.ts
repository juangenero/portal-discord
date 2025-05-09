/**
 * Configuración del servidor Express.
 */

import express from 'express';

export default function configServer(app: express.Application) {
  app.use(express.urlencoded({ extended: true }));
}
