import { getUser, addMoney } from '../economy/database.js';

export default {
  name: 'dilenci',
  description: 'Dilencilik yaparak para kazan',
  async execute(message) {
    const user = getUser(message.author.id);
    const now = Date.now();
    const cooldown = 60000; // 1 dakika

    if (now - (user.lastBeg || 0) < cooldown) {
      const timeLeft = Math.ceil((cooldown - (now - (user.lastBeg || 0))) / 1000);
      return message.reply(`⏰ ${timeLeft} saniye sonra tekrar dilencilik yapabilirsin!`);
    }

    const amount = Math.floor(Math.random() * 50) + 10; // 10-60 coin
    addMoney(message.author.id, amount);
    user.lastBeg = now;

    const messages = [
      `🥺 Bir yabancı sana **${amount}** coin verdi!`,
      `💰 Sokakta **${amount}** coin buldun!`,
      `🎁 Biri sana **${amount}** coin bağışladı!`,
      `✨ Şanslı günün! **${amount}** coin kazandın!`,
      `🍀 Yerde **${amount}** coin gördün ve aldın!`
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    await message.reply(randomMessage);
  }
};
