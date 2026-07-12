require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
  ],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.warn(`⚠️  Command di ${file} tidak punya "data" atau "execute", dilewati.`);
  }
}

client.once(Events.ClientReady, readyClient => {
  console.log(`✅ Bot login sebagai ${readyClient.user.tag}`);
  console.log(`   Aktif di ${readyClient.guilds.cache.size} server.`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    console.error(`❌ Command "${interaction.commandName}" tidak ditemukan.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error saat menjalankan /${interaction.commandName}:`, error);
    const errorMessage = { content: '❌ Terjadi kesalahan saat menjalankan command ini.', ephemeral: true };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage).catch(() => {});
    } else {
      await interaction.reply(errorMessage).catch(() => {});
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
