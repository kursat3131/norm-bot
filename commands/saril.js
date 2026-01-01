import { EmbedBuilder } from 'discord.js';

export default {
  name: 'sarıl',
  description: 'Birine sarıl',
  async execute(message) {
    const target = message.mentions.users.first();
    
    if (!target) {
      return message.reply('❌ Kime sarılmak istiyorsun? `!sarıl @kullanıcı`');
    }

    if (target.id === message.author.id) {
      return message.reply('🤗 Kendine sarıldın! Biraz yalnız hissediyor musun?');
    }

    const gifs = [
      'https://media.giphy.com/media/l2QDM9Jnim1YVILXa/giphy.gif',
      'https://media.giphy.com/media/3bqtLDeiDtwhq/giphy.gif',
      'https://media.giphy.com/media/lrr9rHuoJOE0w/giphy.gif'
    ];

    const embed = new EmbedBuilder()
      .setColor('#FF69B4')
      .setDescription(`🤗 **${message.author.username}** ${target.username} kullanıcısına sarıldı!`)
      .setImage(gifs[Math.floor(Math.random() * gifs.length)])
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
