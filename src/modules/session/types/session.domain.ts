import { UserNominalData } from '../../user/types/user.types';

export interface SessionWithUserData {
  id: string;
  refreshTokenHash: string;
  fechaCreacion: Date;
  fechaExpiracion: Date;
  deviceInfo: string;
  user: UserNominalData;
}
