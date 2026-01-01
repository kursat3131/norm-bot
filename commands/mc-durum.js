import { EmbedBuilder } from 'discord.js';
import { getBotStatus } from '../minecraft/bot.js';

export default {
  name: 'mc-durum',
  description: 'Minecraft bot durumunu göster',
  async execute(message) {
    const status = getBotStatus();

    const embed = new EmbedBuilder()
      .setTitle('🎮 Minecraft Bot Durumu')
      .setTimestamp();

    if (!status.connected) {
      embed.setColor('#FF0000');
      embed.setDescription('❌ Bot şu an Minecraft sunucusuna bağlı değil!\n`!mc-bağla` ile bağlanabilirsin.');
    } else {
      embed.setColor('#00FF00');
      embed.setDescription('✅ Bot Minecraft sunucusuna bağlı!');
      embed.addFields(
        { name: '👤 Kullanıcı Adı', value: status.username, inline: true },
        { name: '❤️ Can', value: `${status.health}/20`, inline: true },
        { name: '🍖 Açlık', value: `${status.food}/20`, inline: true },
        { name: '👥 Oyuncu Sayısı', value: `${status.players}`, inline: true }
      );

      if (status.position) {
        embed.addFields({
          name: '📍 Konum',
          value: `X: ${Math.floor(status.position.x)}, Y: ${Math.floor(status.position.y)}, Z: ${Math.floor(status.position.z)}`,
          inline: false
        });
      }
    }

    await message.reply({ embeds: [embed] });
  }
};
