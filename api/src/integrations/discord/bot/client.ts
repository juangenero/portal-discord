import { Client, GatewayIntentBits } from 'discord.js';
import CONFIG from '../../../config/env.config';
import log from '../../../shared/utils/log/logger';

const { TOKEN_BOT } = CONFIG;

// Cliente de discord
export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
});

// Loguea el bot en Discord (inicia/retoma conexión websocket)
export async function loginBot() {
  try {
    if (!client.isReady()) {
      await client.login(TOKEN_BOT);
      log.info('Bot logueado en Discord');
    } else {
      log.error('El bot ya estaba logueado en Discord');
    }
  } catch (error) {
    log.error(`Error al iniciar sesión con el token del bot: ${error}`);
    throw error;
  }
}
