/**
 * Norm-Bot GUI — Renderer / App Logic
 * Discord + Minecraft + Economy botu kontrol paneli
 */
const { ipcRenderer } = require('electron');
const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
// MathIcon window üzerinden erişilir
const MathIcons = window.MathIcon;

// ─── PROJECT ROOT ───
const PROJECT_ROOT = path.resolve(__dirname, '..');

// ─── STATE ───
const state = {
  botProcess: null,
  botRunning: false,
  mcConnected: false,
  logs: [],
  discordLogs: [],
  mcLogs: [],
  config: {},
  economyData: {},
  commands: [],
};

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  renderIcons();
  loadConfig();
  loadCommands();
  loadEconomyData();
  setupNavigation();
  setupWindowControls();
  setupEventListeners();
  navigateTo('dashboard');
  addLog('system', 'Norm-Bot Kontrol Paneli başlatıldı');
  updateClock();
  setInterval(updateClock, 1000);
  
  // Dynamic values init
  setTimeout(() => {
    const modelEl = document.getElementById('ai-model-text');
    const cmdCount = document.getElementById('cmd-count-text');
    if (modelEl) modelEl.textContent = state.config.AI_MODEL || '-';
    if (cmdCount) cmdCount.textContent = state.commands.length;
  }, 200);
});

// ─── RENDER MATH ICONS ───
function renderIcons() {
  document.querySelectorAll('[data-icon]').forEach(el => {
    const name = el.getAttribute('data-icon');
    const size = parseInt(el.getAttribute('data-icon-size') || '20');
    const color = el.getAttribute('data-icon-color') || '#e2e8f0';
    el.innerHTML = MathIcons.render(name, size, color);
  });
}

// ─── CONFIG ───
function loadConfig() {
  try {
    const envPath = path.join(PROJECT_ROOT, '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx > 0) {
            const key = trimmed.substring(0, eqIdx).trim();
            const val = trimmed.substring(eqIdx + 1).trim();
            state.config[key] = val;
          }
        }
      });
    }
    updateConfigUI();
  } catch (e) {
    addLog('error', `Config yükleme hatası: ${e.message}`);
  }
}

function saveConfig() {
  try {
    const envPath = path.join(PROJECT_ROOT, '.env');
    let content = '# Discord Bot Yapılandırması\n';
    const fields = ['DISCORD_TOKEN', 'CLIENT_ID', 'PREFIX', 'GROQ_API_KEY', 'AI_MODEL'];
    const labels = {
      'DISCORD_TOKEN': '# Discord Bot Yapılandırması',
      'GROQ_API_KEY': '\n# Groq AI API Yapılandırması'
    };
    
    for (const key of fields) {
      if (labels[key]) content += `${labels[key]}\n`;
      content += `${key}=${state.config[key] || ''}\n`;
    }
    
    fs.writeFileSync(envPath, content);
    addLog('success', 'Ayarlar kaydedildi');
    showToast('Ayarlar başarıyla kaydedildi');
  } catch (e) {
    addLog('error', `Ayar kaydetme hatası: ${e.message}`);
  }
}

function updateConfigUI() {
  const prefixEl = document.getElementById('cfg-prefix');
  const modelEl = document.getElementById('cfg-model');
  const tokenEl = document.getElementById('cfg-token');
  const groqEl = document.getElementById('cfg-groq');
  const clientEl = document.getElementById('cfg-clientid');
  
  if (prefixEl) prefixEl.value = state.config.PREFIX || '!';
  if (modelEl) modelEl.value = state.config.AI_MODEL || 'llama-3.3-70b-versatile';
  if (tokenEl) tokenEl.value = state.config.DISCORD_TOKEN || '';
  if (groqEl) groqEl.value = state.config.GROQ_API_KEY || '';
  if (clientEl) clientEl.value = state.config.CLIENT_ID || '';
}

// ─── COMMANDS LISTING ───
function loadCommands() {
  try {
    const cmdDir = path.join(PROJECT_ROOT, 'commands');
    const files = fs.readdirSync(cmdDir).filter(f => f.endsWith('.js') && f !== 'index.js');
    state.commands = files.map(f => {
      const name = f.replace('.js', '');
      return { name, file: f };
    });
    renderCommandList();
  } catch (e) {
    addLog('error', `Komut yükleme hatası: ${e.message}`);
  }
}

