import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { reproducirSonido } from '../../../../../../modules/sonido/sonido.service';
import { getCacheSonidos } from '../../shared/sonidos';

export const data = new SlashCommandBuilder()
  .setName('play')
  .setDescription('Reproducir un sonido')
  .addStringOption((option) =>
    option
      .setName('sonido')
      .setDescription('Sonido que se va a reproducir')
      .setRequired(true)
      .setAutocomplete(true)
  );

// Ejecución del comando
export async function execute(interaction: ChatInputCommandInteraction) {
  const sonidoId = Number(interaction.options.getString('sonido', true));
  const userId = interaction.user.id;
  const result = await reproducirSonido(sonidoId, userId, true);

  await interaction.reply(`***${result.sonido}*** reproducido en <#${result.canal}>`);
}

// Función de autocompletado
export async function autocomplete(interaction: AutocompleteInteraction) {
  const paramFocused = interaction.options.getFocused();

  const sonidos = await getCacheSonidos();

  const sonidosFiltrados = sonidos
    .filter((opciones) => opciones.nombre.toLowerCase().includes(paramFocused.toLowerCase()))
    .slice(0, 25);

  const opciones = sonidosFiltrados.map((choice) => ({
    name: choice.nombre,
    value: String(choice.id),
  }));

  await interaction.respond(opciones);
}

export default { data, execute, autocomplete };
