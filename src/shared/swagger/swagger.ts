import CONFIG from '../../config/env.config';
import {
  RequestCallbackSchema,
  ResponseAccessTokenSchema,
  ResponseLoginSchema,
  SetCookieRefreshToken,
} from './schemas/auth.schema';
import {
  Error400Schema,
  Error401Schema,
  Error429Schema,
  Error500Schema,
} from './schemas/errors.schema';

const { PORT, NODE_ENV } = CONFIG;

export const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'API Docs',
    },
    servers: [
      {
        url:
          NODE_ENV === 'pro'
            ? `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`
            : `http://localhost:${PORT}`,
      },
    ],
    components: {
      schemas: {
        AuthLoginOutput: ResponseLoginSchema,
        ResponseAccessToken: ResponseAccessTokenSchema,
        AuthCallbackInput: RequestCallbackSchema,
        AuthCookieRefreshToken: SetCookieRefreshToken,
        Error500: Error500Schema,
        Error429: Error429Schema,
        Error401: Error401Schema,
        Error400: Error400Schema,
      },
    },
  },
  swaggerOptions: {
    withCredentials: true,
  },
  apis: ['./src/modules/**/*.routes.ts'],
};