function renderCommandList() {
  const el = document.getElementById('command-list');
  if (!el) return;
  
  el.innerHTML = state.commands.map(cmd => `
    <div class="command-item">
      <div>
        <span class="command-name">${state.config.PREFIX || '!'}${cmd.name}</span>
        <span class="command-desc"> — ${cmd.file}</span>
      </div>
      <button class="btn btn-sm" onclick="openCommandFile('${cmd.file}')">Düzenle</button>
    </div>
  `).join('');
}

function openCommandFile(file) {
  const filePath = path.join(PROJECT_ROOT, 'commands', file);
  exec(`code "${filePath}"`, (err) => {
    if (err) exec(`notepad "${filePath}"`);
  });
}

// ─── ECONOMY DATA ───
function loadEconomyData() {
  try {
    const usersPath = path.join(PROJECT_ROOT, 'economy', 'users.json');
    if (fs.existsSync(usersPath)) {
      state.economyData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
      renderEconomyData();
    }
  } catch (e) {
    addLog('warn', `Ekonomi verisi yüklenemedi: ${e.message}`);
  }
}

function renderEconomyData() {
  const el = document.getElementById('economy-users');
  if (!el) return;
  
  const entries = Object.entries(state.economyData);
  if (entries.length === 0) {
    el.innerHTML = '<p style="color: var(--text-muted)">Henüz kayıtlı kullanıcı yok</p>';
    return;
  }
  
  // Para'ya göre sırala
  entries.sort((a, b) => (b[1].money || 0) - (a[1].money || 0));
  
  el.innerHTML = entries.map(([id, data], i) => {
    const username = data.username || `User_${id.substring(0, 8)}`;
    const animalCount = Object.keys(data.animals || {}).length;
    const animalTotal = Object.values(data.animals || {}).reduce((sum, count) => sum + count, 0);
    
    return `
    <div class="economy-user-card">
      <h4>#${i + 1} — ${escapeHtml(username)}</h4>
      <div class="money">${(data.money || 0).toLocaleString('tr-TR')} coin</div>
      <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">
        Hayvan: ${animalTotal} adet (${animalCount} tür) | Seri: ${data.streak || 0}
      </div>
      <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px; font-family: monospace;">
        ID: ${id.substring(0, 12)}...
      </div>
    </div>
  `}).join('');
}

// ─── BOT CONTROL ───
function startBot() {
  if (state.botProcess) {
    addLog('warn', 'Bot zaten çalışıyor');
    return;
  }
  
  addLog('info', 'Bot başlatılıyor...');
  updateBotStatus(true);
  
  try {
    state.botProcess = spawn('node', ['index.js'], {
      cwd: PROJECT_ROOT,
      shell: true,
      env: { ...process.env, ...state.config }
    });
    
    state.botProcess.stdout.on('data', (data) => {
      const lines = data.toString().split('\n').filter(l => l.trim());
      lines.forEach(line => {
        addLog('info', line.trim());
        addDiscordLog(line.trim());
      });
    });
    
    state.botProcess.stderr.on('data', (data) => {
      const lines = data.toString().split('\n').filter(l => l.trim());
      lines.forEach(line => addLog('error', line.trim()));
    });
    
    state.botProcess.on('close', (code) => {
      state.botProcess = null;
      state.botRunning = false;
      updateBotStatus(false);
      addLog('warn', `Bot durdu (kod: ${code})`);
    });
    
    state.botProcess.on('error', (err) => {
      addLog('error', `Bot başlatma hatası: ${err.message}`);
      state.botProcess = null;
      updateBotStatus(false);
    });
    
  } catch (e) {
    addLog('error', `Bot başlatılamadı: ${e.message}`);
    updateBotStatus(false);
  }
}

function stopBot() {
  if (!state.botProcess) {
    addLog('warn', 'Bot zaten durmuş');
    return;
  }
  
  addLog('info', 'Bot durduruluyor...');
  
  try {
    if (process.platform === 'win32') {
      exec(`taskkill /pid ${state.botProcess.pid} /T /F`);
    } else {
      state.botProcess.kill('SIGTERM');
    }
  } catch (e) {
    // ignore
  }
  
  state.botProcess = null;
  state.botRunning = false;
  updateBotStatus(false);
  addLog('success', 'Bot durduruldu');
}

