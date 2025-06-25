const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const TOKEN_BOT = 'MTM4NTY0ODIwMzE2NDE2MDIxMg.GEx_FP.KKg4h0QuzrBrv3iJ87tli1U1ymkyhDkzyd571k';
const DISCORD_GUILD_ID = '1386677370970177705';
const DISCORD_CLIENT_ID = '1385648203164160212';

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  // Grab all the command files from the commands directory you created earlier
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath);
  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(TOKEN_BOT);

// Despliegue de comandos
(async () => {
  try {
    // El método put se utiliza para actualizar completamente todos los comandos en el gremio con el conjunto actual
    const data = await rest.put(
      // Routes.applicationCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID),
      Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID),
      { body: commands }
    );

    console.log(`${data.length} comando(s) actualizado(s)`);
  } catch (error) {
    console.error(error);
  }
})();
