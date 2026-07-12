const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Deskripsi tambahan per command (opsional, biar lebih jelas dari sekadar setDescription)
const USAGE = {
  ping: '`/ping` — cek apakah bot online dan latensinya',
  help: '`/help` — tampilkan pesan ini',
  ban: '`/ban user alasan hapus_pesan_hari` — ban anggota dari server',
  kick: '`/kick user alasan` — kick anggota dari server',
  mute: '`/mute user menit alasan` — timeout anggota (maks 40320 menit / 28 hari)',
  unmute: '`/unmute user` — hapus timeout dari anggota',
  warn: '`/warn user alasan` — beri peringatan ke anggota',
  warnings: '`/warnings user` — lihat daftar peringatan seorang anggota',
  clearwarnings: '`/clearwarnings user` — hapus semua peringatan seorang anggota',
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Tampilkan daftar semua command yang tersedia'),

  async execute(interaction) {
    const commands = interaction.client.commands;

    const lines = commands.map(cmd =>
      USAGE[cmd.data.name] || `\`/${cmd.data.name}\` — ${cmd.data.description}`
    );

    const embed = new EmbedBuilder()
      .setTitle('📖 Daftar Command')
      .setColor(0x5865f2)
      .setDescription(lines.join('\n'))
      .setFooter({ text: 'Command moderasi hanya bisa dipakai oleh role dengan izin yang sesuai.' });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
