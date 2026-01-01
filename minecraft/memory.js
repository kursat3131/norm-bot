import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const memoryPath = path.join(__dirname, 'memory.json');

// Hafıza yapısı
let memory = {
  players: {}, // Oyuncu bilgileri
  locations: {}, // Önemli konumlar
  items: {}, // Envanter geçmişi
  events: [], // Olaylar
  conversations: {}, // Sohbet geçmişi
  tasks: [], // Görevler
  knowledge: {} // Öğrenilen bilgiler
};

// Hafızayı yükle
export function loadMemory() {
  try {
    if (fs.existsSync(memoryPath)) {
      const data = fs.readFileSync(memoryPath, 'utf8');
      memory = JSON.parse(data);
      console.log('✅ Minecraft bot hafızası yüklendi');
    }
  } catch (error) {
    console.error('Hafıza yükleme hatası:', error);
  }
  return memory;
}

// Hafızayı kaydet
export function saveMemory() {
  try {
    fs.writeFileSync(memoryPath, JSON.stringify(memory, null, 2));
  } catch (error) {
    console.error('Hafıza kaydetme hatası:', error);
  }
}

// Oyuncu bilgisi ekle/güncelle
export function rememberPlayer(username, info) {
  if (!memory.players[username]) {
    memory.players[username] = {
      firstSeen: Date.now(),
      lastSeen: Date.now(),
      interactions: 0,
      friendship: 0,
      notes: []
    };
  }
  
  memory.players[username] = {
    ...memory.players[username],
    ...info,
    lastSeen: Date.now(),
    interactions: (memory.players[username].interactions || 0) + 1
  };
  
  saveMemory();
}

// Oyuncu bilgisi al
export function getPlayerMemory(username) {
  return memory.players[username] || null;
}

// Konum kaydet
export function rememberLocation(name, position, description) {
  memory.locations[name] = {
    position,
    description,
    savedAt: Date.now()
  };
  saveMemory();
}

// Konum al
export function getLocation(name) {
  return memory.locations[name] || null;
}

// Tüm konumları al
export function getAllLocations() {
  return memory.locations;
}

// Olay kaydet
export function rememberEvent(event) {
  memory.events.push({
    ...event,
    timestamp: Date.now()
  });
  
  // Son 100 olayı tut
  if (memory.events.length > 100) {
    memory.events = memory.events.slice(-100);
  }
  
  saveMemory();
}

// Son olayları al
export function getRecentEvents(count = 10) {
  return memory.events.slice(-count);
}

// Sohbet geçmişi ekle
export function rememberConversation(username, message, response) {
  if (!memory.conversations[username]) {
    memory.conversations[username] = [];
  }
  
  memory.conversations[username].push({
    message,
    response,
    timestamp: Date.now()
  });
  
  // Son 50 mesajı tut
  if (memory.conversations[username].length > 50) {
    memory.conversations[username] = memory.conversations[username].slice(-50);
  }
  
  saveMemory();
}

// Sohbet geçmişi al
export function getConversationHistory(username, count = 10) {
  if (!memory.conversations[username]) return [];
  return memory.conversations[username].slice(-count);
}

// Görev ekle
export function addTask(task) {
  memory.tasks.push({
    ...task,
    id: Date.now(),
    status: 'pending',
    createdAt: Date.now()
  });
  saveMemory();
  return memory.tasks[memory.tasks.length - 1];
}

// Görev tamamla
export function completeTask(taskId) {
  const task = memory.tasks.find(t => t.id === taskId);
  if (task) {
    task.status = 'completed';
    task.completedAt = Date.now();
    saveMemory();
  }
}

// Aktif görevleri al
export function getActiveTasks() {
  return memory.tasks.filter(t => t.status === 'pending');
}

// Bilgi öğren
export function learnKnowledge(key, value) {
  memory.knowledge[key] = {
    value,
    learnedAt: Date.now()
  };
  saveMemory();
}

// Bilgi al
export function getKnowledge(key) {
  return memory.knowledge[key]?.value || null;
}

// Hafızayı temizle
export function clearMemory() {
  memory = {
    players: {},
    locations: {},
    items: {},
    events: [],
    conversations: {},
    tasks: [],
    knowledge: {}
  };
  saveMemory();
}

// Hafıza istatistikleri
export function getMemoryStats() {
  return {
    players: Object.keys(memory.players).length,
    locations: Object.keys(memory.locations).length,
    events: memory.events.length,
    conversations: Object.keys(memory.conversations).length,
    tasks: memory.tasks.length,
    activeTasks: getActiveTasks().length,
    knowledge: Object.keys(memory.knowledge).length
  };
}

// Başlangıçta hafızayı yükle
loadMemory();
