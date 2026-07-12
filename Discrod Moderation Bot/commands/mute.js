const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { sendModLog } = require('../utils/modlog');

const MAX_TIMEOUT_MINUTES = 40320; // batas Discord: 28 hari

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute (timeout) anggota untuk durasi tertentu')
    .addUserOption(opt =>
      opt.setName('user').setDescription('Anggota yang akan di-mute').setRequired(true))
    .addIntegerOption(opt =>
      opt.setName('menit')
        .setDescription('Durasi mute dalam menit (maks 40320 = 28 hari)')
        .setMinValue(1)
        .setMaxValue(MAX_TIMEOUT_MINUTES)
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName('alasan').setDescription('Alasan mute').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const minutes = interaction.options.getInteger('menit');
    const reason = interaction.options.getString('alasan') || 'Tidak ada alasan diberikan';
    const member = interaction.guild.members.cache.get(target.id);

    if (!member) {
      return interaction.reply({ content: '❌ User tidak ditemukan di server ini.', ephemeral: true });
    }
    if (!member.moderatable) {
      return interaction.reply({
        content: '❌ Aku tidak bisa mute user ini. Cek posisi role bot dan role target.',
        ephemeral: true,
      });
    }
    if (member.id === interaction.user.id) {
      return interaction.reply({ content: '❌ Kamu tidak bisa mute dirimu sendiri.', ephemeral: true });
    }

    try {
      await member.timeout(minutes * 60 * 1000, reason);
      await interaction.reply(`🔇 **${target.tag}** di-mute selama ${minutes} menit.\nAlasan: ${reason}`);

      sendModLog(interaction.client, interaction.guild, {
        action: `Mute (${minutes} menit)`,
        target: `${target.tag} (${target.id})`,
        moderator: interaction.user.tag,
        reason,
        color: 0x5865f2,
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Gagal melakukan mute. Cek log console.', ephemeral: true });
    }
  },
};
