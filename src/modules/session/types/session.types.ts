import { DeviceInfoDto } from '../../../shared/utils/client-info/types/device-info.dto';

export interface CreateSessionData {
  idUser: string;
  refreshTokenHash: string;
  fechaExpiracion: Date;
  deviceInfo: DeviceInfoDto;
}
