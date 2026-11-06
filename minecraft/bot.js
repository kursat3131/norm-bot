import mineflayer from 'mineflayer';
import pathfinderPlugin from 'mineflayer-pathfinder';
import Groq from 'groq-sdk';
import config from '../config.js';
import minecraftData from 'minecraft-data';
import * as memory from './memory.js';
import { BotAbilities, abilityDescriptions } from './abilities.js';

const { pathfinder, Movements, goals } = pathfinderPlugin;
const groq = new Groq({ apiKey: config.groqApiKey });
let bot = null;
let discordChannel = null;
let abilities = null;
let whisperMode = false; // Whisper modu (sadece /msg kullan)

export function createMinecraftBot(options) {
  if (bot) {
    try {
      bot.quit();
    } catch (e) {
      console.log('Bot zaten kapalı');
    }
  }

  bot = mineflayer.createBot({
    host: options.host || 'localhost',
    port: options.port || 25565,
    username: options.username || 'DiscordBot',
    version: options.version || false, // Belirtilmezse otomatik algılanır
    auth: 'offline',
    hideErrors: false // Hataları göster
  });

  bot.loadPlugin(pathfinder);

  // Hata yönetimi
  bot.on('error', (err) => {
    console.error('❌ Minecraft bot hatası:', err.message);
    if (discordChannel) {
      discordChannel.send(`❌ Minecraft bot hatası: ${err.message}`).catch(console.error);
    }
  });

  bot.on('kicked', (reason) => {
    console.log('❌ Bot sunucudan atıldı:', reason);
    if (discordChannel) {
      discordChannel.send(`❌ Bot sunucudan atıldı: ${reason}`).catch(console.error);
    }
  });

  bot.on('end', (reason) => {
    console.log('❌ Bot bağlantısı kesildi:', reason);
    if (discordChannel) {
      discordChannel.send(`❌ Bot bağlantısı kesildi: ${reason}`).catch(console.error);
    }
  });

  bot.once('spawn', () => {
    console.log('✅ Minecraft botu sunucuya bağlandı!');
    const mcData = minecraftData(bot.version);
    const defaultMove = new Movements(bot, mcData);
    bot.pathfinder.setMovements(defaultMove);
    
    // Yetenekleri başlat
    abilities = new BotAbilities(bot);
    console.log('🧠 Bot yetenekleri yüklendi!');
  });

  bot.on('chat', async (username, message) => {
    if (username === bot.username) return;

    console.log(`[MC Chat] ${username}: ${message}`);

    // Oyuncuyu hatırla
    memory.rememberPlayer(username, {});
    
    // Olayı kaydet
    memory.rememberEvent({
      type: 'chat',
      username,
      message
    });

    // Discord'a mesaj gönder
    if (discordChannel) {
      discordChannel.send(`🎮 **[Minecraft]** ${username}: ${message}`);
    }

    // Whisper modunda sadece özel mesajlara cevap ver
    if (whisperMode) {
      return; // Normal chat'i görmezden gel
    }

    // AI ile cevap ver ve komut çalıştır
    if (message.toLowerCase().includes(bot.username.toLowerCase())) {
      await handleAICommand(username, message, false);
    }
  });

  // Whisper (özel mesaj) dinle
  bot.on('whisper', async (username, message) => {
    console.log(`[MC Whisper] ${username} -> ${message}`);

    // Oyuncuyu hatırla
    memory.rememberPlayer(username, {});
    
    // Olayı kaydet
    memory.rememberEvent({
      type: 'whisper',
      username,
      message
    });

    // Discord'a mesaj gönder
    if (discordChannel) {
      discordChannel.send(`💬 **[Minecraft Whisper]** ${username}: ${message}`);
    }

    // Whisper'a her zaman cevap ver
    await handleAICommand(username, message, true);
  });

  bot.on('error', (err) => {
    console.error('Minecraft bot hatası:', err);
  });

  bot.on('kicked', (reason) => {
    console.log('Bot sunucudan atıldı:', reason);
  });

  bot.on('end', () => {
    console.log('Bot bağlantısı kesildi');
  });

  return bot;
}

