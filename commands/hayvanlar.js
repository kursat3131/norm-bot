import { EmbedBuilder } from 'discord.js';
import { getUser } from '../economy/database.js';

export default {
  name: 'hayvanlar',
  description: 'Hayvan koleksiyonunu gösterir',
  async execute(message, args) {
    const targetUser = message.mentions.users.first() || message.author;
    const user = getUser(targetUser.id);

    if (Object.keys(user.animals).length === 0) {
      return message.reply('🦊 Henüz hiç hayvan yakalanmamış! `!avlan` komutuyla başla.');
    }

    const animalList = Object.entries(user.animals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([animal, count]) => `${animal} x${count}`)
      .join('\n');

    const totalAnimals = Object.values(user.animals).reduce((a, b) => a + b, 0);

    const embed = new EmbedBuilder()
      .setColor('#9B59B6')
      .setTitle(`🦊 ${targetUser.username}'in Hayvan Koleksiyonu`)
      .setDescription(animalList || 'Hayvan yok')
      .addFields(
        { name: '📊 Toplam Hayvan', value: `${totalAnimals}`, inline: true },
        { name: '🎯 Farklı Tür', value: `${Object.keys(user.animals).length}`, inline: true }
      )
      .setThumbnail(targetUser.displayAvatarURL())
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
