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
