const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { sendModLog } = require('../utils/modlog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick anggota dari server')
    .addUserOption(opt =>
      opt.setName('user').setDescription('Anggota yang akan di-kick').setRequired(true))
    .addStringOption(opt =>
      opt.setName('alasan').setDescription('Alasan kick').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('alasan') || 'Tidak ada alasan diberikan';
    const member = interaction.guild.members.cache.get(target.id);

    if (!member) {
      return interaction.reply({ content: '❌ User tidak ditemukan di server ini.', ephemeral: true });
    }
    if (!member.kickable) {
      return interaction.reply({
        content: '❌ Aku tidak bisa kick user ini. Cek posisi role bot dan role target.',
        ephemeral: true,
      });
    }
    if (member.id === interaction.user.id) {
      return interaction.reply({ content: '❌ Kamu tidak bisa kick dirimu sendiri.', ephemeral: true });
    }

    try {
      await member.kick(reason);
      await interaction.reply(`👢 **${target.tag}** telah di-kick.\nAlasan: ${reason}`);

      sendModLog(interaction.client, interaction.guild, {
        action: 'Kick',
        target: `${target.tag} (${target.id})`,
        moderator: interaction.user.tag,
        reason,
        color: 0xf59f00,
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Gagal melakukan kick. Cek log console.', ephemeral: true });
    }
  },
};