function restartBot() {
  addLog('info', 'Bot yeniden başlatılıyor...');
  if (state.botProcess) {
    const onClose = state.botProcess;
    onClose.on('close', () => {
      setTimeout(startBot, 500);
    });
    stopBot();
  } else {
    startBot();
  }
}

function updateBotStatus(running) {
  state.botRunning = running;
  
  // Dashboard status
  const statusDot = document.getElementById('bot-status-dot');
  const statusText = document.getElementById('bot-status-text');
  
  if (statusDot) {
    statusDot.className = running ? 'dot dot-green' : 'dot dot-red';
  }
  if (statusText) {
    statusText.textContent = running ? 'Çalışıyor' : 'Durduruldu';
    statusText.style.color = running ? 'var(--accent-green)' : 'var(--accent-red)';
  }
  
  // Discord page badge
  const discordBadge = document.getElementById('discord-badge');
  if (discordBadge) {
    discordBadge.textContent = running ? 'Çevrimiçi' : 'Çevrimdışı';
    discordBadge.className = running ? 'card-badge badge-online' : 'card-badge badge-offline';
  }
  
  // TÜM sayfalardaki start/stop butonlarını güncelle
  document.querySelectorAll('[id="btn-start"]').forEach(btn => {
    btn.disabled = running;
    btn.style.opacity = running ? '0.5' : '1';
    btn.style.cursor = running ? 'not-allowed' : 'pointer';
  });
  
  document.querySelectorAll('[id="btn-stop"]').forEach(btn => {
    btn.disabled = !running;
    btn.style.opacity = !running ? '0.5' : '1';
    btn.style.cursor = !running ? 'not-allowed' : 'pointer';
  });
}

// ─── DEPLOY COMMANDS ───
function deployCommands() {
  addLog('info', 'Slash komutları kaydediliyor...');
  
  const proc = spawn('node', ['deploy-commands.js'], {
    cwd: PROJECT_ROOT,
    shell: true,
    env: { ...process.env, ...state.config }
  });
  
  proc.stdout.on('data', (data) => {
    addLog('success', data.toString().trim());
  });
  
  proc.stderr.on('data', (data) => {
    addLog('error', data.toString().trim());
  });
  
  proc.on('close', (code) => {
    if (code === 0) {
      addLog('success', 'Slash komutları başarıyla kaydedildi');
      showToast('Komutlar kaydedildi');
    } else {
      addLog('error', `Deploy hatası (kod: ${code})`);
    }
  });
}

// ─── LOGGING ───
function addLog(type, message) {
  const now = new Date();
  const time = now.toLocaleTimeString('tr-TR');
  const entry = { type, message, time };
  state.logs.push(entry);
  if (state.logs.length > 500) state.logs.shift();
  
  // Ana terminal (dashboard)
  const terminal = document.getElementById('main-terminal');
  if (terminal) {
    const div = document.createElement('div');
    div.className = 'log-entry';
    div.innerHTML = `<span class="log-time">[${time}]</span><span class="log-${type}">${escapeHtml(message)}</span>`;
    terminal.appendChild(div);
    terminal.scrollTop = terminal.scrollHeight;
  }
  
  // Full log terminal (logs sayfası)
  const fullLog = document.getElementById('full-log-terminal');
  if (fullLog) {
    const div = document.createElement('div');
    div.className = 'log-entry';
    div.innerHTML = `<span class="log-time">[${time}]</span><span class="log-${type}">${escapeHtml(message)}</span>`;
    fullLog.appendChild(div);
    fullLog.scrollTop = fullLog.scrollHeight;
  }
}

function addDiscordLog(message) {
  const el = document.getElementById('discord-log');
  if (!el) return;
  state.discordLogs.push(message);
  if (state.discordLogs.length > 200) state.discordLogs.shift();
  
  const div = document.createElement('div');
  div.className = 'log-entry';
  const time = new Date().toLocaleTimeString('tr-TR');
  div.innerHTML = `<span class="log-time">[${time}]</span><span class="log-info">${escapeHtml(message)}</span>`;
  el.appendChild(div);
  el.scrollTop = el.scrollHeight;
}

function clearLogs() {
  state.logs = [];
  const mainTerminal = document.getElementById('main-terminal');
  const fullLogTerminal = document.getElementById('full-log-terminal');
  if (mainTerminal) mainTerminal.innerHTML = '';
  if (fullLogTerminal) fullLogTerminal.innerHTML = '';
  addLog('system', 'Loglar temizlendi');
}

