import { EmbedBuilder } from 'discord.js';
import { getUser } from '../economy/database.js';

export default {
  name: 'envanter',
  description: 'Envanterini gösterir',
  async execute(message) {
    const user = getUser(message.author.id);

    if (!user.inventory || Object.keys(user.inventory).length === 0) {
      return message.reply('📦 Envanterinde hiç eşya yok! `!mağaza` ile eşya satın alabilirsin.');
    }

    let itemList = '';
    for (const [emoji, name] of Object.entries(user.inventory)) {
      itemList += `${emoji} **${name}**\n`;
    }

    const embed = new EmbedBuilder()
      .setColor('#9B59B6')
      .setTitle(`📦 ${message.author.username}'in Envanteri`)
      .setDescription(itemList)
      .addFields(
        { name: '📊 Toplam Eşya', value: `${Object.keys(user.inventory).length}`, inline: true }
      )
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
