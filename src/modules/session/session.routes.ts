import { Router } from 'express';
import { getSessionsCtrl, killSessionCtrl } from './session.controller';
import { validateDeleteSessionParams } from './validations/delete-sesion.validation';

const sessionRouter: Router = Router();

sessionRouter.get('/', getSessionsCtrl);
sessionRouter.delete('/:idSesion', validateDeleteSessionParams, killSessionCtrl);

export default sessionRouter;