// ─── NAVIGATION ───
function setupNavigation() {
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.getAttribute('data-page');
      navigateTo(page);
    });
  });
}

function navigateTo(pageId) {
  // Nav items
  document.querySelectorAll('.nav-item[data-page]').forEach(el => {
    el.classList.toggle('active', el.getAttribute('data-page') === pageId);
  });
  
  // Pages
  document.querySelectorAll('.page').forEach(el => {
    el.classList.toggle('active', el.id === `page-${pageId}`);
  });
  
  // Page-specific init
  if (pageId === 'economy') loadEconomyData();
  if (pageId === 'commands') renderCommandList();
  if (pageId === 'discord') {
    // Discord sayfası açıldığında bot durumunu güncelle
    updateBotStatus(state.botRunning);
    // Config bilgilerini güncelle
    document.getElementById('info-prefix').textContent = state.config.PREFIX || '!';
    document.getElementById('info-model').textContent = state.config.AI_MODEL || '-';
    document.getElementById('info-clientid').textContent = state.config.CLIENT_ID || '-';
  }
}

// ─── WINDOW CONTROLS ───
function setupWindowControls() {
  document.getElementById('btn-minimize')?.addEventListener('click', () => ipcRenderer.send('window:minimize'));
  document.getElementById('btn-maximize')?.addEventListener('click', () => ipcRenderer.send('window:maximize'));
  document.getElementById('btn-close')?.addEventListener('click', () => ipcRenderer.send('window:close'));
}

// ─── EVENT LISTENERS ───
function setupEventListeners() {
  // Bot controls - Tüm butonları yakala (event delegation)
  document.addEventListener('click', (e) => {
    const target = e.target.closest('button');
    if (!target) return;
    
    const id = target.id;
    switch(id) {
      case 'btn-start': startBot(); break;
      case 'btn-stop': stopBot(); break;
      case 'btn-restart': restartBot(); break;
      case 'btn-deploy': deployCommands(); break;
      case 'btn-clear-logs': clearLogs(); break;
    }
  });
  
  // Settings save
  document.addEventListener('click', (e) => {
    if (e.target.id === 'btn-save-config') {
      state.config.PREFIX = document.getElementById('cfg-prefix')?.value || '!';
      state.config.AI_MODEL = document.getElementById('cfg-model')?.value || '';
      state.config.DISCORD_TOKEN = document.getElementById('cfg-token')?.value || '';
      state.config.GROQ_API_KEY = document.getElementById('cfg-groq')?.value || '';
      state.config.CLIENT_ID = document.getElementById('cfg-clientid')?.value || '';
      saveConfig();
    }
    if (e.target.id === 'btn-open-folder') {
      exec(`explorer "${PROJECT_ROOT}"`);
    }
    if (e.target.id === 'btn-update-name') {
      updateBotUsername();
    }
    if (e.target.id === 'btn-update-avatar') {
      updateBotAvatar();
    }
    if (e.target.id === 'btn-chat-send') {
      sendChatMessage();
    }
    if (e.target.id === 'btn-mc-send') {
      sendMCMessage();
    }
  });
  
  // Enter key handlers
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (e.target.id === 'chat-input') sendChatMessage();
      if (e.target.id === 'mc-chat-input') sendMCMessage();
    }
  });
  
  // Tabs
  document.addEventListener('click', (e) => {
    const tab = e.target.closest('.tab[data-tab]');
    if (!tab) return;
    
    const tabGroup = tab.closest('.tabs');
    const targetId = tab.getAttribute('data-tab');
    
    tabGroup.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    const parent = tabGroup.parentElement;
    parent.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
    parent.querySelector(`#${targetId}`)?.classList.add('active');
  });
  
  // Search commands
  document.addEventListener('input', (e) => {
    if (e.target.id === 'cmd-search') {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('#command-list .command-item').forEach(item => {
        const name = item.querySelector('.command-name')?.textContent.toLowerCase() || '';
        item.style.display = name.includes(q) ? '' : 'none';
      });
    }
  });

  // Bot avatar file change
  document.addEventListener('change', (e) => {
    if (e.target.id === 'bot-avatar-file') {
      const file = e.target.files[0];
      if (file) {
        document.getElementById('bot-avatar-url').value = file.path;
        document.getElementById('bot-avatar-filename').textContent = file.name;
      }
    }
  });
}

