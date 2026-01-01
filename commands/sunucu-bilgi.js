import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export default {
  name: 'sunucu-bilgi',
  description: 'Sunucu bilgilerini gösterir',
  data: new SlashCommandBuilder()
    .setName('sunucu-bilgi')
    .setDescription('Sunucu bilgilerini gösterir'),
  async execute(messageOrInteraction) {
    // Slash command mı prefix command mı kontrol et
    const isSlash = messageOrInteraction.isCommand?.() || messageOrInteraction.isChatInputCommand?.();
    const guild = messageOrInteraction.guild;

    // DM'de kullanılırsa hata ver
    if (!guild) {
      const errorMsg = { content: '❌ Bu komut sadece sunucularda kullanılabilir!', flags: 64 };
      if (isSlash) {
        return await messageOrInteraction.reply(errorMsg);
      } else {
        return await messageOrInteraction.reply('❌ Bu komut sadece sunucularda kullanılabilir!');
      }
    }

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`📊 ${guild.name} - Sunucu Bilgileri`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: '👑 Sunucu Sahibi', value: `<@${guild.ownerId}>`, inline: true },
        { name: '👥 Üye Sayısı', value: `${guild.memberCount}`, inline: true },
        { name: '📅 Oluşturulma Tarihi', value: guild.createdAt.toLocaleDateString('tr-TR'), inline: true },
        { name: '💬 Kanal Sayısı', value: `${guild.channels.cache.size}`, inline: true },
        { name: '😀 Emoji Sayısı', value: `${guild.emojis.cache.size}`, inline: true },
        { name: '🎭 Rol Sayısı', value: `${guild.roles.cache.size}`, inline: true }
      )
      .setFooter({ text: `Sunucu ID: ${guild.id}` })
      .setTimestamp();

    if (isSlash) {
      await messageOrInteraction.reply({ embeds: [embed] });
    } else {
      await messageOrInteraction.reply({ embeds: [embed] });
    }
  }
};
