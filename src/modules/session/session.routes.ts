import { Router } from 'express';
import { getSessionsCtrl, killSessionCtrl } from './session.controller';
import { validateDeleteSessionParams } from './validations/delete-sesion.validation';

const sessionRouter: Router = Router();

/**
 * @swagger
 * /sesion:
 *   get:
 *     summary: Obtener sesiones activas del usuario
 *     operationId: getSession
 *     description: Obtiene las sesiones activas y su información asociada del usuario logado
 *     tags:
 *       - Session
 *     responses:
 *       200:
 *         description: Lista de sesiones del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseListSession'
 *       401:
 *         description: Error de autorización
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       429:
 *         description: Error de rate limit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error429'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
sessionRouter.get('/', getSessionsCtrl);

/**
 * @swagger
 * paths:
 *   /sesion/:idSesion:
 *     delete:
 *       summary: Cerrar la sesión actual del usuario
 *       description: Este endpoint elimina la sesión del ID pasado en la URL siempre y cuando pertenezca al usuario logado
 *       operationId: killSession
 *       tags:
 *         - Session
 *       parameters:
 *         - in: path # Indica que el parámetro está en la ruta (URL)
 *           name: idSesion # El nombre del parámetro, debe coincidir con el de la URL
 *           schema:
 *             type: string
 *           required: true
 *           description: ID de la sesión a eliminar
 *       responses:
 *         204:
 *           description: Sesión eliminada correctamente
 *         400:
 *           description: Error en los parámetros de la solicitud
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error400'
 *         401:
 *           description: No autorizado. El refresh token no existe, ha expirado o no es válido
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error401'
 *         429:
 *           description: Error de rate limit
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error429'
 *         500:
 *           description: Error interno del servidor.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error500'
 */
sessionRouter.delete('/:idSesion', validateDeleteSessionParams, killSessionCtrl);

export default sessionRouter;
