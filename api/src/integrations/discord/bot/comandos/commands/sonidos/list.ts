import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { getCacheSonidos } from '../../shared/sonidos';

export const data = new SlashCommandBuilder()
  .setName('list')
  .setDescription('Listar todos los sonidos');

// Ejecución del comando
export async function execute(interaction: ChatInputCommandInteraction) {
  const listaSonidos = (await getCacheSonidos()).map((sonido) => `* ${sonido.nombre}`);
  const listaFormateada = listaSonidos.join('\n');
  interaction.reply({
    content: `Lista de sonidos disponibles:\n\n${listaFormateada}`,
    ephemeral: true,
  });
}

export default { data, execute };
