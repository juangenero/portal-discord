import { NextFunction, Request, Response, Router } from 'express';
import { callbackCtrl, loginCtrl, refreshTokenCtrl } from './auth.controller';

const authRouter: Router = Router();

authRouter.get('/login', (req: Request, res: Response, next: NextFunction) => {
  loginCtrl(req, res);
});

authRouter.post('/callback', (req: Request, res: Response, next: NextFunction) => {
  callbackCtrl(req, res);
});

authRouter.get(
  '/refresh-token/:idUser/:refreshToken',
  (req: Request, res: Response, next: NextFunction) => {
    refreshTokenCtrl(req, res);
  }
);

export default authRouter;
