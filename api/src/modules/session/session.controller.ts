import { Request, Response } from 'express';
import { deleteSessionById, getSessionsActiveByIdUser } from './session.service';

export async function getSessionsCtrl(req: Request, res: Response): Promise<void> {
  const { idUsuario } = req.payload;

  const result = await getSessionsActiveByIdUser(idUsuario);

  // Respuesta
  res.status(200).json(result);
}

// Logout
export async function killSessionCtrl(req: Request, res: Response): Promise<void> {
  // Obtener usuario y sesión
  const { idUsuario } = req.payload;
  const { idSesion } = req.params;

  // Procesar solicitud
  await deleteSessionById(idUsuario, idSesion);

  // Respuesta
  res.status(204).send();
}
