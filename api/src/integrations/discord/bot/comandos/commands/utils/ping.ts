import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder().setName('ping').setDescription('Responde con Pong!');

export async function execute(interaction: any) {
  await interaction.reply('Pong!');
}
