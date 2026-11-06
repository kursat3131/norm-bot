import { EmbedBuilder } from 'discord.js';
import { getUser, updateUser } from '../economy/database.js';

const fish = [
  { name: '🐟 Küçük Balık', value: 20, chance: 50 },
  { name: '🐠 Renkli Balık', value: 50, chance: 30 },
  { name: '🐡 Balon Balığı', value: 80, chance: 15 },
  { name: '🦈 Köpekbalığı', value: 200, chance: 4 },
  { name: '🐋 Balina', value: 500, chance: 1 }
];

export default {
  name: 'balık-tut',
  description: 'Balık tut ve sat',
  async execute(message) {
    const username = message.author.username; const user = getUser(message.author.id, username);

    if (!user.inventory || !user.inventory['🎣']) {
      return message.reply('❌ Balık tutmak için olta gerekli! `!mağaza` dan satın alabilirsin.');
    }

    const now = Date.now();
    const cooldown = 30000; // 30 saniye

    if (now - (user.lastFish || 0) < cooldown) {
      const timeLeft = Math.ceil((cooldown - (now - (user.lastFish || 0))) / 1000);
      return message.reply(`⏰ Oltanı hazırla! ${timeLeft} saniye sonra tekrar balık tutabilirsin.`);
    }

    // Rastgele balık seç
    const rand = Math.random() * 100;
    let cumulativeChance = 0;
    let caughtFish = fish[0];

    for (const f of fish) {
      cumulativeChance += f.chance;
      if (rand <= cumulativeChance) {
        caughtFish = f;
        break;
      }
    }

    user.money += caughtFish.value;
    user.lastFish = now;
    updateUser(message.author.id, user);

    const embed = new EmbedBuilder()
      .setColor('#00CED1')
      .setTitle('🎣 Balık Tutma')
      .setDescription(`${caughtFish.name} yakaladın ve sattın!`)
      .addFields(
        { name: '💰 Kazanç', value: `${caughtFish.value} coin`, inline: true },
        { name: '💵 Toplam', value: `${user.money.toLocaleString()} coin`, inline: true }
      )
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
