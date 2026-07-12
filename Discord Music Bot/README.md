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
