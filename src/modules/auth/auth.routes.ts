import { Router } from 'express';
import { callbackCtrl, loginCtrl, logoutCtrl, refreshTokenCtrl } from './auth.controller';
import { validateCallbackBody } from './validations/callback.validation';

const authRouter: Router = Router();

authRouter.get('/login', loginCtrl);
authRouter.post('/callback', validateCallbackBody, callbackCtrl);
authRouter.put('/refresh-token', refreshTokenCtrl);
authRouter.delete('/logout', logoutCtrl);

export default authRouter;
