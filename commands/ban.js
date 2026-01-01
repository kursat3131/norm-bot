import { PermissionFlagsBits } from 'discord.js';

export default {
  name: 'ban',
  description: 'Kullanıcıyı sunucudan yasaklar',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply('❌ Bu komutu kullanmak için yetkiniz yok!');
    }

    const member = message.mentions.members.first();
    if (!member) {
      return message.reply('❌ Lütfen yasaklanacak kullanıcıyı etiketleyin!');
    }

    if (!member.bannable) {
      return message.reply('❌ Bu kullanıcıyı yasaklayamam!');
    }

    const reason = args.slice(1).join(' ') || 'Sebep belirtilmedi';

    try {
      await member.ban({ reason });
      message.reply(`✅ ${member.user.tag} sunucudan yasaklandı. Sebep: ${reason}`);
    } catch (error) {
      console.error(error);
      message.reply('❌ Kullanıcı yasaklanırken bir hata oluştu!');
    }
  }
};
