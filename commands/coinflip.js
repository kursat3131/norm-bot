import { EmbedBuilder } from 'discord.js';
import { getUser, updateUser } from '../economy/database.js';

export default {
  name: 'coinflip',
  description: 'Yazı tura at',
  async execute(message, args) {
    const user = getUser(message.author.id);
    const bet = parseInt(args[0]);
    const choice = args[1]?.toLowerCase();

    if (!bet || bet < 10 || !choice) {
      return message.reply('❌ Kullanım: `!coinflip [miktar] [yazı/tura]`');
    }

    if (!['yazı', 'tura', 'y', 't'].includes(choice)) {
      return message.reply('❌ Geçerli seçenekler: yazı, tura');
    }

    if (bet > user.money) {
      return message.reply(`❌ Yeterli paran yok! Bakiye: ${user.money} coin`);
    }

    const result = Math.random() > 0.5 ? 'yazı' : 'tura';
    const userChoice = choice === 'y' ? 'yazı' : choice === 't' ? 'tura' : choice;
    const won = result === userChoice;

    const winAmount = won ? bet : -bet;
    user.money += winAmount;
    updateUser(message.author.id, user);

    // Animasyon
    const flipMsg = await message.reply('🪙 Para havada...');
    await new Promise(resolve => setTimeout(resolve, 1500));

    const embed = new EmbedBuilder()
      .setColor(won ? '#00FF00' : '#FF0000')
      .setTitle('🪙 Coinflip')
      .setDescription(`**Seçimin:** ${userChoice}\n**Sonuç:** ${result}\n\n${won ? '✅ KAZANDIN!' : '❌ Kaybettin!'}`)
      .addFields(
        { name: '💰 Bahis', value: `${bet} coin`, inline: true },
        { name: won ? '✅ Kazanç' : '❌ Kayıp', value: `${Math.abs(winAmount)} coin`, inline: true },
        { name: '💵 Bakiye', value: `${user.money.toLocaleString()} coin`, inline: true }
      )
      .setTimestamp();

    await flipMsg.edit({ content: '', embeds: [embed] });
  }
};
