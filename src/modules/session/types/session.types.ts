import { DeviceInfoDto } from '../../../shared/utils/client-info/types/device-info.dto';

export interface SessionData {
  id: string;
  idUser: string;
  refreshToken: string;
  fechaExpiracion: Date;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  deviceInfo: DeviceInfoDto;
}

export interface CreateSessionData {
  idUser: string;
  refreshTokenHash: string;
  fechaExpiracion: Date;
  deviceInfo: DeviceInfoDto;
}
