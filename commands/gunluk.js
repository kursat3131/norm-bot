import { EmbedBuilder } from 'discord.js';
import { getUser, updateUser } from '../economy/database.js';

export default {
  name: 'günlük',
  description: 'Günlük ödülünü topla',
  async execute(message) {
    const user = getUser(message.author.id);
    const now = Date.now();
    const oneDay = 86400000;

    if (now - user.daily < oneDay) {
      const timeLeft = oneDay - (now - user.daily);
      const hours = Math.floor(timeLeft / 3600000);
      const minutes = Math.floor((timeLeft % 3600000) / 60000);
      
      return message.reply(`⏰ Günlük ödülünü zaten aldın! ${hours}s ${minutes}d sonra tekrar alabilirsin.`);
    }

    // Streak kontrolü
    const twoDays = oneDay * 2;
    if (now - user.daily < twoDays) {
      user.streak++;
    } else {
      user.streak = 1;
    }

    const baseReward = 100;
    const streakBonus = user.streak * 10;
    const totalReward = baseReward + streakBonus;

    user.money += totalReward;
    user.daily = now;
    updateUser(message.author.id, user);

    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('🎁 Günlük Ödül!')
      .setDescription(`**${totalReward}** coin kazandın!`)
      .addFields(
        { name: '💰 Temel Ödül', value: `${baseReward} coin`, inline: true },
        { name: '🔥 Streak Bonusu', value: `${streakBonus} coin (${user.streak} gün)`, inline: true },
        { name: '💵 Toplam Bakiye', value: `${user.money.toLocaleString()} coin`, inline: false }
      )
      .setFooter({ text: 'Her gün topla ve streak\'ini artır!' })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
