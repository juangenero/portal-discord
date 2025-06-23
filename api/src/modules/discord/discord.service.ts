import { loginBot } from '../../integrations/discord/bot/client';
import { conectarCanalDiscord } from '../../integrations/discord/bot/connection';
import { usePlayerDiscord } from '../../integrations/discord/bot/player';
import { getUserChanelId } from '../../integrations/discord/bot/utils';
import log from '../../shared/utils/log/logger';

export async function initBotDiscord() {
  await loginBot();
}

// ORQUESTADOR
export async function playSoundDiscord(sonido: any, usuarioId: string) {
  try {
    // 1. OBTENER CANAL
    const channelId = await getUserChanelId(usuarioId);

    // 2. CONECTAR AL CANAL
    const conexion = await conectarCanalDiscord(channelId);

    // 3. REPRODUCIR SONIDO
    const result: any = await usePlayerDiscord(conexion, sonido);

    return result;
  } catch (error) {
    log.error(`playSoundDiscord -> ${error}`);
    return false;
  }
}
