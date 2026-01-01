import { EmbedBuilder } from 'discord.js';
import { getUser, updateUser } from '../economy/database.js';

export default {
  name: 'slot',
  description: 'Slot makinesi oyna',
  async execute(message, args) {
    const user = getUser(message.author.id);
    const bet = parseInt(args[0]);

    if (!bet || bet < 10) {
      return message.reply('❌ En az 10 coin bahis yapmalısın! Kullanım: `!slot [miktar]`');
    }

    if (bet > user.money) {
      return message.reply(`❌ Yeterli paran yok! Bakiye: ${user.money} coin`);
    }

    const symbols = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣'];
    // Animasyon
    const slotMsg = await message.reply('🎰 Slot çevriliyor...');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    await slotMsg.edit('🎰 [ 🎲 | 🎲 | 🎲 ]');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
    await slotMsg.edit(`🎰 [ ${slot1} | 🎲 | 🎲 ]`);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
    await slotMsg.edit(`🎰 [ ${slot1} | ${slot2} | 🎲 ]`);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    const slot3 = symbols[Math.floor(Math.random() * symbols.length)];

    let winAmount = 0;
    let result = '';

    // 3 aynı
    if (slot1 === slot2 && slot2 === slot3) {
      if (slot1 === '💎') {
        winAmount = bet * 10;
        result = '💎 JACKPOT! 10x kazandın!';
      } else if (slot1 === '7️⃣') {
        winAmount = bet * 7;
        result = '🎰 SÜPER! 7x kazandın!';
      } else {
        winAmount = bet * 5;
        result = '🎉 KAZANDIN! 5x kazandın!';
      }
    }
    // 2 aynı
    else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
      winAmount = bet * 2;
      result = '✨ İyi! 2x kazandın!';
    }
    // Kaybettin
    else {
      winAmount = -bet;
      result = '❌ Kaybettin!';
    }

    user.money += winAmount;
    updateUser(message.author.id, user);

    const embed = new EmbedBuilder()
      .setColor(winAmount > 0 ? '#00FF00' : '#FF0000')
      .setTitle('🎰 Slot Makinesi')
      .setDescription(`**[ ${slot1} | ${slot2} | ${slot3} ]**\n\n${result}`)
      .addFields(
        { name: '💰 Bahis', value: `${bet} coin`, inline: true },
        { name: winAmount > 0 ? '✅ Kazanç' : '❌ Kayıp', value: `${Math.abs(winAmount)} coin`, inline: true },
        { name: '💵 Bakiye', value: `${user.money.toLocaleString()} coin`, inline: true }
      )
      .setTimestamp();

    await slotMsg.edit({ content: '', embeds: [embed] });
  }
};
