import { Router } from 'express';
import fileHandler from '../../shared/middlewares/file.middleware';
import { crearSonidoCtrl, obtenerSonidosCtrl, reproducirSonidoCtrl } from './sonido.controller';

const sonidoRouter = Router();

sonidoRouter.post('/create', fileHandler, crearSonidoCtrl);

sonidoRouter.get('/', obtenerSonidosCtrl);

sonidoRouter.get('/play/:id', reproducirSonidoCtrl);

export default sonidoRouter;
