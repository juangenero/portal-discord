import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Obtener latencia del bot');

export async function execute(interaction: ChatInputCommandInteraction) {
  const latencia = interaction.client.ws.ping;
  await interaction.reply(`Pong 🏓\n${latencia} ms`);
}
