export interface CreateRefreshTokenData {
  refreshToken: string;
  refreshTokenHash: string;
  fechaExpiracion: Date;
}

export interface JwtPayloadData {
  idUsuario: string;
  username: string;
  avatar: string | null;
  idSesion: string;
}
