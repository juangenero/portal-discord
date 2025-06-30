import { Guild, GuildMember, VoiceBasedChannel, VoiceChannel } from 'discord.js';
import { AppError } from '../../../shared/errors/error-factory';
import { channelLog, guild } from './index';

// get canal de voz
export async function getVoiceChannel(channelId: string): Promise<VoiceChannel> {
  try {
    const channel = await guild!.channels.fetch(channelId);
    if (!channel) throw new AppError(`El canal ${channelId} no existe en el servidor ${guild!.id}`);
    if (!channel.isVoiceBased()) throw new AppError(`El canal ${channel.name} no es de voz`);
    return channel as VoiceChannel;
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
    const member = await getMember(guild!, userId);
    const channel = member.voice.channel;
    if (!channel) throw new AppError(`El usuario ${userId} no está en ningún canal de voz`);

    return channel;
  } catch (error) {
    const msgLog = `<@!${userId}> debes estar conectado a un canal para reproducir sonidos`;
    channelLog!.send({ content: msgLog, allowedMentions: { users: [] } });
    throw new AppError('Ocurrió un error al obtener canal de voz del usuario');
  }
}
