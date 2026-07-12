const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { addWarning } = require('../utils/warningsStore');
const { sendModLog } = require('../utils/modlog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Beri peringatan ke anggota')
    .addUserOption(opt =>
      opt.setName('user').setDescription('Anggota yang akan diberi peringatan').setRequired(true))
    .addStringOption(opt =>
      opt.setName('alasan').setDescription('Alasan peringatan').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('alasan');

    if (target.id === interaction.user.id) {
      return interaction.reply({ content: '❌ Kamu tidak bisa warn dirimu sendiri.', ephemeral: true });
    }

    const totalWarnings = addWarning(
      interaction.guild.id,
      target.id,
      reason,
      interaction.user.tag
    );

    await interaction.reply(
      `⚠️ **${target.tag}** telah diberi peringatan.\nAlasan: ${reason}\nTotal peringatan: ${totalWarnings}`
    );

    // Coba kirim DM ke user yang di-warn (boleh gagal kalau DM ditutup)
    target.send(
      `⚠️ Kamu mendapat peringatan di server **${interaction.guild.name}**.\nAlasan: ${reason}`
    ).catch(() => {});

    sendModLog(interaction.client, interaction.guild, {
      action: `Warn (total: ${totalWarnings})`,
      target: `${target.tag} (${target.id})`,
      moderator: interaction.user.tag,
      reason,
      color: 0xfee75c,
    });
  },
};
