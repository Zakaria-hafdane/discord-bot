const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
  new SlashCommandBuilder().setName('apply').setDescription('Open the whitelist application'),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Registering slash command...');
    await rest.put(
      Routes.applicationCommands('1375605160092368916'),
      { body: commands },
    );
    console.log('Command registered!');
  } catch (error) {
    console.error(error);
  }
})();
