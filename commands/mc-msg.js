import { toggleWhisperMode, isWhisperMode } from '../minecraft/bot.js';

export default {
  name: 'mc-msg',
  description: 'Minecraft bot whisper modunu aç/kapat',
  async execute(message) {
    if (!message.member.permissions.has('Administrator')) {
      return message.reply('❌ Bu komutu kullanmak için yönetici olmalısın!');
    }

    const newMode = toggleWhisperMode();
    
    if (newMode) {
      message.reply('✅ **Whisper Modu Aktif!**\nBot artık sadece `/msg` ile özel mesajlaşacak.\nHerkese açık chat kullanmayacak.');
    } else {
      message.reply('❌ **Whisper Modu Kapalı!**\nBot artık normal chat kullanacak.');
    }
  }
};
