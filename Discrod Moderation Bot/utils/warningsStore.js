const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'warnings.json');

function ensureFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
  }
}

function readAll() {
  ensureFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeAll(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function addWarning(guildId, userId, reason, moderatorTag) {
  const data = readAll();
  if (!data[guildId]) data[guildId] = {};
  if (!data[guildId][userId]) data[guildId][userId] = [];

  const entry = {
    reason,
    moderator: moderatorTag,
    timestamp: new Date().toISOString(),
  };

  data[guildId][userId].push(entry);
  writeAll(data);
  return data[guildId][userId].length;
}

function getWarnings(guildId, userId) {
  const data = readAll();
  return data?.[guildId]?.[userId] || [];
}

function clearWarnings(guildId, userId) {
  const data = readAll();
  if (data?.[guildId]?.[userId]) {
    delete data[guildId][userId];
    writeAll(data);
    return true;
  }
  return false;
}

module.exports = { addWarning, getWarnings, clearWarnings };
