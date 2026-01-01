import { EmbedBuilder } from 'discord.js';

export default {
  name: 'gif',
  description: 'Rastgele GIF gönder',
  async execute(message, args) {
    const query = args.join(' ') || 'funny';

    try {
      const response = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=YOUR_GIPHY_API_KEY&tag=${encodeURIComponent(query)}&rating=pg-13`);
      
      // API key yoksa basit GIF linkleri kullan
      const gifs = [
        'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
        'https://media.giphy.com/media/l0HlRnAWXxn0MhKLK/giphy.gif',
        'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif',
        'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif'
      ];

      const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

      const embed = new EmbedBuilder()
        .setColor('#9B59B6')
        .setTitle(`🎬 GIF: ${query}`)
        .setImage(randomGif)
        .setFooter({ text: 'Powered by Giphy' })
        .setTimestamp();

      await message.reply({ embeds: [embed] });
    } catch (error) {
      message.reply('❌ GIF bulunamadı!');
    }
  }
};
