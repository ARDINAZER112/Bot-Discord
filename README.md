# Language
## [Indonesian](#Indonesian) | [English](#English)
----
Indonesian
---
# Discord Moderation Bot

Bot Discord untuk moderasi server: ban, kick, mute (timeout), warn, cek peringatan, dan hapus peringatan. Dibuat dengan `discord.js` v14.

## Fitur
- `/ban user alasan hapus_pesan_hari` — ban anggota, opsional hapus histori pesan
- `/kick user alasan` — kick anggota
- `/mute user menit alasan` — timeout anggota (maks 28 hari)
- `/unmute user` — hapus timeout
- `/warn user alasan` — beri peringatan (tersimpan permanen di `data/warnings.json`), otomatis coba DM ke user
- `/warnings user` — lihat semua peringatan seorang anggota
- `/clearwarnings user` — hapus semua peringatan seorang anggota
- Log otomatis ke channel moderasi (opsional, via `MOD_LOG_CHANNEL_ID`)

## Setup

### 1. Buat aplikasi bot di Discord
1. Buka https://discord.com/developers/applications → **New Application**.
2. Ke tab **Bot** → klik **Reset Token** → simpan token ini (untuk `DISCORD_TOKEN`).
3. Di tab **Bot**, aktifkan intent berikut (di bagian "Privileged Gateway Intents"):
   - **Server Members Intent** (wajib, dipakai untuk baca data member)
4. Ke tab **General Information** → salin **Application ID** (untuk `CLIENT_ID`).
5. Ke tab **OAuth2 → URL Generator**:
   - Scopes: centang `bot` dan `applications.commands`
   - Bot Permissions: centang `Ban Members`, `Kick Members`, `Moderate Members`, `Send Messages`, `View Channels`, `Read Message History`
   - Salin URL yang dihasilkan, buka di browser, lalu invite bot ke server kamu.

### 2. Ambil Guild ID
Aktifkan Developer Mode di Discord (Settings → Advanced → Developer Mode), lalu klik kanan nama server kamu → **Copy Server ID**. Ini untuk `GUILD_ID`.

### 3. Install dependencies
```bash
npm install
```

### 4. Konfigurasi environment
Salin `.env.example` menjadi `.env`, lalu isi:
```
DISCORD_TOKEN=token_bot_kamu
CLIENT_ID=application_id_kamu
GUILD_ID=id_server_kamu
MOD_LOG_CHANNEL_ID=   # opsional, id channel log moderasi
```

### 5. Daftarkan slash command
```bash
npm run deploy
```
Command langsung muncul di server (karena didaftarkan per-guild, bukan global — instan, tidak perlu tunggu ~1 jam seperti command global).

### 6. Jalankan bot
```bash
npm start
```

## Permission command
Setiap command sudah dibatasi lewat `setDefaultMemberPermissions`, jadi member biasa tidak akan melihat command ini di menu slash command. Kamu masih bisa atur ulang per-role lewat **Server Settings → Integrations → [Nama Bot]** di Discord kalau mau lebih spesifik.

## Struktur folder
```
discord-mod-bot/
├── index.js              # entry point, load semua command & login
├── deploy-commands.js    # daftarkan slash command ke server
├── commands/             # satu file per command
├── utils/
│   ├── warningsStore.js  # baca/tulis data warning ke JSON
│   └── modlog.js         # kirim embed log ke channel moderasi
├── data/warnings.json    # penyimpanan warning (auto-generated)
└── .env                  # token & config (jangan di-commit)
```

## Catatan
- Data warning disimpan di file JSON lokal — cukup untuk skala kecil-menengah. Kalau butuh lebih robust (banyak server, banyak data), pertimbangkan migrasi ke SQLite atau database lain.
- Bot butuh role dengan posisi **lebih tinggi** dari role target di server (Server Settings → Roles) supaya bisa ban/kick/mute.
- Untuk update command setelah edit file di `commands/`, jalankan ulang `npm run deploy`.
---
# Bot Musik Discord (discord.js + DisTube)

Bot Discord untuk memutar musik dari YouTube di voice channel, menggunakan slash command.

