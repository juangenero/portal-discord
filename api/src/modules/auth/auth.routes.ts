import { Router } from 'express';
import { callbackCtrl, loginCtrl, logoutCtrl, refreshTokenCtrl } from './auth.controller';
import { validateCallbackBody } from './validations/callback.validation';

const authRouter: Router = Router();

/**
 * @swagger
 * /auth/login:
 *     get:
 *       summary: Obtiene la URL de autorización de discord
 *       operationId: login
 *       description: >
 *         Recupera la URL de autorización de discord para iniciar el proceso de autenticación, el cliente debe concatenar 3 parámetros de consulta a la URL obtenida:
 *
 *         - **state**: Código aleatorio
 *
 *         - **code_challenge**: Código que deriva del *code_verifier*
 *
 *         - **code_challenge_method**: Tipo de hash ('S256' por defecto)
 *
 *         ---
 *
 *         Ejemplo para el **code_verifier** `QJ2DsX1YZ-WZ8ga8s_s7Vp8jRDtGJmWep7y7mpiQ2Vs`
 *
 *
 *         `&state=123&code_challenge=Id9NdbXuku5wE2SYzfqQP0NJkXvfE9hjSqu0kNWGLH0&code_challenge_method=S256`
 *
 *          ---
 *
 *          [PKCE Code Generator](https://developer.pingidentity.com/en/tools/pkce-code-generator.html)
 *       tags:
 *         - Auth
 *       security: []
 *       responses:
 *         200:
 *           description: URL de login obtenida correctamente.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AuthLoginOutput'
 *         401:
 *           description: Error de autorización
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
 *           description: Error interno del servidor
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error500'
 */
authRouter.get('/login', loginCtrl);

/**
 * @swagger
 * /auth/callback:
 *   post:
 *     summary: Intercambiar el código de autorización de discord por tokens de autenticación
 *     operationId: callback
 *     description: >
 *       Este endpoint se utiliza para intercambiar un código de autorización de Discord por un token de acceso y un token de refresco,
 *       como parte del flujo de autenticación OAuth2 con PKCE.
 *
 *
 *       Para ver la cookie (httpOnly) recibida con el refresh token, debe ir a las **herramientas de desarrollador (F12) > Aplicación > Cookies**
 *     tags:
 *       - Auth
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/AuthCallbackInput'
 *     responses:
 *       200:
 *         description: Tokens obtenidos correctamente.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               $ref: '#/components/schemas/AuthCookieRefreshToken'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseAccessToken'
 *       400:
 *         description: Error en los parámetros de la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
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
authRouter.post('/callback', validateCallbackBody, callbackCtrl);

/**
 * @swagger
 * /auth/refresh-token:
 *     put:
 *       summary: Renovar access token utilizando el refresh token
 *       description: Este endpoint permite a un cliente obtener un par de access token / refresh token válidos utilizando un refresh token existente. El token de refresco se espera en una cookie HTTP.
 *       operationId: refreshToken
 *       tags:
 *         - Auth
 *       security: []
 *       parameters:
 *         - in: cookie
 *           name: refreshToken
 *           schema:
 *             type: string
 *           required: false
 *           description: El refresh token enviado en una cookie HTTP. El navegador lo envía automáticamente si la cookie ha sido establecida previamente. No es necesario introducir el valor manualmente en la interfaz de Swagger UI.
 *       responses:
 *         200:
 *           description: Access token JWT renovado correctamente
 *           headers:
 *             Set-Cookie:
 *               schema:
 *                 $ref: '#/components/schemas/AuthCookieRefreshToken'
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ResponseAccessToken'
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
 *           description: Error interno del servidor
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error500'
 */
authRouter.put('/refresh-token', refreshTokenCtrl);

/**
 * @swagger
 * paths:
 *   /auth/logout:
 *     delete:
 *       summary: Cerrar la sesión actual del usuario
 *       description: Este endpoint invalida el refresh token del usuario y elimina la cookie de refresh token del navegador, cerrando la sesión activa.
 *       operationId: logout
 *       tags:
 *         - Auth
 *       security: []
 *       parameters:
 *         - in: cookie
 *           name: refreshToken
 *           schema:
 *             type: string
 *           required: false
 *           description: El refresh token del usuario, esperado en una cookie HTTP. Este token es esencial para invalidar la sesión en el servidor. El navegador lo envía automáticamente si la cookie ha sido establecida previamente tras un login.
 *       responses:
 *         204:
 *           description: Sesión cerrada correctamente
 *           headers:
 *             Set-Cookie:
 *               schema:
 *                 type: string
 *                 example: 'refreshToken=; Path=/auth; HttpOnly; Secure=true; Expires=Thu, 01 Jan 1970 00:00:00 GMT;'
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
authRouter.delete('/logout', logoutCtrl);

export default authRouter;
