import { CookieOptions } from 'express';

export interface RefreshTokenCookieData {
  name: string;
  value: string;
  options: CookieOptions;
}
