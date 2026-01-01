import { PermissionFlagsBits, ChannelType } from 'discord.js';

export default {
  name: 'kanal-oluştur',
  description: 'Yeni metin kanalı oluşturur',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return message.reply('❌ Bu komutu kullanmak için yetkiniz yok!');
    }

    const channelName = args.join('-') || 'yeni-kanal';

    try {
      const channel = await message.guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        reason: `${message.author.tag} tarafından oluşturuldu`
      });
      
      message.reply(`✅ Kanal oluşturuldu: ${channel}`);
    } catch (error) {
      console.error(error);
      message.reply('❌ Kanal oluşturulurken bir hata oluştu!');
    }
  }
};
