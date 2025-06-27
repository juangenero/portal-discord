import { channelLog, initBotDiscordWs } from '../../integrations/discord/bot';
import { conectarCanalWs } from '../../integrations/discord/bot/connection';
import { stopPlayerWs, usePlayerDiscord } from '../../integrations/discord/bot/player';
import { getUserChanel } from '../../integrations/discord/bot/utils';

export function initBotDiscord() {
  initBotDiscordWs();
}

// ORQUESTADOR
export async function playSoundDiscord(
  userId: string,
  metadataSonido: any,
  filePath: string,
  fromCommand: boolean
) {
  try {
    // 1. OBTENER CANAL
    const userChannel = await getUserChanel(userId);

    // 2. CONECTAR AL CANAL
    const conexion = await conectarCanalWs(userChannel);

    // 3. REPRODUCIR SONIDO
    await usePlayerDiscord(conexion, metadataSonido, filePath);

    // 4. ENVIAR LOG
    if (!fromCommand) {
      const msgLog = `<@!${userId}> ha reproducido '***${metadataSonido.nombre}***' en <#${userChannel.id}>`;
      channelLog!.send({ content: msgLog, allowedMentions: { users: [] } });
    }

    return {
      usuario: userId,
      sonido: metadataSonido.nombre,
      canal: userChannel.id,
    };
  } catch (error) {
    throw error;
  }
}

export function pararSonido(): boolean {
  return stopPlayerWs();
}
