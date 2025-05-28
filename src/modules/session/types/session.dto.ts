import { DeviceInfoDto } from '../../../shared/utils/client-info/types/device-info.dto';
import { UserDto } from '../../user/types/user.dto';

export interface SessionDto {
  id: string;
  idUser: string;
  fechaActualizacion: Date;
  deviceInfo: DeviceInfoDto;
}

export interface RotateRefreshTokenDto {
  refreshToken: string;
  refreshTokenHash: string;
  fechaExpiracion: Date;
  idSesion: string;
  userDto: UserDto;
}
