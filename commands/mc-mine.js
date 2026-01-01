import { EmbedBuilder } from 'discord.js';
import { getBot } from '../minecraft/bot.js';

export default {
  name: 'mc-mine',
  description: 'Minecraft botuna belirli koordinattaki bloğu kazdır',
  async execute(message, args) {
    const botData = getBot();

    if (!botData || !botData.bot || !botData.abilities) {
      return message.reply('❌ Minecraft botu bağlı değil! Önce `!mc-bağla` komutuyla bağlan.');
    }

    if (args.length < 3) {
      return message.reply('❌ Kullanım: `!mc-mine [x] [y] [z]`\nÖrnek: `!mc-mine 100 64 200`');
    }

    const x = parseFloat(args[0]);
    const y = parseFloat(args[1]);
    const z = parseFloat(args[2]);

    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      return message.reply('❌ Koordinatlar sayı olmalı!');
    }

    const embed = new EmbedBuilder()
      .setColor('#FFA500')
      .setTitle('⛏️ Blok Kazma Başladı')
      .setDescription(`**(${Math.floor(x)}, ${Math.floor(y)}, ${Math.floor(z)})** koordinatındaki blok kazılıyor...`)
      .addFields(
        { name: '📍 Koordinat', value: `X: ${Math.floor(x)}\nY: ${Math.floor(y)}\nZ: ${Math.floor(z)}`, inline: true }
      )
      .setTimestamp();

    await message.reply({ embeds: [embed] });

    try {
      const result = await botData.abilities.mineAtCoordinate(x, y, z);

      const resultEmbed = new EmbedBuilder()
        .setColor(result.success ? '#00FF00' : '#FF0000')
        .setTitle(result.success ? '✅ Kazma Tamamlandı!' : '❌ Kazma Başarısız')
        .setDescription(result.message)
        .setTimestamp();

      await message.reply({ embeds: [resultEmbed] });
    } catch (error) {
      console.error('MC Mine hatası:', error);
      await message.reply(`❌ Hata: ${error.message}`);
    }
  }
};
