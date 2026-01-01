import { EmbedBuilder } from 'discord.js';

export default {
  name: 'yardım',
  description: 'Tüm komutları gösterir',
  async execute(message) {
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('🤖 Bot Komutları')
      .setDescription('Mevcut tüm komutlar:')
      .addFields(
        { name: '💬 AI & Genel', value: '`!ai` - AI sohbet\n`!yardım` - Yardım menüsü\n`!sunucu-bilgi` - Sunucu bilgileri', inline: false },
        { name: '💰 Ekonomi', value: '`!ekonomi` - Ekonomi komutları\n`!bakiye` - Bakiyeni gör\n`!günlük` - Günlük ödül\n`!avlan` - Hayvan avla\n`!çalış` - Para kazan\n`!dilenci` - Dilencilik yap', inline: false },
        { name: '🎮 Oyunlar', value: '`!zar [adet]` - Zar at\n`!taş-kağıt-makas [seçim]` - TKM oyna\n`!sayı-tahmin` - Sayı tahmin\n`!coinflip [miktar] [y/t]` - Yazı tura\n`!slot [miktar]` - Slot makinesi\n`!rulet [miktar] [renk]` - Rulet', inline: false },
        { name: '🎉 Eğlence', value: '`!şaka` - Rastgele şaka\n`!gif [arama]` - GIF gönder\n`!sarıl @kullanıcı` - Sarıl\n`!öp @kullanıcı` - Öp', inline: false },
        { name: '🛠️ Yönetim', value: '`!çekiliş [süre] [ödül]` - Çekiliş\n`!anket [soru]` - Anket\n`!hatırlatıcı [süre] [mesaj]` - Hatırlatıcı', inline: false },
        { name: '🛡️ Moderasyon', value: '`!mute @kullanıcı [süre]` - Sustur\n`!kick @kullanıcı` - At\n`!ban @kullanıcı` - Yasakla\n`!temizle [sayı]` - Mesaj sil', inline: false },
        { name: '🎨 Sunucu Yönetimi', value: '`!şablon [1/2]` - Sunucu şablonları\n`!ticket kur [#kanal]` - Ticket sistemi\n`!ticket kapat` - Ticket kapat\n`!hoşgeldin ayarla [#kanal]` - Hoş geldin\n`!otorol ayarla @rol` - Otomatik rol', inline: false },
        { name: '🎮 Minecraft', value: '`!mc-bağla [ip] [port] [kullanıcı]` - MC bağlan\n`!mc-durum` - Bot durumu\n`!mc-mesaj [mesaj]` - MC\'a mesaj gönder\n`!mc-msg` - Whisper modu', inline: false }
      )
      .setFooter({ text: '🌐 Web Panel: http://localhost:3000 | Groq AI ile güçlendirilmiştir' })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
