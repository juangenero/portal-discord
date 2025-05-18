export interface SessionDto {
  id: string;
  idUser: string;
  refreshToken: string;
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
  refreshToken: string;
  refreshTokenHash: string;
  fechaExpiracion: Date;
  idSesion: string;
}

// JWT

export interface PayloadJwt {
  idUsuario: string;
  idSesion: string;
  username: string;
  avatarUrl: string;
}

// Información del dispositivo

export interface DeviceInfo {
  ip: string;
  pais?: string;
  region?: string;
  ciudad?: string;
  navegador?: string;
  sistemaOperativo?: string;
  tipoDispositivo?: string;
}

export interface IpInfo {
  pais?: string;
  region?: string;
  ciudad?: string;
}

export interface UserAgentInfo {
  sistemaOperativo?: string;
  navegador?: string;
  tipoDispositivo?: string;
}
