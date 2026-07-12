const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Cek apakah bot online dan berapa latensinya'),

  async execute(interaction) {
    const sent = await interaction.reply({ content: '🏓 Menghitung ping...', fetchReply: true });

    const roundtrip = sent.createdTimestamp - interaction.createdTimestamp;
    const wsPing = interaction.client.ws.ping;

    await interaction.editReply(
      `🏓 **Pong!**\nLatensi roundtrip: \`${roundtrip}ms\`\nLatensi API/WebSocket: \`${wsPing}ms\``
    );
  },
};
