import { crearSonido, obtenerSonidos, reproducirSonido } from './sonido.service';

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
    const payload = req.payload;
    const idSonido = parseInt(req.params.id);
    const result = await reproducirSonido(idSonido, payload);

    res.json({ result: result });
  } catch (error) {
    next(error);
  }
}
