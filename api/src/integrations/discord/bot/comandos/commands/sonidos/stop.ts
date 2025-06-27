import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { pararSonido } from '../../../../../../modules/discord/discord.service';

export const data = new SlashCommandBuilder()
  .setName('stop')
  .setDescription('Parar la reproducción de sonidos');

// Ejecución del comando
export async function execute(interaction: ChatInputCommandInteraction) {
  const stopSonido = pararSonido();

  if (stopSonido) {
    interaction.reply('Reproducción detenida');
  } else {
    interaction.reply('No había nada reproduciéndose');
  }
}

export default { data, execute };