## Fitur
- `/play <lagu>` — putar lagu dari judul atau link YouTube
- `/skip` — lewati lagu
- `/stop` — hentikan & kosongkan antrean
- `/pause` / `/resume` — jeda & lanjutkan
- `/queue` — lihat antrean
- `/volume <persen>` — atur volume
- `/leave` — keluarkan bot dari voice channel

## Persiapan

### 1. Buat aplikasi bot di Discord
1. Buka https://discord.com/developers/applications
2. Klik **New Application**, beri nama bebas.
3. Ke tab **Bot** → klik **Reset Token** → salin token (ini `DISCORD_TOKEN`).
4. Masih di tab **Bot**, aktifkan **Message Content Intent** (di bagian Privileged Gateway Intents).
5. Ke tab **General Information** → salin **Application ID** (ini `CLIENT_ID`).
6. Ke tab **OAuth2 → URL Generator**:
   - Scopes: centang `bot` dan `applications.commands`
   - Bot Permissions: centang `Connect`, `Speak`, `Send Messages`, `Embed Links`, `View Channels`
   - Salin URL yang dihasilkan, buka di browser, lalu invite bot ke server kamu.

### 2. Install dependencies
Pastikan Node.js versi 18+ sudah terpasang, lalu jalankan di folder project:

```bash
npm install
```

### 3. Konfigurasi environment
Salin `.env.example` menjadi `.env`, lalu isi:

```
DISCORD_TOKEN=token_bot_kamu
CLIENT_ID=application_id_kamu
```

### 4. Jalankan bot

```bash
node index.js
```

Kalau berhasil, akan muncul log:
```
Mendaftarkan slash command...
Slash command berhasil didaftarkan.
Bot online sebagai NamaBot#1234
```

## Catatan penting
- Bot butuh **ffmpeg** untuk memproses audio. Package `ffmpeg-static` sudah disertakan sehingga tidak perlu install ffmpeg terpisah di kebanyakan sistem.
- Jika deploy ke hosting (VPS, Railway, dsb), pastikan environment variable `DISCORD_TOKEN` dan `CLIENT_ID` diset di platform hosting tersebut, bukan hanya di file `.env` lokal.
- Slash command didaftarkan secara global — bisa butuh waktu hingga ~1 jam untuk muncul pertama kali di semua server, tapi biasanya lebih cepat.
- Library YouTube (`@distube/ytdl`) kadang perlu update mengikuti perubahan YouTube. Jika `/play` tiba-tiba gagal, coba jalankan `npm update`.

## Struktur file
```
discord-music-bot/
├── index.js         # kode utama bot
├── package.json
├── .env.example      # contoh environment variable
└── README.md
```
----
English
---
# Discord Moderation Bot

A Discord bot for server moderation: ban, kick, mute (timeout), warn, check warnings, and clear warnings. Built with `discord.js` v14.

## Features
- `/ban user reason delete_message_days` — ban a member, optionally delete their message history
- `/kick user reason` — kick a member
- `/mute user minutes reason` — timeout a member (max 28 days)
- `/unmute user` — remove timeout
- `/warn user reason` — issue a warning (stored permanently in `data/warnings.json`), automatically tries to DM the user
- `/warnings user` — view all warnings for a member
- `/clearwarnings user` — clear all warnings for a member
- Automatic logging to a moderation channel (optional, via `MOD_LOG_CHANNEL_ID`)

## Setup

### 1. Create a Discord bot application
1. Go to https://discord.com/developers/applications → **New Application**.
2. Go to the **Bot** tab → click **Reset Token** → save this token (for `DISCORD_TOKEN`).
3. In the **Bot** tab, enable the following intent (under "Privileged Gateway Intents"):
   - **Server Members Intent** (required, used to read member data)
4. Go to the **General Information** tab → copy the **Application ID** (for `CLIENT_ID`).
5. Go to **OAuth2 → URL Generator**:
   - Scopes: check `bot` and `applications.commands`
   - Bot Permissions: check `Ban Members`, `Kick Members`, `Moderate Members`, `Send Messages`, `View Channels`, `Read Message History`
   - Copy the generated URL, open it in a browser, then invite the bot to your server.

