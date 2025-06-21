import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { Client, GatewayIntentBits, Guild, GuildBasedChannel } from 'discord.js';
import CONFIG from '../../config/env.config.js';
import { AppError } from '../../shared/errors/error-factory.js';
import log from '../../shared/utils/log/logger.js';

// Variables de clase
const { TOKEN_BOT, SECONDS_TIMEOUT_BOT, DISCORD_GUILD_ID } = CONFIG;

let conexion: VoiceConnection | null = null; // Conexión al canal de voz
let audioPlayer: AudioPlayer | null = null; // Reproductor de audio
let timeout: NodeJS.Timeout | null = null; // Timeout del bot
// TODO - aqui podría ir el objeto GUILD

// Cliente de discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
});

export async function reproducirSonido(filename: string): Promise<boolean> {
  // Asegura que el reproductor global exista y tenga sus listeners
  initAudioPlayer();

  // Comprueba que hay una conexión de voz activa y no destruida
  if (!conexion || conexion.state.status === VoiceConnectionStatus.Destroyed) {
    throw new AppError('No hay una conexión de voz activa para reproducir el sonido.');
  }

  const filePath = `${__dirname}/../../../uploads/${filename}`;
  const resource = createAudioResource(filePath);

  return new Promise<boolean>((resolve, reject) => {
    // Suscribir el reproductor a la conexión. Es seguro llamarlo múltiples veces.
    // Solo se suscribe si aún no lo está o si la conexión ha cambiado.
    conexion!.subscribe(audioPlayer!);
    audioPlayer!.play(resource);

    // Estos listeners son específicos para la resolución/rechazo de esta PROMESA
    // de `reproducirSonido`. Los listeners persistentes del audioPlayer
    // (Playing, Idle, Error) que gestionan el timeout deben estar en `initAudioPlayer`.

    // Listener para cuando el audio empieza a reproducirse (resolución de la promesa)
    const onPlaying = () => {
      // Remover los listeners específicos de esta promesa para evitar fugas
      audioPlayer!.removeListener(AudioPlayerStatus.Playing, onPlaying);
      audioPlayer!.removeListener('error', onError); // También remover el error listener
      log.info(`Reproducción de '${filename}' INICIADA y promesa RESUELTA.`);
      resolve(true); // Resuelve la promesa cuando el audio comienza
    };

    // Listener para errores específicos de esta reproducción (rechazo de la promesa)
    const onError = (error: any) => {
      // Remover los listeners específicos de esta promesa
      audioPlayer!.removeListener(AudioPlayerStatus.Playing, onPlaying);
      audioPlayer!.removeListener('error', onError);
      log.error(`Error al reproducir '${filename}': ${error.message}`);
      // El audioPlayer.stop() ya lo maneja el listener global de error en initAudioPlayer
      reject(new AppError(`Error al iniciar la reproducción: ${error.message}`));
    };

    // Adjuntar los listeners temporales a la instancia del reproductor
    audioPlayer!.on(AudioPlayerStatus.Playing, onPlaying);
    audioPlayer!.on('error', onError);

    // Iniciar la reproducción del nuevo recurso
    audioPlayer!.play(resource);
    log.debug(`Solicitud de reproducción para: ${filename}`);

    // Nota: Los logs de 'Playing' del reproductor global (en initAudioPlayer)
    // se encargarán de llamar a timeoutBot().
  }).catch((error) => {
    // Este catch es para errores que puedan ocurrir antes de que la promesa de new Promise se cree
    // o para re-lanzar el reject si la promesa se rechaza.
    log.error(`Fallo general en reproducirSonido para ${filename}: ${error.message}`);
    throw error;
  });
}

/**
 * Loguea el bot en Discord (inicia/retoma conexión websocket)
 */
export async function loginBotDiscord() {
  try {
    if (!client.isReady()) {
      await client.login(TOKEN_BOT);
      log.info('Bot logueado en Discord');
    } else {
      log.info('El bot ya estaba logueado en Discord');
    }
  } catch (error) {
    log.error(`Error al iniciar sesión con el token del bot: ${error}`);
    throw error;
  }
}

