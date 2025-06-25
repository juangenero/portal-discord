import { Events } from 'discord.js';
import { client } from '../../index.js';

export function autocompleteHandlerWs() {
  client.on(Events.InteractionCreate, async (interaction) => {
    // 1. Checkeo inicial
    if (!interaction.isAutocomplete()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No se encontró ningún comando que coincida con ${interaction.commandName}`);
      return;
    }

    // 2. Procesar autocompletado
    try {
      await command.autocomplete(interaction);
    } catch (error) {
      console.error(error);
    }
  });
}
