import { RefreshTokenCookieData } from './auth.types';

export interface ResponseTokensDto {
  accessToken: string;
  refreshTokenCookie: RefreshTokenCookieData;
}
