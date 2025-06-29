import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  ComponentType,
  SlashCommandBuilder,
} from 'discord.js';
import { pararSonido } from '../../../../../../modules/discord/discord.service';
import { reproducirSonido } from '../../../../../../modules/sonido/sonido.service';
import log from '../../../../../../shared/utils/log/logger';
import { getCacheSonidos } from '../../shared/sonidos';

export const data = new SlashCommandBuilder()
  .setName('soundboard')
  .setDescription('Mostrar panel de sonidos con paginación');

// Constantes para la paginación
const BUTTONS_PER_ROW = 5; // Discord solo permite 5 botones por fila
const MAX_ROWS = 5; // Discord solo permite 5 filas de componentes
const SOUND_ROWS_MAX = 4; // Máximo de filas dedicadas a botones de sonido
const BUTTONS_PER_SOUND_ROW = BUTTONS_PER_ROW * SOUND_ROWS_MAX; // 20 botones de sonido en las primeras 4 filas

export async function execute(interaction: ChatInputCommandInteraction) {
  const sonidos = await getCacheSonidos();
  let currentPage = 0;

  const initialButtons = createSoundboard(sonidos, currentPage);
  const response = await interaction.reply({
    components: initialButtons,
  });

  const collector = response.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 3_000_000,
  });

  collector.on('collect', async (soundboard) => {
    log.debug(`/soundboard -> Botón pulsado: ${soundboard.customId}`);

    if (soundboard.customId === 'prev_page') {
      currentPage--;
    } else if (soundboard.customId === 'next_page') {
      currentPage++;
    } else if (soundboard.customId === 'pause_sound') {
      log.debug('Botón "Stop" pulsado');
      pararSonido();

      await soundboard.update({
        components: createSoundboard(sonidos, currentPage),
      });
      return;
    } else if (soundboard.customId.startsWith('sound_')) {
      const sonidoId = Number(soundboard.customId.replace('sound_', ''));
      log.info(`Reproduciendo sonido con ID: ${sonidoId}`);
      await reproducirSonido(sonidoId, interaction.user.id, false);
    }

    const updatedButtons = createSoundboard(sonidos, currentPage);
    await soundboard.update({
      components: updatedButtons,
    });
  });

  collector.on('end', async (collected) => {
    log.info(`/soundboard -> Colector de botones finalizado con ${collected.size} interacciones`);
    await interaction.editReply({
      content: 'Panel cerrado, usa **`/soundboard`** para abrirlo de nuevo',
      components: [],
    });
  });
}

function createSoundboard(
  sonidos: {
    id: number;
    nombre: string;
  }[],
  page: number
): Array<ActionRowBuilder<ButtonBuilder>> {
  const totalPages = Math.ceil(sonidos.length / BUTTONS_PER_SOUND_ROW);
  const startIndex = page * BUTTONS_PER_SOUND_ROW;
  const endIndex = startIndex + BUTTONS_PER_SOUND_ROW;
  const sonidosPagina = sonidos.slice(startIndex, endIndex);

  const rows: Array<ActionRowBuilder<ButtonBuilder>> = [];
  let currentSoundButtons: ButtonBuilder[] = [];

  // 1. Crear las filas de botones de sonido
  for (let i = 0; i < sonidosPagina.length; i++) {
    currentSoundButtons.push(
      createButton(`sound_${sonidosPagina[i].id.toString()}`, sonidosPagina[i].nombre)
    );
    if (currentSoundButtons.length === BUTTONS_PER_ROW) {
      rows.push(createRow(currentSoundButtons));
      currentSoundButtons = [];
    }
  }

  // Añadir la última fila de botones de sonido si no está completa
  if (currentSoundButtons.length > 0) {
    rows.push(createRow(currentSoundButtons));
  }

  // 2. Preparar los botones de paginación y stop
  const controlButtons: ButtonBuilder[] = [];

  // Botón "Anterior" (siempre visible, deshabilitado si no hay página anterior)
  controlButtons.push(
    createButton('prev_page', '◀️ Anterior', ButtonStyle.Primary).setDisabled(page === 0)
  );

  // Botón de información de página (siempre visible si hay más de una página)
  if (totalPages > 1) {
    controlButtons.push(
      createButton(
        'page_info',
        `Página ${page + 1} de ${totalPages}`,
        ButtonStyle.Secondary
      ).setDisabled(true)
    );
  } else {
    // Si solo hay una página, mostrar "Página 1 de 1" deshabilitado para consistencia
    controlButtons.push(
      createButton('page_info', `Página 1 de 1`, ButtonStyle.Secondary).setDisabled(true)
    );
  }

  // Botón "Siguiente" (siempre visible, deshabilitado si no hay página siguiente)
  controlButtons.push(
    createButton('next_page', 'Siguiente ▶️', ButtonStyle.Primary).setDisabled(
      page === totalPages - 1
    )
  );

  // Botón de Pausar/Stop (siempre al final de los controles)
  controlButtons.push(createButton('pause_sound', 'Stop', ButtonStyle.Danger));

  // 3. Añadir la fila de control (paginación + pausa)
  if (controlButtons.length > 0) {
    if (rows.length < MAX_ROWS) {
      rows.push(createRow(controlButtons));
    } else {
      log.warn(
        'Se ha intentado añadir una fila de paginación superando el límite de MAX_ROWS. Esto no debería ocurrir.'
      );
    }
  }

  return rows.slice(0, MAX_ROWS);
}

function createButton(
  id: string,
  label: string,
  style: ButtonStyle = ButtonStyle.Secondary
): ButtonBuilder {
  return new ButtonBuilder().setCustomId(id).setLabel(label).setStyle(style);
}

function createRow(arrayButtons: Array<ButtonBuilder>): ActionRowBuilder<ButtonBuilder> {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(arrayButtons);
}

export default { data, execute };
