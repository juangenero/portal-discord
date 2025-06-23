import { Guild, GuildBasedChannel, GuildMember, Message, VoiceBasedChannel } from 'discord.js';
import CONFIG from '../../../config/env.config';
import { AppError } from '../../../shared/errors/error-factory';
import { client } from './client';

const { DISCORD_GUILD_ID, DISCORD_CHANNEL_LOG_ID } = CONFIG;

// Enviar texto a un canal
export async function sendMessageDiscord(msg: string): Promise<Message<boolean>> {
  try {
    // Obtener canal del log
    const guild = await getGuild(DISCORD_GUILD_ID);
    const channel = await getChannel(guild, DISCORD_CHANNEL_LOG_ID);

    // Check canal de texto
    if (!channel.isTextBased()) {
      throw new AppError(`El canal con ID ${DISCORD_CHANNEL_LOG_ID} no es un canal de texto.`);
    }

    // Enviar mensaje
    return channel.send(msg);
  } catch (error: any) {
    throw new AppError(
      `No se pudo enviar el mensaje al canal ${DISCORD_CHANNEL_LOG_ID}. Causa: ${error.message}`
    );
  }
}

// get server
export async function getGuild(guildId: string): Promise<Guild> {
  try {
    const guild = await client.guilds.fetch(guildId);
    if (!guild) throw new Error(`El bot no está en el servidor ${guildId}`);
    return guild;
  } catch (error) {
    throw new AppError(`Error al obtener el servidor ${guildId}`);
  }
}

// get canal
export async function getChannel(guild: Guild, channelId: string): Promise<GuildBasedChannel> {
  try {
    const channel = await guild.channels.fetch(channelId);
    if (!channel) throw new AppError(`El canal ${channelId} no existe en el servidor ${guild.id}`);
    return channel;
  } catch (error) {
    throw new AppError(`Error al obtener el canal ${channelId}`);
  }
}

// get member
export async function getMember(guild: Guild, userId: string): Promise<GuildMember> {
  try {
    const member = await guild.members.fetch(userId);
    if (!member) throw new AppError(`El usuario ${userId} no está en el servidor ${guild.id}`);

    return member;
  } catch (error) {
    throw new AppError(`Error al obtener el usuario ${userId}`);
  }
}

// Obtiene el canal de voz al que está conectado el usuario
export async function getUserChanel(userId: string): Promise<VoiceBasedChannel> {
  try {
    const guild = await getGuild(DISCORD_GUILD_ID);
    const member = await getMember(guild, userId);
    const channel = member.voice.channel;
    if (!channel) throw new AppError(`El usuario ${userId} no está en ningún canal de voz`);

    return channel;
  } catch (error) {
    throw new AppError('Ocurrió un error al obtener canal de voz del usuario');
  }
}
