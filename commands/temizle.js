import { PermissionFlagsBits } from 'discord.js';

export default {
  name: 'temizle',
  description: 'Belirtilen sayıda mesajı siler',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return message.reply('❌ Bu komutu kullanmak için yetkiniz yok!');
    }

    const amount = parseInt(args[0]);

    if (isNaN(amount) || amount < 1 || amount > 100) {
      return message.reply('❌ Lütfen 1-100 arası bir sayı belirtin!');
    }

    try {
      await message.channel.bulkDelete(amount + 1, true);
      const reply = await message.channel.send(`✅ ${amount} mesaj silindi.`);
      
      setTimeout(() => reply.delete(), 3000);
    } catch (error) {
      console.error(error);
      message.reply('❌ Mesajlar silinirken bir hata oluştu!');
    }
  }
};
