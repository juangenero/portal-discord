export interface SessionDto {
  id: number;
  idUser: string;
  refreshTokenHash: string;
  fechaExpiracion: Date;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  deviceInfo?: string;
}

export interface CreateSessionDto {
  idUser: string;
  refreshTokenHash: string;
  fechaExpiracion: Date;
  deviceInfo?: string;
}

export interface CreateRefreshTokenDto {
  refreshToken: string;
  refreshTokenHash: string;
  fechaExpiracion: Date;
}

export interface RotateRefreshTokenDto {
  idUser: string;
  refreshTokenHashOld: string;
  refreshTokenHashNew: string;
  fechaExpiracion: Date;
  deviceInfo?: string;
}
