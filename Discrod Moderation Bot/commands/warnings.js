const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getWarnings } = require('../utils/warningsStore');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('Lihat daftar peringatan seorang anggota')
    .addUserOption(opt =>
      opt.setName('user').setDescription('Anggota yang ingin dicek').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const warnings = getWarnings(interaction.guild.id, target.id);

    if (warnings.length === 0) {
      return interaction.reply({
        content: `✅ **${target.tag}** tidak punya peringatan.`,
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setTitle(`Peringatan untuk ${target.tag}`)
      .setColor(0xfee75c)
      .setDescription(
        warnings
          .map((w, i) => {
            const date = new Date(w.timestamp).toLocaleString('id-ID');
            return `**${i + 1}.** ${w.reason}\n↳ oleh ${w.moderator} • ${date}`;
          })
          .join('\n\n')
      )
      .setFooter({ text: `Total: ${warnings.length} peringatan` });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
