import { EmbedBuilder } from 'discord.js';
import { getUser, updateUser } from '../economy/database.js';

export default {
  name: 'rulet',
  description: 'Rulet oyna',
  async execute(message, args) {
    const user = getUser(message.author.id);
    const bet = parseInt(args[0]);
    const choice = args[1]?.toLowerCase();

    if (!bet || bet < 10 || !choice) {
      return message.reply('❌ Kullanım: `!rulet [miktar] [kırmızı/siyah/yeşil]`');
    }

    if (!['kırmızı', 'siyah', 'yeşil', 'k', 's', 'y'].includes(choice)) {
      return message.reply('❌ Geçerli renkler: kırmızı, siyah, yeşil');
    }

    if (bet > user.money) {
      return message.reply(`❌ Yeterli paran yok! Bakiye: ${user.money} coin`);
    }

    // Animasyon
    const rouletteMsg = await message.reply('🎡 Rulet dönüyor...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await rouletteMsg.edit('🎡 Dönüyor... 🔴⚫🟢');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await rouletteMsg.edit('🎡 Yavaşlıyor... 🎯');
    await new Promise(resolve => setTimeout(resolve, 800));

    const colors = ['🔴', '⚫', '🟢'];
    const weights = [45, 45, 10]; // %45 kırmızı, %45 siyah, %10 yeşil
    
    const rand = Math.random() * 100;
    let result;
    if (rand < weights[0]) result = '🔴';
    else if (rand < weights[0] + weights[1]) result = '⚫';
    else result = '🟢';

    const colorMap = {
      'kırmızı': '🔴', 'k': '🔴',
      'siyah': '⚫', 's': '⚫',
      'yeşil': '🟢', 'y': '🟢'
    };

    const userChoice = colorMap[choice];
    let winAmount = 0;
    let resultText = '';

    if (result === userChoice) {
      if (result === '🟢') {
        winAmount = bet * 10;
        resultText = '🎉 YEŞİL! 10x KAZANDIN!';
      } else {
        winAmount = bet * 2;
        resultText = '✅ KAZANDIN! 2x kazandın!';
      }
    } else {
      winAmount = -bet;
      resultText = '❌ Kaybettin!';
    }

    user.money += winAmount;
    updateUser(message.author.id, user);

    const embed = new EmbedBuilder()
      .setColor(winAmount > 0 ? '#00FF00' : '#FF0000')
      .setTitle('🎡 Rulet')
      .setDescription(`**Seçimin:** ${userChoice}\n**Sonuç:** ${result}\n\n${resultText}`)
      .addFields(
        { name: '💰 Bahis', value: `${bet} coin`, inline: true },
        { name: winAmount > 0 ? '✅ Kazanç' : '❌ Kayıp', value: `${Math.abs(winAmount)} coin`, inline: true },
        { name: '💵 Bakiye', value: `${user.money.toLocaleString()} coin`, inline: true }
      )
      .setTimestamp();

    await rouletteMsg.edit({ content: '', embeds: [embed] });
  }
};
