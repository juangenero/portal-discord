import {
  getVoiceConnection,
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import CONFIG from '../../../config/env.config.js';
import { AppError } from '../../../shared/errors/error-factory.js';
import log from '../../../shared/utils/log/logger.js';
import { getChannel, getGuild } from './utils.js';

// Variables de clase
const { SECONDS_TIMEOUT_BOT, DISCORD_GUILD_ID } = CONFIG;

let timeout: NodeJS.Timeout | null = null; // Timeout del bot

/**
 * Se conecta a un canal de voz si no estaba ya conectado
 * @param channelId ID del canal al que se va a conectar
 * @returns Conexión creada u obtenida
 */
export async function conectarCanalDiscord(channelId: string): Promise<VoiceConnection> {
  try {
    const guild = await getGuild(DISCORD_GUILD_ID); // Obteiner servidor
    const existingConnection = getVoiceConnection(guild.id);

    // Comprobar si el bot ya está conectado al canal deseado
    if (
      existingConnection &&
      existingConnection.state.status !== VoiceConnectionStatus.Disconnected &&
      existingConnection.joinConfig.channelId === channelId
    ) {
      log.debug(`El bot ya está en el canal ${channelId}, reutilizando conexión existente`);
      return existingConnection;
    }

    // Cerrar posible conexión del canal que ya no se usará
    if (existingConnection) {
      log.debug(`Bot estaba en un estado o canal diferente. Destruyendo conexión existente`);
      existingConnection.destroy();
    }

    // Obtener el canal de destino
    const channel = await getChannel(guild, channelId);

    // Comprobar canal de voz
    if (!channel.isVoiceBased()) {
      throw new AppError(`El canal ${channel.name} no es un canal de voz`);
    }

    // Crear nueva conexión
    const newConnection = joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      // selfDeaf: false,
    });

    // Devolver promesa con el estado de la conexión
    return new Promise((resolve, reject) => {
      // Cuando la conexión está lista
      newConnection.on(VoiceConnectionStatus.Ready, () => {
        log.info(`Bot conectado al canal '${channel.name}' (${channelId})`);
        resolve(newConnection);
      });

      // Cuando ocurrió un error al conectar al canal
      newConnection.on('error', (error) => {
        log.error(`Error crítico en la conexión al canal ${channel.name}: ${error}`);
        newConnection.destroy();
        reject(error);
      });

      // Bot desconectado del canal manualmente
      newConnection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
        console.log('newState.reason -> ', newState.reason);
        newConnection.destroy();
      });
    });
  } catch (error: any) {
    throw new AppError(`Error al conectar al canal ${channelId}`);
  }
}

// Timeout para desconectar al bot
export function timeoutBot(connection: VoiceConnection): void {
  // Limpiar temporizador existente
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }

  // Establecer nuevo temporizador
  timeout = setTimeout(() => {
    if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
      connection.destroy();
      log.info('Bot desconectado por inactividad');
    }
  }, SECONDS_TIMEOUT_BOT * 1000);
}
