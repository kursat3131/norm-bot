import { EmbedBuilder } from 'discord.js';

export default {
  name: 'çekiliş',
  description: 'Çekiliş başlat',
  async execute(message, args) {
    if (!message.member.permissions.has('ManageMessages')) {
      return message.reply('❌ Bu komutu kullanmak için yetkiniz yok!');
    }

    if (args.length < 2) {
      return message.reply('❌ Kullanım: `!çekiliş [süre(s/m/h)] [ödül]`\nÖrnek: `!çekiliş 1m Nitro`');
    }

    const timeStr = args[0];
    const prize = args.slice(1).join(' ');

    const time = parseTime(timeStr);
    if (!time) {
      return message.reply('❌ Geçersiz süre! Örnek: 30s, 5m, 1h');
    }

    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('🎉 ÇEKİLİŞ!')
      .setDescription(`**Ödül:** ${prize}\n**Süre:** ${timeStr}\n\n🎁 Katılmak için 🎉 emojisine tıkla!`)
      .setFooter({ text: `${message.author.username} tarafından başlatıldı` })
      .setTimestamp(Date.now() + time);

    const giveaway = await message.channel.send({ embeds: [embed] });
    await giveaway.react('🎉');

    setTimeout(async () => {
      try {
        const fetchedMsg = await message.channel.messages.fetch(giveaway.id);
        const reaction = fetchedMsg.reactions.cache.get('🎉');
        
        if (!reaction || reaction.count <= 1) {
          return message.channel.send('❌ Çekilişe kimse katılmadı!');
        }

        const users = await reaction.users.fetch();
        const participants = users.filter(u => !u.bot);

        if (participants.size === 0) {
          return message.channel.send('❌ Çekilişe kimse katılmadı!');
        }

        const winner = participants.random();

        const winEmbed = new EmbedBuilder()
          .setColor('#00FF00')
          .setTitle('🎊 Çekiliş Bitti!')
          .setDescription(`**Kazanan:** ${winner}\n**Ödül:** ${prize}`)
          .setTimestamp();

        message.channel.send({ content: `🎉 Tebrikler ${winner}!`, embeds: [winEmbed] });
      } catch (error) {
        console.error(error);
      }
    }, time);

    message.delete().catch(() => {});
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
