import { Request, Response } from 'express';
import { initialize, login, renewTokenJwt } from './auth.service';

export function loginCtrl(req: Request, res: Response) {
  res.status(200).json({
    url: initialize(),
  });
}

export async function callbackCtrl(req: Request, res: Response) {
  const { code, code_verifier } = req.body;
  res.status(200).send(await login(code, code_verifier));
}

export async function refreshTokenCtrl(req: Request, res: Response) {
  // TODO - Cambiar parametros solicitud por los del JWT recibido
  const { idUser, refreshToken } = req.params;
  res.status(200).send(await renewTokenJwt(idUser, refreshToken));
}
