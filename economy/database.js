import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'users.json');

// Veritabanını yükle
function loadDB() {
  try {
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch (error) {
    return {};
  }
}

// Veritabanını kaydet
function saveDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Kullanıcı verisi al
export function getUser(userId) {
  const db = loadDB();
  if (!db[userId]) {
    db[userId] = {
      money: 0,
      animals: {},
      inventory: {},
      daily: 0,
      streak: 0,
      lastHunt: 0,
      lastBattle: 0
    };
    saveDB(db);
  }
  return db[userId];
}

// Kullanıcı verisini güncelle
export function updateUser(userId, data) {
  const db = loadDB();
  db[userId] = { ...db[userId], ...data };
  saveDB(db);
  return db[userId];
}

// Para ekle/çıkar
export function addMoney(userId, amount) {
  const user = getUser(userId);
  user.money += amount;
  updateUser(userId, user);
  return user.money;
}

// Hayvan ekle
export function addAnimal(userId, animal) {
  const user = getUser(userId);
  if (!user.animals[animal]) {
    user.animals[animal] = 0;
  }
  user.animals[animal]++;
  updateUser(userId, user);
}

// Tüm kullanıcıları al (leaderboard için)
export function getAllUsers() {
  return loadDB();
}
