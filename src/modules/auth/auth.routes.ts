import { Router } from 'express';
import { callbackCtrl, loginCtrl, logoutCtrl, refreshTokenCtrl } from './auth.controller';

const authRouter: Router = Router();

authRouter.get('/login', loginCtrl);
authRouter.post('/callback', callbackCtrl);
authRouter.put('/refresh-token', refreshTokenCtrl);
authRouter.delete('/logout', logoutCtrl);

export default authRouter;
