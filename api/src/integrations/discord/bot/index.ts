import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  Guild,
  MessageFlags,
  TextChannel,
} from 'discord.js';
import fs from 'node:fs';
import path from 'path';
import CONFIG from '../../../config/env.config.js';
import { AppError } from '../../../shared/errors/error-factory.js';
import log from '../../../shared/utils/log/logger.js';

const { DISCORD_GUILD_ID, DISCORD_CHANNEL_LOG_ID, TOKEN_BOT } = CONFIG;

// Cliente de discord
export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
});

// Colección de comandos
client.commands = new Collection();

export let guild: Guild | null = null; // Servidor Discord
export let channelLog: TextChannel | null = null; // Canal de log

// Función principal para iniciar y preparar el bot
export async function initBotDiscordWs() {
  client.once(Events.ClientReady, async (readyClient) => {
    log.info(`Bot iniciado: ${readyClient.user?.tag}`);
    await getGuildWs();
    await getLogChannelWs();
    loadCommandsWs();
  });

  client.login(TOKEN_BOT);
}

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

// Comandos (/)
function loadCommandsWs() {
  const foldersPath = path.join(__dirname, 'comandos', 'commands');
  const commandFolders = fs.readdirSync(foldersPath);

  // Rellenar colección de comandos
  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.ts'));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      // Establezca un nuevo elemento en la Colección con la clave como nombre del comando y el valor como el módulo exportado
      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
      } else {
        log.warn(`El comando ${filePath} necesita las propiedades "data" y "execute"`);
      }
    }
  }

  // Habilitar detección de comandos
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      log.error(`No se encontró ningún comando que coincida con ${interaction.commandName}`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error: any) {
      log.error(`Error -> ${error}`);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'Error al ejecutar el comando',
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: 'Error al ejecutar el comando',
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  });
}
