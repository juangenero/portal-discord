import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export interface Command {
  cooldown: number;
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<void>;
}