// ─── BOT PROFILE UPDATE (USERNAME & AVATAR) ───
async function updateBotUsername() {
  const newName = document.getElementById('bot-new-name')?.value?.trim();
  if (!newName) {
    showToast('Lütfen bir kullanıcı adı girin');
    return;
  }
  const token = state.config.DISCORD_TOKEN;
  if (!token) {
    showToast('Discord token bulunamadı');
    return;
  }

  addLog('info', `Bot kullanıcı adı güncelleniyor: ${newName}`);
  try {
    const res = await fetch('https://discord.com/api/v10/users/@me', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bot ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: newName })
    });
    const data = await res.json();
    if (res.ok) {
      addLog('success', `Bot ismi başarıyla değiştirildi: ${data.username}`);
      showToast('Bot ismi güncellendi');
    } else {
      const err = data.username ? data.username.join(' ') : (data.message || JSON.stringify(data));
      addLog('error', `İsim değiştirilemedi: ${err}`);
      showToast(`Hata: ${err}`);
    }
  } catch (err) {
    addLog('error', `Discord API bağlantı hatası: ${err.message}`);
    showToast('Bağlantı hatası oluştu');
  }
}

async function updateBotAvatar() {
  const avatarPathOrUrl = document.getElementById('bot-avatar-url')?.value?.trim();
  if (!avatarPathOrUrl) {
    showToast('Lütfen bir resim URL veya dosya seçin');
    return;
  }
  const token = state.config.DISCORD_TOKEN;
  if (!token) {
    showToast('Discord token bulunamadı');
    return;
  }

  addLog('info', 'Bot avatarı hazırlanıyor...');
  try {
    let base64Data = '';
    if (avatarPathOrUrl.startsWith('http://') || avatarPathOrUrl.startsWith('https://')) {
      const resp = await fetch(avatarPathOrUrl);
      const buffer = await resp.arrayBuffer();
      const contentType = resp.headers.get('content-type') || 'image/png';
      base64Data = `data:${contentType};base64,${Buffer.from(buffer).toString('base64')}`;
    } else {
      if (!fs.existsSync(avatarPathOrUrl)) {
        addLog('error', 'Dosya bulunamadı: ' + avatarPathOrUrl);
        showToast('Dosya bulunamadı');
        return;
      }
      const ext = path.extname(avatarPathOrUrl).toLowerCase().replace('.', '') || 'png';
      const mime = ext === 'jpg' ? 'jpeg' : ext;
      const fileBuffer = fs.readFileSync(avatarPathOrUrl);
      base64Data = `data:image/${mime};base64,${fileBuffer.toString('base64')}`;
    }

    const res = await fetch('https://discord.com/api/v10/users/@me', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bot ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ avatar: base64Data })
    });
    const data = await res.json();
    if (res.ok) {
      addLog('success', 'Bot avatarı başarıyla güncellendi!');
      showToast('Avatar güncellendi');
    } else {
      const err = data.avatar ? data.avatar.join(' ') : (data.message || JSON.stringify(data));
      addLog('error', `Avatar güncellenemedi: ${err}`);
      showToast(`Hata: ${err}`);
    }
  } catch (err) {
    addLog('error', `Avatar güncelleme hatası: ${err.message}`);
    showToast('Avatar yüklenirken hata oluştu');
  }
}

