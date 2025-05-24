import { UserDto } from '../../user/types/user.dto';

export interface SessionDto {
  id: string;
  idUser: string;
  refreshToken: string;
  fechaExpiracion: Date;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  deviceInfo: string;
}

export interface RotateRefreshTokenDto {
  refreshToken: string;
  refreshTokenHash: string;
  fechaExpiracion: Date;
  idSesion: string;
  userDto: UserDto;
}