// AI komutunu işle ve cevap ver
async function handleAICommand(username, message, isWhisper) {
  const aiResult = await processAICommand(username, message);
  
  if (aiResult.action) {
    // AI bir aksiyon belirledi
    sendMessage(username, aiResult.response, isWhisper);
    
    console.log(`[AI Action] ${aiResult.action} with params:`, aiResult.params);
    
    // Aksiyonu çalıştır
    const result = await executeAction(aiResult.action, aiResult.params);
    console.log(`[AI Result]`, result);
    
    if (result && result.message) {
      sendMessage(username, result.message, isWhisper);
    }
  } else {
    // Sadece sohbet
    sendMessage(username, aiResult.response, isWhisper);
  }
  
  // Sohbeti hatırla
  memory.rememberConversation(username, message, aiResult.response);
}

// Mesaj gönder (whisper veya normal)
function sendMessage(username, message, isWhisper) {
  if (isWhisper || whisperMode) {
    // Özel mesaj gönder
    bot.whisper(username, message);
    console.log(`[Bot -> ${username}] ${message}`);
  } else {
    // Normal chat
    bot.chat(message);
    console.log(`[Bot] ${message}`);
  }
}

// AI komutunu işle ve aksiyonu belirle
async function processAICommand(username, message) {
  try {
    const playerMemory = memory.getPlayerMemory(username);
    const conversationHistory = memory.getConversationHistory(username, 5);
    const memoryStats = memory.getMemoryStats();
    
    let memoryContext = '';
    if (playerMemory) {
      memoryContext += `Bu oyuncuyu ${playerMemory.interactions} kez gördün. `;
    }

    const history = conversationHistory.map(conv => [
      { role: 'user', content: conv.message },
      { role: 'assistant', content: conv.response }
    ]).flat();

    history.push({
      role: 'user',
      content: message
    });

    // Yetenekleri AI'ya tanıt
    const abilitiesText = Object.entries(abilityDescriptions)
      .map(([name, desc]) => `- ${name}: ${desc}`)
      .join('\n');

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Sen bir Minecraft botusun. Oyuncuların komutlarını anlayıp yerine getiriyorsun.

Yeteneklerin:
${abilitiesText}

BARITONE KOMUTLARI (Minecraft konsol komutları):
- "#goto <x> <y> <z>" - Koordinata git
- "#follow <oyuncu>" - Oyuncuyu takip et
- "#stop" - Dur
- "#mine <blok>" - Blok kaz
- "#path" - Yol bul

SEN BU KOMUTLARI KULLANMALISIN! Oyuncu "gel buraya" derse, sen goToPlayer yeteneğini kullan.
Oyuncu "100 50 200 git" derse, sen goToPosition(100, 50, 200) yeteneğini kullan.
Oyuncu "taş kaz" derse, sen mineBlock("stone", 1) yeteneğini kullan.

Oyuncu doğal dille konuştuğunda, uygun yeteneği seç ve çalıştır. MUTLAKA action ve params belirt!

Eğer oyuncu bir komut verirse, JSON formatında yanıt ver:
{
  "action": "yetenek_adı",
  "params": ["parametre1", "parametre2"],
  "response": "Oyuncuya söyleyeceğin kısa mesaj"
}

Eğer sadece sohbet ediyorsa:
{
  "response": "Sohbet cevabın"
}

Örnekler:
- "gel buraya" / "gel" / "come here" -> {"action": "goToPlayer", "params": ["${username}"], "response": "Geliyorum!"}
- "beni takip et" / "follow me" -> {"action": "followPlayer", "params": ["${username}"], "response": "Takip ediyorum!"}
- "dur" / "stop" -> {"action": "stop", "params": [], "response": "Durdum!"}
- "zıpla" / "jump" -> {"action": "jump", "params": [], "response": "Zıplıyorum!"}
- "envanterini göster" -> {"action": "showInventory", "params": [], "response": "Bakıyorum..."}
- "sağlığın nasıl" -> {"action": "getHealth", "params": [], "response": "Kontrol ediyorum..."}
- "taş kır" -> {"action": "breakBlock", "params": ["stone"], "response": "Kırıyorum!"}
- "100 50 200 git" / "x:100 y:50 z:200" -> {"action": "goToPosition", "params": ["100", "50", "200"], "response": "Gidiyorum!"}
- "nasılsın?" -> {"response": "İyiyim, sen nasılsın?"}

Koordinat komutlarını algıla: "100 50 200", "x:100 y:50 z:200", "git 100 50 200" gibi.

Hafızan: ${memoryStats.players} oyuncu, ${memoryStats.locations} konum biliyorsun.
${memoryContext}

SADECE JSON yanıt ver, başka açıklama ekleme!`
        },
        ...history
      ],
      model: config.aiModel,
      temperature: 0.7,
      max_tokens: 600,
      response_format: { type: 'json_object' }
    });

    const choice = completion.choices[0];
    const aiResponse = choice?.message?.content?.trim();

    if (!aiResponse) {
      console.warn(`[AI] Boş yanıt | finish: ${choice?.finish_reason}`);
      return { response: 'Anlamadım!' };
    }

    // JSON parse et (kod bloğu işaretlerini temizle)
    const cleaned = aiResponse.replace(/```(?:json)?/gi, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn(`[AI] JSON bulunamadı | finish: ${choice?.finish_reason} | ${aiResponse.slice(0, 200)}`);
      return { response: aiResponse.slice(0, 200) };
    }

    try {
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.warn(`[AI] JSON parse hatası | ${aiResponse.slice(0, 200)}`);
      return { response: cleaned.slice(0, 200) };
    }

  } catch (error) {
    console.error('AI hatası:', error);
    return { response: 'Şu an konuşamıyorum!' };
  }
}

