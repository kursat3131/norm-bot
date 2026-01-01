import { EmbedBuilder } from 'discord.js';
import { getAllUsers } from '../economy/database.js';

export default {
  name: 'lider',
  description: 'En zengin kullanıcıları gösterir',
  async execute(message) {
    const allUsers = getAllUsers();
    
    const sorted = Object.entries(allUsers)
      .sort((a, b) => b[1].money - a[1].money)
      .slice(0, 10);

    if (sorted.length === 0) {
      return message.reply('❌ Henüz hiç kullanıcı yok!');
    }

    let description = '';
    for (let i = 0; i < sorted.length; i++) {
      const [userId, userData] = sorted[i];
      try {
        const user = await message.client.users.fetch(userId);
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
        description += `${medal} **${user.username}** - ${userData.money.toLocaleString()} coin\n`;
      } catch (error) {
        // Kullanıcı bulunamazsa atla
      }
    }

    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('🏆 En Zengin Kullanıcılar')
      .setDescription(description)
      .setFooter({ text: 'Para kazan ve lider tablosuna gir!' })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
