import { Router } from 'express';
import { callbackCtrl, loginCtrl, refreshTokenCtrl } from './auth.controller';

const authPublicRouter: Router = Router();
const authPrivateRouter: Router = Router();

authPublicRouter.get('/login', loginCtrl);
authPublicRouter.post('/callback', callbackCtrl);
authPublicRouter.put('/refresh-token', refreshTokenCtrl);
// authPrivateRouter.delete('/logout', deleteCtrl);

export { authPrivateRouter, authPublicRouter };
