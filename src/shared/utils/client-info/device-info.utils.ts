import { IBrowser, IDevice, IOS, UAParser } from 'ua-parser-js';
import { geolocalizateIp } from '../../../integrations/ip/ip-client.api';
import { UtilsError } from '../../errors/error-factory';
import { DeviceInfoDto } from './types/device-info.dto';
import { UserAgentInfoData } from './types/device-info.types';

/**
 * Devuelve información del dispositivo y ubicación del usuario
 * @param ip String con la IP del usuario
 * @param userAgent String del User-Agent del usuario
 * @returns DeviceInfoDto con la información obtenida
 */
export async function getDeviceInfo(ip: string, userAgent: string): Promise<DeviceInfoDto> {
  let baseDeviceInfo: DeviceInfoDto = {
    ip: ip,
  };

  if (ip) {
    let ipInfo = await geolocalizateIp(ip);
    baseDeviceInfo = {
      ...baseDeviceInfo,
      ...ipInfo,
    };
  }

  if (userAgent) {
    let userAgentInfo = parseUserAgent(userAgent);
    baseDeviceInfo = {
      ...baseDeviceInfo,
      ...userAgentInfo,
    };
  }

  return baseDeviceInfo;
}

/**
 * Extrae información de la cadena User-Agent del cliente
 * @param userAgent User-Agent del cliente
 * @returns DTO UserAgentInfo con información del dispositivo
 */
export function parseUserAgent(userAgent: string): UserAgentInfoData {
  let baseUserAgentInfo: UserAgentInfoData = {};

  if (!userAgent) {
    return baseUserAgentInfo;
  }

  try {
    const parser = new UAParser(userAgent);

    // Extraer Sistema Operativo usando el tipo importado
    const os: IOS = parser.getOS();
    if (os && os.name) {
      baseUserAgentInfo.sistemaOperativo = os.name;
    }

    // Extraer Navegador usando el tipo importado
    const browser: IBrowser = parser.getBrowser();
    if (browser && browser.name) {
      baseUserAgentInfo.navegador = browser.name;
    }

    // Extraer Tipo de Dispositivo usando el tipo importado
    const device: IDevice = parser.getDevice();
    if (device && device.type) {
      baseUserAgentInfo.tipoDispositivo = device.type;
    }

    return baseUserAgentInfo;
  } catch (error) {
    throw new UtilsError(`Error al leer la cadena de User-Agent: ${userAgent}`);
  }
}
