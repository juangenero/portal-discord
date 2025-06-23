import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  VoiceConnection,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { AppError } from '../../../shared/errors/error-factory';
import log from '../../../shared/utils/log/logger';

let audioPlayer: AudioPlayer | null = null; // Reproductor de audio

export async function usePlayerDiscord(
  conexion: VoiceConnection,
  filename: string
): Promise<boolean> {
  // Asegura que el reproductor global exista y tenga sus listeners
  initAudioPlayer();

  // Comprueba que hay una conexión de voz activa y no destruida
  if (!conexion || conexion.state.status === VoiceConnectionStatus.Destroyed) {
    throw new AppError('No hay una conexión de voz activa para reproducir el sonido.');
  }

  const filePath = `${__dirname}/../../../../uploads/${filename}`;
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

// Iniciar reproductor
function initAudioPlayer(): void {
  if (!audioPlayer) {
    console.log('Inicializando audioPlayer');
    audioPlayer = createAudioPlayer();

    // Cuando la reproducción termina, reinicia el temporizador de inactividad
    audioPlayer.on(AudioPlayerStatus.Idle, () => {
      log.debug('AudioPlayer - Idle');
      // if (conexion) {
      //   timeoutBot(conexion);
      // }
    });

    // Cuando un nuevo sonido empieza a reproducirse, se reinicia el temporizador
    audioPlayer.on(AudioPlayerStatus.Playing, () => {
      log.debug('AudioPlayer - Playing');
      // if (conexion) {
      //   timeoutBot(conexion);
      // }
    });

    // Cuando hay un error, el reproductor se detiene y se reinicia el temporizador
    audioPlayer.on('error', (error) => {
      log.error(`AudioPlayer - Error: ${error}`);
      audioPlayer!.stop();
      // if (conexion) {
      //   timeoutBot(conexion);
      // }
    });

    log.debug('AudioPlayer global inicializado.');
  }
}
