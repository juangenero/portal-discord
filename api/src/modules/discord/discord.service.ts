import { channelLog, initBotDiscordWs } from '../../integrations/discord/bot';
import { conectarCanalWs } from '../../integrations/discord/bot/connection';
import { usePlayerDiscord } from '../../integrations/discord/bot/player';
import { getUserChanel } from '../../integrations/discord/bot/utils';
import { JwtPayloadData } from '../../shared/utils/token/types/token.types';

export function initBotDiscord() {
  initBotDiscordWs();
}

// ORQUESTADOR
export async function playSoundDiscord(
  payload: JwtPayloadData,
  metadataSonido: any,
  filePath: string
) {
  try {
    // 1. OBTENER CANAL
    const userChannel = await getUserChanel(payload.idUsuario);

    // 2. CONECTAR AL CANAL
    const conexion = await conectarCanalWs(userChannel);

    // 3. REPRODUCIR SONIDO
    const result = await usePlayerDiscord(conexion, metadataSonido, filePath);

    // 4. ENVIAR LOG
    const msgLog = `<@!${payload.idUsuario}> ha reproducido '***${metadataSonido.nombre}***' en <#${userChannel.id}>`;
    channelLog!.send(msgLog);

    return result;
  } catch (error) {
    throw error;
  }
}
