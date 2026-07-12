const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { sendModLog } = require('../utils/modlog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban anggota dari server')
    .addUserOption(opt =>
      opt.setName('user').setDescription('Anggota yang akan di-ban').setRequired(true))
    .addStringOption(opt =>
      opt.setName('alasan').setDescription('Alasan ban').setRequired(false))
    .addIntegerOption(opt =>
      opt.setName('hapus_pesan_hari')
        .setDescription('Hapus pesan user dalam N hari terakhir (0-7)')
        .setMinValue(0)
        .setMaxValue(7)
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('alasan') || 'Tidak ada alasan diberikan';
    const deleteDays = interaction.options.getInteger('hapus_pesan_hari') || 0;

    const member = interaction.guild.members.cache.get(target.id);

    if (member) {
      if (!member.bannable) {
        return interaction.reply({
          content: '❌ Aku tidak bisa ban user ini. Cek posisi role bot dan role target.',
          ephemeral: true,
        });
      }
      if (member.id === interaction.user.id) {
        return interaction.reply({ content: '❌ Kamu tidak bisa ban dirimu sendiri.', ephemeral: true });
      }
    }

    try {
      await interaction.guild.members.ban(target.id, {
        reason,
        deleteMessageSeconds: deleteDays * 24 * 60 * 60,
      });

      await interaction.reply(`🔨 **${target.tag}** telah di-ban.\nAlasan: ${reason}`);

      sendModLog(interaction.client, interaction.guild, {
        action: 'Ban',
        target: `${target.tag} (${target.id})`,
        moderator: interaction.user.tag,
        reason,
        color: 0xed4245,
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Gagal melakukan ban. Cek log console.', ephemeral: true });
    }
  },
};
