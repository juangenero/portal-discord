import { CookieOptions } from 'express';

export interface ResponseTokens {
  accessToken: string;
  refreshTokenCookie: {
    name: string;
    value: string;
    options: CookieOptions;
  };
}
