# Language
## [Indonesian](#Indonesian) | [English](#English)
----
Indonesian
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
