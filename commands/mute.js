import { PermissionFlagsBits } from 'discord.js';

export default {
  name: 'mute',
  description: 'Kullanıcıyı susturur',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return message.reply('❌ Bu komutu kullanmak için yetkiniz yok!');
    }

    const member = message.mentions.members.first();
    if (!member) {
      return message.reply('❌ Lütfen susturulacak kullanıcıyı etiketleyin!');
    }

    if (!member.moderatable) {
      return message.reply('❌ Bu kullanıcıyı susturamam!');
    }

    // Süre parse et (örn: 10m, 1h, 1d)
    const timeArg = args[1] || '10m';
    const time = parseTime(timeArg);

    try {
      await member.timeout(time, `${message.author.tag} tarafından susturuldu`);
      message.reply(`✅ ${member.user.tag} ${timeArg} süreyle susturuldu.`);
    } catch (error) {
      console.error(error);
      message.reply('❌ Kullanıcı susturulurken bir hata oluştu!');
    }
  }
};

function parseTime(timeStr) {
  const time = parseInt(timeStr);
  const unit = timeStr.slice(-1);
  
  switch(unit) {
    case 's': return time * 1000;
    case 'm': return time * 60 * 1000;
    case 'h': return time * 60 * 60 * 1000;
    case 'd': return time * 24 * 60 * 60 * 1000;
    default: return 10 * 60 * 1000; // varsayılan 10 dakika
  }
}