### 2. Get the Guild ID
Enable Developer Mode in Discord (Settings → Advanced → Developer Mode), then right-click your server name → **Copy Server ID**. This is your `GUILD_ID`.

### 3. Install dependencies
```bash
npm install
```

### 4. Configure environment
Copy `.env.example` to `.env`, then fill it in:
```
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_application_id
GUILD_ID=your_server_id
MOD_LOG_CHANNEL_ID=   # optional, moderation log channel id
```

### 5. Register slash commands
```bash
npm run deploy
```
Commands appear immediately on the server (since they're registered per-guild rather than globally — instant, no need to wait ~1 hour like global commands).

### 6. Run the bot
```bash
npm start
```

## Command permissions
Every command is already restricted via `setDefaultMemberPermissions`, so regular members won't see these commands in the slash command menu. You can still customize permissions per role via **Server Settings → Integrations → [Bot Name]** in Discord if you want more granular control.

## Folder structure
```
discord-mod-bot/
├── index.js              # entry point, loads all commands & logs in
├── deploy-commands.js    # registers slash commands to the server
├── commands/             # one file per command
├── utils/
│   ├── warningsStore.js  # read/write warning data to JSON
│   └── modlog.js         # send embed logs to the moderation channel
├── data/warnings.json    # warning storage (auto-generated)
└── .env                  # token & config (don't commit this)
```

## Notes
- Warning data is stored in a local JSON file — sufficient for small-to-medium scale. If you need something more robust (many servers, lots of data), consider migrating to SQLite or another database.
- The bot needs a role positioned **higher** than the target role on the server (Server Settings → Roles) in order to ban/kick/mute.
- To update commands after editing files in `commands/`, run `npm run deploy` again.
---
# Discord Music Bot (discord.js + DisTube)

A Discord bot for playing music from YouTube in a voice channel, using slash commands.

## Features
- `/play <song>` — play a song by title or YouTube link
- `/skip` — skip the current song
- `/stop` — stop playback & clear the queue
- `/pause` / `/resume` — pause & resume
- `/queue` — view the queue
- `/volume <percent>` — adjust volume
- `/leave` — remove the bot from the voice channel

## Preparation

### 1. Create a Discord bot application
1. Go to https://discord.com/developers/applications
2. Click **New Application**, name it whatever you like.
3. Go to the **Bot** tab → click **Reset Token** → copy the token (this is `DISCORD_TOKEN`).
4. Still in the **Bot** tab, enable **Message Content Intent** (under Privileged Gateway Intents).
5. Go to the **General Information** tab → copy the **Application ID** (this is `CLIENT_ID`).
6. Go to **OAuth2 → URL Generator**:
   - Scopes: check `bot` and `applications.commands`
   - Bot Permissions: check `Connect`, `Speak`, `Send Messages`, `Embed Links`, `View Channels`
   - Copy the generated URL, open it in a browser, then invite the bot to your server.

### 2. Install dependencies
Make sure Node.js version 18+ is installed, then run in the project folder:

```bash
npm install
```

### 3. Configure environment
Copy `.env.example` to `.env`, then fill it in:

```
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_application_id
```

### 4. Run the bot

```bash
node index.js
```

If successful, you'll see this log:
```
Registering slash commands...
Slash commands registered successfully.
Bot online as BotName#1234
```

## Important notes
- The bot needs **ffmpeg** to process audio. The `ffmpeg-static` package is already included, so you usually don't need to install ffmpeg separately.
- If deploying to hosting (VPS, Railway, etc.), make sure the `DISCORD_TOKEN` and `CLIENT_ID` environment variables are set on that hosting platform, not just in your local `.env` file.
- Slash commands are registered globally — it can take up to ~1 hour to first appear across all servers, but it's usually faster.
- The YouTube library (`@distube/ytdl`) sometimes needs updates to keep up with YouTube changes. If `/play` suddenly fails, try running `npm update`.

## File structure
```
discord-music-bot/
├── index.js         # main bot code
├── package.json
├── .env.example      # example environment variable file
└── README.md
```
