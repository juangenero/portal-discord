import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from '@discordjs/voice';
import ytdl from '@distube/ytdl-core';
import { DMChannel, Message, TextChannel } from 'discord.js';
import { client } from '../../integrations/discord/discord-client.gateway';

export async function initYoutubeTest() {
  console.log('INICIO initYoutubeTest');
  client.on('messageCreate', async (message: Message) => {
    console.log('Mensaje creado -> ', message.content);
    if (message.author.bot) return;

    const channel = message.channel;

    if (!(channel instanceof TextChannel) && !(channel instanceof DMChannel)) {
      return;
    }

    // Comando !play
    if (message.content.startsWith('!play')) {
      const args = message.content.split(' ');
      const youtubeUrl = args[1];

      if (!youtubeUrl || !ytdl.validateURL(youtubeUrl)) {
        await message.reply(
          'Por favor, proporciona un enlace de YouTube válido. Ejemplo: `!play <enlace_youtube>`'
        );
        return;
      }

      const member = message.member;
      if (!member) {
        await message.reply('Este comando solo puede ser usado en un servidor.');
        return;
      }

      const voiceChannel = member.voice.channel;
      if (!voiceChannel) {
        await message.reply('Debes estar en un canal de voz para que pueda reproducir la canción.');
        return;
      }

      try {
        await message.reply(`Obteniendo stream de: ${youtubeUrl}. Esto puede tardar un momento...`);

        // 1. Obtener el stream de audio directamente
        const audioStream = ytdl(youtubeUrl, {
          filter: 'audioonly',
          quality: 'highestaudio',
          // Opcional: para un mejor rendimiento con streams
          highWaterMark: 1 << 25, // Aumenta el buffer a 32MB
        });

        const audioInfo = await ytdl.getInfo(youtubeUrl);

        try {
          const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
          });

          const player = createAudioPlayer();
          connection.subscribe(player);

          // 2. Crear un AudioResource directamente desde el stream
          const resource = createAudioResource(audioStream);
          player.play(resource);

          await message.reply(`Reproduciendo **${audioInfo.videoDetails.title}**`);
          console.log('El bot ha empezado a reproducir el audio directamente desde el stream.');

          player.on(AudioPlayerStatus.Playing, () => {
            console.log('El bot está reproduciendo el audio.');
          });

          player.on(AudioPlayerStatus.Idle, () => {
            console.log('El bot ha terminado de reproducir el audio. Desconectando...');
            connection.destroy();
          });

          player.on('error', (error) => {
            console.error(`Error en el reproductor de audio: ${error.message}`);
            channel.send(`Hubo un error al reproducir el audio: ${error.message}`);
            connection.destroy();
          });
        } catch (voiceError) {
          console.error('Error al unirse o reproducir en el canal de voz:', voiceError);
          channel.send('No pude unirme al canal de voz o reproducir el audio.');
        }
      } catch (error) {
        console.error('Error en el comando !play:', error);
        await message.reply('Hubo un problema al procesar tu solicitud.');
      }
    }

    // Comando !stop
    // if (message.content === '!stop') {
    //   const member = message.member;
    //   if (!member) {
    //     await message.reply('Este comando solo puede ser usado en un servidor.');
    //     return;
    //   }

    //   const guild = message.guild;
    //   if (!guild) {
    //     await message.reply('Este comando solo puede ser usado en un servidor.');
    //     return;
    //   }

    //   // Obtener la conexión de voz para este gremio (servidor)
    //   const connection = client.voice.adapters.get(guild.id);

    //   if (connection) {
    //     try {
    //       connection.destroy(); // Destruye la conexión de voz
    //       await message.reply('¡Reproducción detenida!');
    //       console.log(`Bot desconectado del canal de voz en el servidor: ${guild.name}`);
    //     } catch (error) {
    //       console.error('Error al intentar detener la reproducción o desconectar:', error);
    //       await message.reply('Hubo un problema al intentar detener la reproducción.');
    //     }
    //   } else {
    //     await message.reply('No estoy reproduciendo nada en este momento.');
    //   }
    //   return;
    // }
  });
}
