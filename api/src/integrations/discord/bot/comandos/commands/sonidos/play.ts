import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { obtenerSonidos, reproducirSonido } from '../../../../../../modules/sonido/sonido.service';
import log from '../../../../../../shared/utils/log/logger';

let sonidosCache: { id: number; nombre: string }[] = [];
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

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
  const result = await reproducirSonido(sonidoId, userId);
  await interaction.reply(`El usuario ${userId} seleccionado el sonido con id: ${sonidoId}`);
}

// Función de autocompletado
export async function autocomplete(interaction: AutocompleteInteraction) {
  const paramFocused = interaction.options.getFocused();

  const sonidos = await getSonidos();

  const sonidosFiltrados = sonidos
    .filter((opciones) => opciones.nombre.toLowerCase().startsWith(paramFocused.toLowerCase()))
    .slice(0, 30);

  const opciones = sonidosFiltrados.map((choice) => ({
    name: choice.nombre,
    value: String(choice.id),
  }));

  await interaction.respond(opciones);
}

async function getSonidos() {
  const now = Date.now();
  if (sonidosCache.length === 0 || now - cacheTimestamp > CACHE_TTL) {
    sonidosCache = await obtenerSonidos();
    log.debug(`/play -> Caché de autocompletado actualizados con ${sonidosCache.length} sonidos`);
    cacheTimestamp = now;
  }
  return sonidosCache;
}

export default { data, execute, autocomplete };
