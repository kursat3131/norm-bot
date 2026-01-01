import { PermissionFlagsBits } from 'discord.js';

export default {
  name: 'unmute',
  description: 'Kullanıcının susturmasını kaldırır',
  async execute(message) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return message.reply('❌ Bu komutu kullanmak için yetkiniz yok!');
    }

    const member = message.mentions.members.first();
    if (!member) {
      return message.reply('❌ Lütfen susturması kaldırılacak kullanıcıyı etiketleyin!');
    }

    try {
      await member.timeout(null, `${message.author.tag} tarafından susturma kaldırıldı`);
      message.reply(`✅ ${member.user.tag} kullanıcısının susturması kaldırıldı.`);
    } catch (error) {
      console.error(error);
      message.reply('❌ Susturma kaldırılırken bir hata oluştu!');
    }
  }
};
