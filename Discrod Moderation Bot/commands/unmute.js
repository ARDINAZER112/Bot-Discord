const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { sendModLog } = require('../utils/modlog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Hapus mute (timeout) dari anggota')
    .addUserOption(opt =>
      opt.setName('user').setDescription('Anggota yang akan di-unmute').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(target.id);

    if (!member) {
      return interaction.reply({ content: '❌ User tidak ditemukan di server ini.', ephemeral: true });
    }
    if (!member.isCommunicationDisabled?.()) {
      return interaction.reply({ content: 'ℹ️ User ini sedang tidak di-mute.', ephemeral: true });
    }

    try {
      await member.timeout(null);
      await interaction.reply(`🔊 **${target.tag}** telah di-unmute.`);

      sendModLog(interaction.client, interaction.guild, {
        action: 'Unmute',
        target: `${target.tag} (${target.id})`,
        moderator: interaction.user.tag,
        reason: '-',
        color: 0x57f287,
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Gagal melakukan unmute. Cek log console.', ephemeral: true });
    }
  },
};
