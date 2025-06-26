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
import './comandos/eventos/autocomplete.js';
import { autocompleteHandlerWs } from './comandos/eventos/autocomplete.js';

const { DISCORD_GUILD_ID, DISCORD_CHANNEL_LOG_ID, TOKEN_BOT } = CONFIG;
const defaultCooldownDuration = 5; // Cooldown por defecto de los comandos (/)

// Cliente de discord
export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection(); // Colección de comandos
client.cooldowns = new Collection(); // Colección de cooldowns

export let guild: Guild | null = null; // Servidor Discord
export let channelLog: TextChannel | null = null; // Canal de log

// Función principal para iniciar y preparar el bot
export async function initBotDiscordWs() {
  client.once(Events.ClientReady, async (readyClient) => {
    log.info(`Bot: ${readyClient.user?.tag}`);
    await getGuildWs();
    await getLogChannelWs();
    commandHandlerWs();
    autocompleteHandlerWs();
  });

  client.login(TOKEN_BOT);
}

// get server
async function getGuildWs(): Promise<void> {
  try {
    const res = await client.guilds.fetch(DISCORD_GUILD_ID);
    if (!res) throw new AppError(`El bot no está en el servidor ${DISCORD_GUILD_ID}`);

    guild = res;
    log.info(`Server: ${guild}`);
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
    log.info(`Log: ${channelLog.name}`);
  } catch (error) {
    throw error;
  }
}

// Controlador de Comandos
function commandHandlerWs() {
  // Registrar comandos
  try {
    const foldersPath = path.join(__dirname, 'comandos', 'commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
      const commandsPath = path.join(foldersPath, folder);
      const commandFile = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith('.ts') || file.endsWith('.js'));
      log.debug(`commandFile -> ${commandFile}`);

      for (const file of commandFile) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
          client.commands.set(command.data.name, command);
        } else {
          log.warn(`El comando ${filePath} necesita las propiedades "data" y "execute"`);
        }
      }
    }
  } catch (error: any) {
    log.error(`commandHandlerWs -> Error al registrar comandos: ${error}`);
  }

  // Registrar evento ChatInputCommand
  try {
    client.on(Events.InteractionCreate, async (interaction) => {
      // 1. Checkeo inicial
      if (!interaction.isChatInputCommand()) return;
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        log.error(
          `isChatInputCommand -> No se encontró ningún comando que coincida con ${interaction.commandName}`
        );
        return;
      }

      // 2. Registro de cooldown
      const { cooldowns } = interaction.client;

      if (!cooldowns.has(command.data.name)) {
        cooldowns.set(command.data.name, new Collection());
      }

      const now = Date.now();
      const timestamps = cooldowns.get(command.data.name);
      const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

      if (timestamps && timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id)! + cooldownAmount;

        if (now < expirationTime) {
          const expiredTimestamp = Math.round(expirationTime / 1_000);
          return interaction.reply({
            content: `Has usado \`${command.data.name}\` mas rápido que Dominic Toretto cuesta abajo. Puedes volver a intentarlo <t:${expiredTimestamp}:R>.`,
            flags: MessageFlags.Ephemeral,
          });
        }
      }

      timestamps!.set(interaction.user.id, now);
      setTimeout(() => timestamps!.delete(interaction.user.id), cooldownAmount);

      // 3. Ejecutar comandos
      try {
        await command.execute(interaction);
      } catch (error: any) {
        log.error(error);
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
  } catch (error: any) {
    log.error(`commandHandlerWs -> Error al registrar evento ChatInputCommand: ${error}`);
  }
}
