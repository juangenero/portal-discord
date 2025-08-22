import { JwtPayloadData } from '../../shared/utils/token/types/token.types';
import { crearSonido, descargarSonido, obtenerSonidos, reproducirSonido } from './sonido.service';

import { NextFunction, Request, Response } from 'express';

export async function crearSonidoCtrl(req: Request, res: Response, next: NextFunction) {
  try {
    const { nombre, audioName, audioBase64, emoji } = req.body;
    const result = await crearSonido(nombre, audioName, audioBase64, emoji);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function obtenerSonidosCtrl(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await obtenerSonidos();
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function reproducirSonidoCtrl(req: Request, res: Response, next: NextFunction) {
  try {
    const payload: JwtPayloadData = req.payload;
    const idSonido = parseInt(req.params.id);
    const result = await reproducirSonido(idSonido, payload.idUsuario, false);

    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function descargarSonidoCtrl(req: Request, res: Response, next: NextFunction) {
  try {
    const idSonido = parseInt(req.params.id);
    const { file, format } = await descargarSonido(idSonido);

    let contentType = '';
    switch (format) {
      case 'mp3':
        contentType = 'mpeg';
        break;
      default:
        contentType = format || 'mp3';
        break;
    }

    res.setHeader('Content-Type', `audio/${contentType}`);

    res.end(file);
  } catch (error) {
    next(error);
  }
}
