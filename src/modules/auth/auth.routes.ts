import { NextFunction, Request, Response, Router } from 'express';
import { callbackCtrl, loginCtrl, refreshTokenCtrl } from './auth.controller';

const authRouter: Router = Router();

authRouter.get('/login', (req: Request, res: Response, next: NextFunction) => {
  loginCtrl(req, res);
});

authRouter.post('/callback', (req: Request, res: Response, next: NextFunction) => {
  callbackCtrl(req, res);
});

authRouter.post('/refresh-token/:idUser', (req: Request, res: Response, next: NextFunction) => {
  refreshTokenCtrl(req, res);
});

authRouter.delete('/logout', (req: Request, res: Response, next: NextFunction) => {
  // Método logout()
});

export default authRouter;
