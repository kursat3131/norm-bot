import { PermissionFlagsBits } from 'discord.js';

export default {
  name: 'kick',
  description: 'Kullanıcıyı sunucudan atar',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return message.reply('❌ Bu komutu kullanmak için yetkiniz yok!');
    }

    const member = message.mentions.members.first();
    if (!member) {
      return message.reply('❌ Lütfen atılacak kullanıcıyı etiketleyin!');
    }

    if (!member.kickable) {
      return message.reply('❌ Bu kullanıcıyı atamam!');
    }

    const reason = args.slice(1).join(' ') || 'Sebep belirtilmedi';

    try {
      await member.kick(reason);
      message.reply(`✅ ${member.user.tag} sunucudan atıldı. Sebep: ${reason}`);
    } catch (error) {
      console.error(error);
      message.reply('❌ Kullanıcı atılırken bir hata oluştu!');
    }
  }
};
