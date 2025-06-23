import { loginBot } from '../../integrations/discord/bot/client';
import { conectarCanalDiscord } from '../../integrations/discord/bot/connection';
import { usePlayerDiscord } from '../../integrations/discord/bot/player';
import { getUserChanel, sendMessageDiscord } from '../../integrations/discord/bot/utils';
import log from '../../shared/utils/log/logger';
import { JwtPayloadData } from '../../shared/utils/token/types/token.types';

export async function initBotDiscord() {
  await loginBot();
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
    const conexion = await conectarCanalDiscord(userChannel.id);

    // 3. REPRODUCIR SONIDO
    const result = await usePlayerDiscord(conexion, metadataSonido, filePath);

    // 4. ENVIAR LOG
    const msgLog = `**${payload.username}** reprodujo '**${metadataSonido.nombre}** en **${userChannel.name}**'`;
    sendMessageDiscord(msgLog);

    return result;
  } catch (error) {
    log.error(`playSoundDiscord -> ${error}`);
    return false;
  }
}
