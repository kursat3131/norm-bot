export default {
  name: 'hatırlatıcı',
  description: 'Hatırlatıcı kur',
  async execute(message, args) {
    if (args.length < 2) {
      return message.reply('❌ Kullanım: `!hatırlatıcı [süre(s/m/h)] [mesaj]`\nÖrnek: `!hatırlatıcı 10m Toplantı var`');
    }

    const timeStr = args[0];
    const reminder = args.slice(1).join(' ');

    const time = parseTime(timeStr);
    if (!time) {
      return message.reply('❌ Geçersiz süre! Örnek: 30s, 5m, 1h');
    }

    await message.reply(`⏰ Tamam! ${timeStr} sonra sana hatırlatacağım: "${reminder}"`);

    setTimeout(() => {
      message.author.send(`⏰ **Hatırlatıcı:** ${reminder}`).catch(() => {
        message.channel.send(`⏰ ${message.author} **Hatırlatıcı:** ${reminder}`);
      });
    }, time);
  }
};

function parseTime(timeStr) {
  const time = parseInt(timeStr);
  const unit = timeStr.slice(-1);
  
  switch(unit) {
    case 's': return time * 1000;
    case 'm': return time * 60 * 1000;
    case 'h': return time * 60 * 60 * 1000;
    default: return null;
  }
}
