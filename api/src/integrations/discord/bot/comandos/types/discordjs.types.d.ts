import { Collection } from 'discord.js';
import { Command } from '../interfaces/Command';

// Extiende la interfaz Client de discord.js
declare module 'discord.js' {
  interface Client {
    commands: Collection<string, Command>;
    cooldowns: Collection<string, Collection<string, number>>;
  }
}
