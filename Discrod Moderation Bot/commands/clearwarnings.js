const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { clearWarnings } = require('../utils/warningsStore');
const { sendModLog } = require('../utils/modlog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearwarnings')
    .setDescription('Hapus semua peringatan seorang anggota')
    .addUserOption(opt =>
      opt.setName('user').setDescription('Anggota yang peringatannya akan dihapus').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const cleared = clearWarnings(interaction.guild.id, target.id);

    if (!cleared) {
      return interaction.reply({
        content: `ℹ️ **${target.tag}** tidak punya peringatan untuk dihapus.`,
        ephemeral: true,
      });
    }

    await interaction.reply(`🧹 Semua peringatan **${target.tag}** telah dihapus.`);

    sendModLog(interaction.client, interaction.guild, {
      action: 'Clear Warnings',
      target: `${target.tag} (${target.id})`,
      moderator: interaction.user.tag,
      reason: '-',
      color: 0x57f287,
    });
  },
};
