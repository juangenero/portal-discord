import axios from 'axios';
import { IpInfoData } from '../../shared/utils/client-info/types/device-info.types';
import log from '../../shared/utils/log/logger';
import { ResponseIpData } from './ip.types';

/**
 * Geolocaliza una dirección IP
 * @param ip IP del usuario
 * @returns DTO IpInfo con la ubicación de la IP
 */
export async function geolocalizateIp(ip: string): Promise<IpInfoData> {
  const emptyIpInfo: IpInfoData = {};

  try {
    const url = `http://ip-api.com/json/${ip}`;
    const { data } = await axios.get<ResponseIpData>(url);

    if (data.status === 'success') {
      return {
        ...emptyIpInfo,
        pais: data.country,
        ciudad: data.city,
        region: data.regionName,
      };
    } else {
      log.warn(`Fallo al recuperar ubicación de la IP ${ip}: ${data.message}`);
    }
  } catch (error: any) {
    log.warn(`Fallo en el servicio de geolocalización de IP: ${error.message}`);
  }

  return emptyIpInfo;
}
