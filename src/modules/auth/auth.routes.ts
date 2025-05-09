import { NextFunction, Request, Response, Router } from 'express';
import { callbackCtrl, loginCtrl } from './auth.controller';

const authRouter: Router = Router();

authRouter.get('/login', (req: Request, res: Response, next: NextFunction) => {
  loginCtrl(req, res);
});

authRouter.post('/callback', async (req: Request, res: Response, next: NextFunction) => {
  await callbackCtrl(req, res);
});

export default authRouter;
