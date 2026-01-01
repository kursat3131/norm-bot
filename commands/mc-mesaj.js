import { sendMinecraftMessage } from '../minecraft/bot.js';

export default {
  name: 'mc-mesaj',
  description: 'Minecraft sunucusuna mesaj gönder',
  async execute(message, args) {
    if (!args[0]) {
      return message.reply('❌ Kullanım: `!mc-mesaj [mesaj]`');
    }

    const msg = args.join(' ');
    
    // Küfür filtresi
    const badWords = ['küfür1', 'küfür2']; // Buraya ekle
    const hasBadWord = badWords.some(word => msg.toLowerCase().includes(word));
    
    if (hasBadWord) {
      return message.reply('❌ Mesajında uygunsuz kelimeler var!');
    }

    const success = sendMinecraftMessage(`[${message.author.username}] ${msg}`);
    
    if (success) {
      message.react('✅');
    } else {
      message.reply('❌ Bot Minecraft sunucusuna bağlı değil! `!mc-bağla` ile bağlan.');
    }
  }
};
