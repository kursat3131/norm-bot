import { EmbedBuilder } from 'discord.js';
import { createMinecraftBot, setDiscordChannel } from '../minecraft/bot.js';

export default {
  name: 'mc-bağla',
  description: 'Minecraft sunucusuna bağlan',
  async execute(message, args) {
    if (!message.member.permissions.has('Administrator')) {
      return message.reply('❌ Bu komutu kullanmak için yönetici olmalısın!');
    }

    if (!args[0]) {
      return message.reply('❌ Kullanım: `!mc-bağla [sunucu-ip] [port] [kullanıcı-adı] [versiyon]`\nÖrnek: `!mc-bağla localhost 25565 DiscordBot 1.20.4`\n\n**Not:** Versiyon belirtmezsen otomatik algılanır.');
    }

    const host = args[0];
    const port = parseInt(args[1]) || 25565;
    const username = args[2] || 'DiscordBot';
    const version = args[3] || false; // Opsiyonel versiyon

    try {
      const loadingMsg = await message.reply('🔄 Minecraft sunucusuna bağlanılıyor...');

      createMinecraftBot({ host, port, username, version });
      setDiscordChannel(message.channel);

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('✅ Minecraft Botu Bağlandı!')
        .addFields(
          { name: '🌐 Sunucu', value: `${host}:${port}`, inline: true },
          { name: '👤 Kullanıcı', value: username, inline: true },
          { name: '📢 Kanal', value: message.channel.name, inline: true }
        )
        .setDescription('Minecraft mesajları bu kanala gelecek!')
        .setTimestamp();

      await loadingMsg.edit({ content: '', embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.reply('❌ Bağlantı hatası! Sunucu bilgilerini kontrol et.');
    }
  }
};
