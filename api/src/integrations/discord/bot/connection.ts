import {
  entersState,
  getVoiceConnection,
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionDisconnectReason,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { VoiceBasedChannel } from 'discord.js';
import CONFIG from '../../../config/env.config';
import { AppError } from '../../../shared/errors/error-factory';
import log from '../../../shared/utils/log/logger';
import { guild } from './index';

// Variables de clase
const { SECONDS_TIMEOUT_BOT } = CONFIG;
// let timeout: NodeJS.Timeout | null = null; // Timeout del bot

// Se conecta a un canal de voz si no estaba ya conectado
export async function conectarCanalWs(userChannel: VoiceBasedChannel): Promise<VoiceConnection> {
  log.debug('- - - - - INICIO conectarCanalWs - - - - -');
  try {
    // Posible conexión existente
    const existingConnection = getVoiceConnection(guild!.id);

    if (
      // La conexión existe
      existingConnection &&
      // La conexión es al canal de destino
      existingConnection.joinConfig.channelId === userChannel.id &&
      // La conexión está en un estado permitido
      [VoiceConnectionStatus.Ready, VoiceConnectionStatus.Connecting].includes(
        existingConnection.state.status
      )
    ) {
      log.debug(`Reutilizando conexión la conexión del canal '${userChannel.name}'`);
      log.debug('- - - - - FIN conectarCanalWs - - - - -');
      return existingConnection;
    }

    // Cerrar posible conexión del canal que ya no se usará
    if (existingConnection) {
      log.debug(`El bot estaba en un estado o canal diferente. Destruyendo conexión existente`);
      existingConnection.destroy();
    }

    // Crear nueva conexión
    const newConnection = joinVoiceChannel({
      channelId: userChannel.id,
      guildId: guild!.id,
      adapterCreator: guild!.voiceAdapterCreator,
    });

    // Manejar errores de la nueva conexión
    newConnection.on('error', (error) => {
      log.error(`Error en la conexión con ${userChannel.name}: ${error.message || error}`);
      newConnection.destroy();
    });

    // Manejar la desconexión inesperada del bot (desconectado/movido por un usuario u otro motivo)
    newConnection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
      if (newState.reason === VoiceConnectionDisconnectReason.Manual) {
        log.debug(`Desconectado programáticamente del canal '${userChannel.name}'`);
        newConnection.destroy();
      } else if (
        newState.reason === VoiceConnectionDisconnectReason.WebSocketClose &&
        newState.closeCode === 4014
      ) {
        log.warn(`El bot ha sido movido o desconectado de '${userChannel.name}'`);
        newConnection.destroy();
      } else {
        log.warn(`Conexión perdida con '${userChannel.name}'`);
      }
    });

    // Esperar a que la conexión esté en estado Ready
    try {
      await entersState(newConnection, VoiceConnectionStatus.Ready, 5000);
      log.debug(`Bot conectado al canal '${userChannel.name}'`);
      return newConnection;
    } catch (error: any) {
      newConnection.destroy();
      log.error(`Error al conectar al canal ${userChannel.name}: ${error.message || error}`);
      throw new AppError(`No se pudo establecer la conexión al canal ${userChannel.name}.`);
    }
  } catch (error: any) {
    log.error(`Error general al intentar conectar: ${error.message || error}`);
    throw new AppError(`Error al conectar al canal ${userChannel.name || userChannel.id}`);
  } finally {
    log.debug('- - - - - FIN conectarCanalWs - - - - -');
  }
}

// Timeout para desconectar al bot
// export function timeoutBot(connection: VoiceConnection): void {
//   // Limpiar temporizador existente
//   if (timeout) {
//     clearTimeout(timeout);
//     timeout = null;
//   }

//   // Establecer nuevo temporizador
//   timeout = setTimeout(() => {
//     if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
//       connection.destroy();
//       log.info('Bot desconectado por inactividad');
//     }
//   }, SECONDS_TIMEOUT_BOT * 1000);
// }
