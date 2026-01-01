import { EmbedBuilder } from 'discord.js';

export default {
  name: 'öp',
  description: 'Birine öp',
  async execute(message) {
    const target = message.mentions.users.first();
    
    if (!target) {
      return message.reply('❌ Kimi öpmek istiyorsun? `!öp @kullanıcı`');
    }

    if (target.id === message.author.id) {
      return message.reply('😘 Kendini öptün! Aynaya mı baktın?');
    }

    const gifs = [
      'https://media.giphy.com/media/G3va31oEEnIkM/giphy.gif',
      'https://media.giphy.com/media/bGm9FuBCGg4SY/giphy.gif',
      'https://media.giphy.com/media/FqBTvSNmc1mNG/giphy.gif'
    ];

    const embed = new EmbedBuilder()
      .setColor('#FF1493')
      .setDescription(`😘 **${message.author.username}** ${target.username} kullanıcısını öptü!`)
      .setImage(gifs[Math.floor(Math.random() * gifs.length)])
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
