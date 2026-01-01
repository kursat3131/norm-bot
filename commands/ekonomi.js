import { EmbedBuilder } from 'discord.js';

export default {
  name: 'ekonomi',
  description: 'Ekonomi komutlarını gösterir',
  async execute(message) {
    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('💰 Ekonomi Sistemi')
      .setDescription('Para kazan, hayvan topla ve zengin ol!')
      .addFields(
        { name: '💵 Para Komutları', value: '`!bakiye` - Bakiyeni gör\n`!günlük` - Günlük ödül\n`!dilenci` - Dilencilik yap\n`!çalış` - Çalışarak kazan\n`!lider` - Lider tablosu', inline: false },
        { name: '🦊 Hayvan Komutları', value: '`!avlan` - Hayvan avla\n`!hayvanlar` - Koleksiyonunu gör\n`!sat [hayvan] [miktar]` - Hayvan sat\n`!sat hepsi` - Tümünü sat', inline: false },
        { name: '🎮 Kumar Komutları', value: '`!slot [miktar]` - Slot oyna\n`!rulet [miktar] [renk]` - Rulet\n`!coinflip [miktar] [yazı/tura]` - Yazı tura', inline: false },
        { name: '🏪 Alışveriş', value: '`!mağaza` - Eşya satın al\n`!envanter` - Eşyalarını gör\n`!balık-tut` - Balık tut (olta gerekli)', inline: false },
        { name: '💰 Diğer', value: '`!soygun @kullanıcı` - Kullanıcı soy', inline: false }
      )
      .setFooter({ text: 'Eğlen ve kazan!' })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
