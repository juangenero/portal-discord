import { Client, Events, GatewayIntentBits, Guild, TextChannel } from 'discord.js';
import CONFIG from '../../../config/env.config';
import { AppError } from '../../../shared/errors/error-factory';
import log from '../../../shared/utils/log/logger';

const { DISCORD_GUILD_ID, DISCORD_CHANNEL_LOG_ID, TOKEN_BOT } = CONFIG;

// Cliente de discord
export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
});

export let guild: Guild | null = null; // Servidor Discord
export let channelLog: TextChannel | null = null; // Canal de log

// get server
async function getGuildWs(): Promise<void> {
  try {
    const res = await client.guilds.fetch(DISCORD_GUILD_ID);
    if (!res) throw new AppError(`El bot no está en el servidor ${DISCORD_GUILD_ID}`);

    guild = res;
    log.debug(`Servidor Discord: ${guild}`);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Error al obtener el servidor ${DISCORD_GUILD_ID}`);
  }
}

// get canal de texto
async function getLogChannelWs(): Promise<void> {
  try {
    const res = await guild!.channels.fetch(DISCORD_CHANNEL_LOG_ID);

    if (!res)
      throw new AppError(
        `El canal ${DISCORD_CHANNEL_LOG_ID} no existe en el servidor ${guild!.id}`
      );

    if (!res.isTextBased()) throw new AppError(`El canal ${DISCORD_CHANNEL_LOG_ID} no es de texto`);

    channelLog = res as TextChannel;
    log.debug(`Canal de log: ${channelLog.name}`);
  } catch (error) {
    throw error;
  }
}

// Función principal para iniciar y preparar el bot
export async function initBotDiscordWs() {
  client.once(Events.ClientReady, async (readyClient) => {
    log.info(`Bot iniciado: ${readyClient.user?.tag}`);
    await getGuildWs();
    await getLogChannelWs();
  });

  client.login(TOKEN_BOT);
}
