const { EmbedBuilder } = require('discord.js');

async function sendModLog(client, guild, { action, target, moderator, reason, color }) {
  const channelId = process.env.MOD_LOG_CHANNEL_ID;
  if (!channelId) return;

  const channel = guild.channels.cache.get(channelId);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setTitle(`Moderasi: ${action}`)
    .setColor(color || 0xed4245)
    .addFields(
      { name: 'Target', value: `${target}`, inline: true },
      { name: 'Moderator', value: `${moderator}`, inline: true },
      { name: 'Alasan', value: reason || 'Tidak ada alasan diberikan' }
    )
    .setTimestamp();

  channel.send({ embeds: [embed] }).catch(() => {});
}

module.exports = { sendModLog };
