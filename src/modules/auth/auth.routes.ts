import { Router } from 'express';
import { callbackCtrl, loginCtrl, logoutCtrl, refreshTokenCtrl } from './auth.controller';
import { validateCallbackBody } from './validations/callback.validation';

const authRouterPublic: Router = Router();
const authRouterPrivate: Router = Router();

/**
 * @swagger
 * /auth/login:
 *     get:
 *       summary: Obtener URL de autorización de discord
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
authRouterPublic.get('/login', loginCtrl);

/**
 * @swagger
 * /auth/callback:
 *   post:
 *     summary: Intercambiar código de autorización por tokens de acceso a aplicación
 *     operationId: callback
 *     description: >
 *       Este endpoint se utiliza para intercambiar un código de autorización de Discord por un token de acceso y un token de refresco,
 *       como parte del flujo de autenticación OAuth2 con PKCE.
 *
 *
 *       Para ver la cookie (httpOnly) recibida con el refresh token, debe ir a las **herramientas de desarrollador (F12) > Aplicación > Cookies**
 *     tags:
 *       - Auth
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
authRouterPublic.post('/callback', validateCallbackBody, callbackCtrl);

/**
 * @swagger
 * /auth/refresh-token:
 *     put:
 *       summary: Refresca el token de acceso utilizando un token de refresco.
 *       description: Este endpoint permite a un cliente obtener un nuevo token de acceso válido utilizando un token de refresco existente. El token de refresco se espera en una cookie HTTP.
 *       operationId: refreshToken
 *       tags:
 *         - Auth
 *       parameters:
 *         - in: cookie
 *           name: refreshToken
 *           schema:
 *             type: string
 *           required: true
 *           description: El refresh token enviado en una cookie HTTP.
 *       responses:
 *         200:
 *           description: Token de acceso refrescado exitosamente.
 *           headers:
 *             Set-Cookie:
 *               schema:
 *                 $ref: '#/components/schemas/AuthCookieRefreshToken'
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AccessTokenResponse'
 *         401:
 *           description: No autorizado. El token de refresco no está presente o es inválido.
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
authRouterPublic.put('/refresh-token', refreshTokenCtrl);

// Cierra la sesión autenticada
authRouterPrivate.delete('/logout', logoutCtrl);

export { authRouterPrivate, authRouterPublic };
