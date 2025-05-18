import axios from 'axios';
import { IpInfo } from '../../modules/session/session.dto';
import { IpApiResponse } from './ip.dto';

/**
 * Geolocaliza una dirección IP
 * @param ip IP del usuario
 * @returns DTO IpInfo con la ubicación de la IP
 */
export async function geolocalizateIp(ip: string): Promise<IpInfo> {
  const emptyIpInfo: IpInfo = {};

  // Se llama a la API si tenemos una IP
  if (ip) {
    try {
      const url = `http://ip-api.com/json/${ip}`;
      const { data } = await axios.get<IpApiResponse>(url);

      if (data.status === 'success') {
        return {
          ...emptyIpInfo,
          pais: data.country,
          ciudad: data.city,
          region: data.regionName,
        };
      } else {
        console.error(`Fallo al recuperar ubicación de la IP ${ip}: ${data.message}`);
        return emptyIpInfo;
      }
    } catch (error) {
      console.error(`Fallo en IP clientApi ${ip}:`, error);
      return emptyIpInfo;
    }
  }

  return emptyIpInfo;
}
