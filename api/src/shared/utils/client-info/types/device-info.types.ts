import { DeviceInfoDto } from './device-info.dto';

type IpInfoData = Pick<DeviceInfoDto, 'pais' | 'region' | 'ciudad'>;

type UserAgentInfoData = Pick<DeviceInfoDto, 'navegador' | 'sistemaOperativo' | 'tipoDispositivo'>;

export { IpInfoData, UserAgentInfoData };