// ORQUESTADOR
export async function playSoundDiscord(sonido: any, usuarioId: string) {
  try {
    // 1. OBTENER CANAL
    const channelId = await getUserChanelId(usuarioId);

    // 2. CONECTAR AL CANAL
    conexion = await conectarCanalDiscord(channelId);

    // 3. REPRODUCIR SONIDO
    const result = await reproducirSonido(sonido);

    // return result;
  } catch (error) {
    log.error(`playSoundDiscord -> ${error}`);
    return false;
  }
}

/**
 * Se conecta a un canal de voz si no estaba ya conectado
 * @param channelId ID del canal al que se va a conectar
 * @returns Conexión creada u obtenida
 */
async function conectarCanalDiscord(channelId: string): Promise<VoiceConnection> {
  try {
    const guild = await getServer(DISCORD_GUILD_ID); // Obteiner servidor
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

/**
 * Obtiene el canal de voz al que está conectado el usuario
 * @param {string} userId - El ID de Discord del usuario.
 * @returns {Promise<idChannel: string>}
 */
export async function getUserChanelId(userId: string): Promise<string> {
  try {
    const guild = await client.guilds.fetch(DISCORD_GUILD_ID);
    if (!guild) {
      throw new AppError(`El bot no está en el servidor ${DISCORD_GUILD_ID}`);
    }

    const member = await guild.members.fetch(userId);
    if (!member) {
      throw new AppError(`El usuario ${userId} no está en el servidor ${DISCORD_GUILD_ID}`);
    }
    if (!member.voice.channel) {
      throw new AppError(`El usuario ${userId} no está conectado a ningún canal de voz`);
    }

    return member.voice.channel.id;
  } catch (error) {
    throw new AppError('Ocurrió un error al recueprar el ID del canal');
  }
}

// ----- AUXILIAR -----

// Iniciar reproductor
function initAudioPlayer(): void {
  if (!audioPlayer) {
    console.log('Inicializando audioPlayer');
    audioPlayer = createAudioPlayer();

    // Cuando la reproducción termina, reinicia el temporizador de inactividad
    audioPlayer.on(AudioPlayerStatus.Idle, () => {
      log.debug('AudioPlayer - Idle');
      if (conexion) {
        timeoutBot(conexion);
      }
    });

    // Cuando un nuevo sonido empieza a reproducirse, se reinicia el temporizador
    audioPlayer.on(AudioPlayerStatus.Playing, () => {
      log.debug('AudioPlayer - Playing');
      if (conexion) {
        timeoutBot(conexion);
      }
    });

    // Cuando hay un error, el reproductor se detiene y se reinicia el temporizador
    audioPlayer.on('error', (error) => {
      log.error(`AudioPlayer - Error: ${error}`);
      audioPlayer!.stop();
      if (conexion) {
        timeoutBot(conexion);
      }
    });

    log.debug('AudioPlayer global inicializado.');
  }
}

// Check server
async function getServer(guildId: string): Promise<Guild> {
  try {
    const guild = await client.guilds.fetch(guildId);
    if (!guild) throw new Error('Servidor no encontrado');
    return guild;
  } catch (error) {
    throw new AppError(`Error al recuperar el servidor ${guildId}`);
  }
}

// Check canal
async function getChannel(guild: Guild, channelId: string): Promise<GuildBasedChannel> {
  try {
    const channel = await guild.channels.fetch(channelId);
    if (!channel) throw new AppError('Canal no encontrado en el servidor');
    return channel;
  } catch (error) {
    throw new AppError(`Error al recuperar el canal ${channelId}`);
  }
}

// Timeout para desconectar al bot
function timeoutBot(connection: VoiceConnection): void {
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

// Enviar texto a un canal
export async function sendDiscordMessage(textChannelId: string, message: string): Promise<void> {
  try {
    // 1. Obtener la guild (servidor)
    const guild = await getServer(DISCORD_GUILD_ID);

    // 2. Obtener el canal por su ID
    const channel = await getChannel(guild, textChannelId);

    // 3. Comprobar si es canal de texto
    if (!channel.isTextBased()) {
      throw new AppError(`El canal con ID ${textChannelId} no es un canal de texto.`);
    }

    // 4. Enviar el mensaje
    await channel.send(message);
    log.debug(`Mensaje enviado al canal ${textChannelId}: "${message}"`);
  } catch (error: any) {
    log.error(`Error al enviar mensaje al canal ${textChannelId}: ${error.message}`);
    throw new AppError(
      `No se pudo enviar el mensaje al canal ${textChannelId}. Causa: ${error.message}`
    );
  }
}