// ─── CHAT ───
function sendChatMessage() {
  const input = document.getElementById('chat-input');
  if (!input || !input.value.trim()) return;
  
  const msg = input.value.trim();
  const chatBox = document.getElementById('chat-messages');
  
  if (chatBox) {
    const div = document.createElement('div');
    div.className = 'chat-msg';
    div.innerHTML = `<span class="author user">Sen:</span> ${escapeHtml(msg)}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  
  // Eğer bot çalışıyorsa stdin'e yaz (basit komut gönderme)
  if (state.botProcess && state.botProcess.stdin) {
    state.botProcess.stdin.write(msg + '\n');
  }
  
  input.value = '';
}

function sendMCMessage() {
  const input = document.getElementById('mc-chat-input');
  if (!input || !input.value.trim()) return;
  
  const msg = input.value.trim();
  const chatBox = document.getElementById('mc-chat-messages');
  
  if (chatBox) {
    const div = document.createElement('div');
    div.className = 'chat-msg';
    div.innerHTML = `<span class="author user">Sen:</span> ${escapeHtml(msg)}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  
  // Discord üzerinden Minecraft'a mesaj gönder
  if (state.botProcess && state.botProcess.stdin) {
    state.botProcess.stdin.write(`!mc-mesaj ${msg}\n`);
    addLog('info', `Minecraft'a mesaj: ${msg}`);
  } else {
    showToast('Bot çalışmıyor!');
  }
  
  input.value = '';
}

// ─── UTILITIES ───
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function updateClock() {
  const el = document.getElementById('clock');
  if (el) {
    el.textContent = new Date().toLocaleTimeString('tr-TR');
  }
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.style.display = 'block';
  toast.style.opacity = '1';
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => { toast.style.display = 'none'; }, 300);
  }, 2500);
}

// ─── QUICK ACTIONS ───
function quickAction(action) {
  switch (action) {
    case 'start': startBot(); break;
    case 'stop': stopBot(); break;
    case 'restart': restartBot(); break;
    case 'deploy': deployCommands(); break;
    case 'folder': exec(`explorer "${PROJECT_ROOT}"`); break;
    case 'terminal': exec(`start cmd /k "cd /d ${PROJECT_ROOT}"`); break;
    case 'reload-economy': loadEconomyData(); showToast('Ekonomi verileri yenilendi'); break;
  }
}

// Global erişim
window.startBot = startBot;
window.stopBot = stopBot;
window.restartBot = restartBot;
window.deployCommands = deployCommands;
window.openCommandFile = openCommandFile;
window.quickAction = quickAction;
window.navigateTo = navigateTo;
window.clearLogs = clearLogs;

// Minecraft helper functions
window.refreshMCStatus = function() {
  showToast('Minecraft durumu: Direkt entegrasyon için bot komutlarını kullan');
  addLog('info', 'Minecraft durum kontrolü için !mc-durum komutunu kullanın');
};

window.mcQuickCmd = function(cmd) {
  if (state.botProcess && state.botProcess.stdin) {
    state.botProcess.stdin.write(cmd + '\n');
    addLog('info', `Minecraft komut: ${cmd}`);
    showToast(`Komut gönderildi: ${cmd}`);
  } else {
    showToast('Bot çalışmıyor!');
  }
};

window.connectMC = function() {
  const host = document.getElementById('mc-host')?.value || 'localhost';
  const port = document.getElementById('mc-port')?.value || '25565';
  const username = document.getElementById('mc-username')?.value || 'NormBot';
  
  const log = document.getElementById('mc-connect-log');
  if (log) {
    log.innerHTML = `<div class="log-entry"><span class="log-info">Bağlanılıyor: ${host}:${port} (${username})</span></div>`;
  }
  
  // Discord'dan !mc-bagla komutu gönder
  if (state.botProcess && state.botProcess.stdin) {
    state.botProcess.stdin.write(`!mc-bagla ${host} ${port} ${username}\n`);
    showToast('Minecraft bağlantı komutu gönderildi');
  } else {
    showToast('Bot çalışmıyor - önce botu başlat!');
  }
};

window.sendQuickDiscord = function(cmd) {
  if (state.botProcess && state.botProcess.stdin) {
    state.botProcess.stdin.write(cmd + '\n');
    addLog('info', `Komut gönderildi: ${cmd}`);
    showToast(`Komut: ${cmd}`);
  } else {
    showToast('Bot çalışmıyor!');
  }
};

window.exportLogs = function() {
  try {
    const logContent = state.logs.map(l => `[${l.time}] [${l.type}] ${l.message}`).join('\n');
    const logPath = path.join(PROJECT_ROOT, `gui-logs-${Date.now()}.txt`);
    fs.writeFileSync(logPath, logContent);
    showToast(`Loglar dışa aktarıldı: ${logPath}`);
    addLog('success', `Loglar kaydedildi: ${logPath}`);
  } catch (e) {
    showToast('Log dışa aktarma hatası!');
    addLog('error', `Export hatası: ${e.message}`);
  }
};

window.deployCommands = deployCommands;
window.openCommandFile = openCommandFile;
window.quickAction = quickAction;
window.navigateTo = navigateTo;
window.clearLogs = clearLogs;