// Aksiyonu çalıştır
async function executeAction(action, params = []) {
  if (!abilities) {
    return { success: false, message: 'Yetenekler henüz yüklenmedi!' };
  }

  if (typeof abilities[action] !== 'function') {
    return { success: false, message: 'Bu yeteneği bilmiyorum!' };
  }

  try {
    const result = await abilities[action](...params);
    return result;
  } catch (error) {
    console.error('Aksiyon hatası:', error);
    return { success: false, message: 'Bir hata oluştu!' };
  }
}

async function getAIResponse(username, message) {
  try {
    // Oyuncu hafızasını al
    const playerMemory = memory.getPlayerMemory(username);
    const conversationHistory = memory.getConversationHistory(username, 5);
    const memoryStats = memory.getMemoryStats();
    
    // Hafıza bağlamı oluştur
    let memoryContext = '';
    if (playerMemory) {
      memoryContext += `Bu oyuncuyu ${playerMemory.interactions} kez gördün. `;
      if (playerMemory.notes && playerMemory.notes.length > 0) {
        memoryContext += `Notlar: ${playerMemory.notes.join(', ')}. `;
      }
    }
    
    if (conversationHistory.length > 0) {
      memoryContext += `Önceki sohbetler: `;
      conversationHistory.forEach(conv => {
        memoryContext += `[${conv.message} -> ${conv.response}] `;
      });
    }

    const history = conversationHistory.map(conv => [
      { role: 'user', content: conv.message },
      { role: 'assistant', content: conv.response }
    ]).flat();

    history.push({
      role: 'user',
      content: message
    });

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Sen bir Minecraft botusun. Kısa ve eğlenceli cevaplar ver. Türkçe konuş. Minecraft hakkında bilgilisin.
          
Hafızan: ${memoryStats.players} oyuncu, ${memoryStats.locations} konum, ${memoryStats.events} olay biliyorsun.
${memoryContext}

Oyuncularla arkadaş ol, onları hatırla ve kişisel cevaplar ver.`
        },
        ...history
      ],
      model: config.aiModel,
      temperature: 0.8,
      max_tokens: 100
    });

    const response = completion.choices[0]?.message?.content || 'Anlamadım!';

    return response.substring(0, 100); // Minecraft chat limiti
  } catch (error) {
    console.error('AI hatası:', error);
    return 'Şu an konuşamıyorum!';
  }
}

export function setDiscordChannel(channel) {
  discordChannel = channel;
}

export function sendMinecraftMessage(message, username = null) {
  if (bot && bot.player) {
    if (username && whisperMode) {
      // Whisper modunda özel mesaj gönder
      bot.whisper(username, message);
    } else {
      // Normal chat
      bot.chat(message);
    }
    return true;
  }
  return false;
}

export function getMinecraftBot() {
  return bot;
}

export function getBot() {
  return { bot, abilities };
}

export function getBotStatus() {
  if (!bot) return { connected: false };
  
  const memoryStats = memory.getMemoryStats();
  
  return {
    connected: !!bot.player,
    username: bot.username,
    health: bot.health,
    food: bot.food,
    position: bot.entity?.position,
    players: bot.players ? Object.keys(bot.players).length : 0,
    memory: memoryStats
  };
}

export function getBotMemory() {
  return memory;
}

export function toggleWhisperMode() {
  whisperMode = !whisperMode;
  console.log(`[Whisper Mode] ${whisperMode ? 'Aktif' : 'Kapalı'}`);
  return whisperMode;
}

export function isWhisperMode() {
  return whisperMode;
}
