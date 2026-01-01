import { EmbedBuilder } from 'discord.js';
import { getBot } from '../minecraft/bot.js';

export default {
  name: 'mc-collect',
  description: 'Minecraft botuna blok toplat, başa döndür ve at',
  async execute(message, args) {
    const botData = getBot();

    if (!botData || !botData.bot || !botData.abilities) {
      return message.reply('❌ Minecraft botu bağlı değil! Önce `!mc-bağla` komutuyla bağlan.');
    }

    if (args.length < 2) {
      return message.reply('❌ Kullanım: `!mc-collect [blok_ismi] [sayı]`\nÖrnek: `!mc-collect stone 10`');
    }

    const blockName = args[0];
    const count = parseInt(args[1]) || 10;

    if (count < 1 || count > 64) {
      return message.reply('❌ Sayı 1-64 arasında olmalı!');
    }

    const embed = new EmbedBuilder()
      .setColor('#FFA500')
      .setTitle('⛏️ Blok Toplama Başladı')
      .setDescription(`**${blockName}** bloğundan **${count}** adet toplanıyor...`)
      .addFields(
        { name: '📍 İşlem', value: '1. Blokları topla\n2. Başlangıç noktasına dön\n3. Eşyaları at', inline: false }
      )
      .setTimestamp();

    await message.reply({ embeds: [embed] });

    try {
      const result = await botData.abilities.collectAndReturn(blockName, count);

      const resultEmbed = new EmbedBuilder()
        .setColor(result.success ? '#00FF00' : '#FF0000')
        .setTitle(result.success ? '✅ Toplama Tamamlandı!' : '❌ Toplama Başarısız')
        .setDescription(result.message)
        .setTimestamp();

      await message.reply({ embeds: [resultEmbed] });
    } catch (error) {
      console.error('MC Collect hatası:', error);
      await message.reply(`❌ Hata: ${error.message}`);
    }
  }
};
