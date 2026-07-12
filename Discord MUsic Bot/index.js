require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
  SlashCommandBuilder,
  EmbedBuilder,
} = require('discord.js');
const { DisTube } = require('distube');
const { YouTubePlugin } = require('@distube/youtube');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// ---------- DisTube setup ----------
const distube = new DisTube(client, {
  plugins: [new YouTubePlugin()],
  emitNewSongOnly: true,
});

client.distube = distube;

// ---------- Slash commands ----------
const commands = [
  new SlashCommandBuilder()
    .setName('play')
    .setDescription('Putar lagu dari YouTube (judul atau link)')
    .addStringOption((opt) =>
      opt.setName('lagu').setDescription('Judul lagu atau URL YouTube').setRequired(true)
    ),
  new SlashCommandBuilder().setName('skip').setDescription('Lewati lagu yang sedang diputar'),
  new SlashCommandBuilder().setName('stop').setDescription('Hentikan musik dan kosongkan antrean'),
  new SlashCommandBuilder().setName('pause').setDescription('Jeda lagu yang sedang diputar'),
  new SlashCommandBuilder().setName('resume').setDescription('Lanjutkan lagu yang dijeda'),
  new SlashCommandBuilder().setName('queue').setDescription('Lihat antrean lagu'),
  new SlashCommandBuilder().setName('leave').setDescription('Keluarkan bot dari voice channel'),
  new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Atur volume pemutaran')
    .addIntegerOption((opt) =>
      opt.setName('persen').setDescription('Volume 1-100').setRequired(true)
    ),
].map((c) => c.toJSON());

async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  try {
    console.log('Mendaftarkan slash command...');
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log('Slash command berhasil didaftarkan.');
  } catch (err) {
    console.error('Gagal mendaftarkan slash command:', err);
  }
}

// ---------- Ready ----------
client.once('clientReady', () => {
  console.log(`Bot online sebagai ${client.user.tag}`);
});

// ---------- Interaction handler ----------
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, member, guild } = interaction;
  const voiceChannel = member.voice.channel;

  const needsVoice = ['play', 'skip', 'stop', 'pause', 'resume', 'volume'];
  if (needsVoice.includes(commandName) && !voiceChannel) {
    return interaction.reply({
      content: 'Kamu harus join voice channel dulu!',
      ephemeral: true,
    });
  }

  try {
    switch (commandName) {
      case 'play': {
        const query = interaction.options.getString('lagu');
        await interaction.deferReply();
        await distube.play(voiceChannel, query, {
          member,
          textChannel: interaction.channel,
        });
        await interaction.editReply(`🔎 Mencari: **${query}**`);
        break;
      }

      case 'skip': {
        const queue = distube.getQueue(guild.id);
        if (!queue) return interaction.reply({ content: 'Tidak ada lagu yang diputar.', ephemeral: true });
        await queue.skip();
        interaction.reply('⏭️ Lagu dilewati.');
        break;
      }

      case 'stop': {
        const queue = distube.getQueue(guild.id);
        if (!queue) return interaction.reply({ content: 'Tidak ada lagu yang diputar.', ephemeral: true });
        queue.stop();
        interaction.reply('⏹️ Musik dihentikan dan antrean dikosongkan.');
        break;
      }

      case 'pause': {
        const queue = distube.getQueue(guild.id);
        if (!queue) return interaction.reply({ content: 'Tidak ada lagu yang diputar.', ephemeral: true });
        queue.pause();
        interaction.reply('⏸️ Lagu dijeda.');
        break;
      }

      case 'resume': {
        const queue = distube.getQueue(guild.id);
        if (!queue) return interaction.reply({ content: 'Tidak ada lagu yang dijeda.', ephemeral: true });
        queue.resume();
        interaction.reply('▶️ Lagu dilanjutkan.');
        break;
      }

      case 'queue': {
        const queue = distube.getQueue(guild.id);
        if (!queue || queue.songs.length === 0) {
          return interaction.reply({ content: 'Antrean kosong.', ephemeral: true });
        }
        const list = queue.songs
          .slice(0, 10)
          .map((song, i) => `${i === 0 ? '▶️' : `${i}.`} **${song.name}** - \`${song.formattedDuration}\``)
          .join('\n');
        const embed = new EmbedBuilder()
          .setTitle('🎶 Antrean Lagu')
          .setDescription(list)
          .setColor(0x5865f2);
        interaction.reply({ embeds: [embed] });
        break;
      }

      case 'leave': {
        const queue = distube.getQueue(guild.id);
        if (queue) queue.voice.leave();
        else if (guild.members.me.voice.channel) guild.members.me.voice.disconnect();
        interaction.reply('👋 Bot keluar dari voice channel.');
        break;
      }

      case 'volume': {
        const persen = interaction.options.getInteger('persen');
        const queue = distube.getQueue(guild.id);
        if (!queue) return interaction.reply({ content: 'Tidak ada lagu yang diputar.', ephemeral: true });
        queue.setVolume(persen);
        interaction.reply(`🔊 Volume diatur ke ${persen}%`);
        break;
      }
    }
  } catch (err) {
    console.error(err);
    const msg = `❌ Terjadi kesalahan: ${err.message}`;
    if (interaction.deferred || interaction.replied) {
      interaction.editReply(msg);
    } else {
      interaction.reply({ content: msg, ephemeral: true });
    }
  }
});

// ---------- DisTube events ----------
distube
  .on('playSong', (queue, song) => {
    queue.textChannel?.send(
      `🎵 Sedang memutar: **${song.name}** - \`${song.formattedDuration}\` (diminta oleh ${song.user})`
    );
  })
  .on('addSong', (queue, song) => {
    queue.textChannel?.send(`✅ Ditambahkan ke antrean: **${song.name}** - \`${song.formattedDuration}\``);
  })
  .on('error', (channel, e) => {
    console.error(e);
    channel?.send(`❌ Terjadi kesalahan: ${e.message}`.slice(0, 1900));
  })
  .on('finish', (queue) => {
    queue.textChannel?.send('✅ Antrean selesai diputar.');
  })
  .on('empty', (queue) => {
    queue.textChannel?.send('👋 Voice channel kosong, bot keluar otomatis.');
  })
  .on('disconnect', (queue) => {
    queue.textChannel?.send('🔌 Bot terputus dari voice channel.');
  });

// ---------- Start ----------
(async () => {
  await registerCommands();
  await client.login(process.env.DISCORD_TOKEN);
})();
