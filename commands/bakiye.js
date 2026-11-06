import { EmbedBuilder } from 'discord.js';
import { getUser } from '../economy/database.js';

export default {
  name: 'bakiye',
  description: 'Para bakiyeni gösterir',
  async execute(message) {
    const username = message.author.username;
    const user = getUser(message.author.id, username);
    
    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle(`💰 ${message.author.username}'in Cüzdanı`)
      .addFields(
        { name: '💵 Para', value: `${user.money.toLocaleString()} coin`, inline: true },
        { name: '🔥 Streak', value: `${user.streak} gün`, inline: true },
        { name: '🦊 Hayvanlar', value: `${Object.keys(user.animals).length} tür`, inline: true }
      )
      .setThumbnail(message.author.displayAvatarURL())
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
