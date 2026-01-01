import { EmbedBuilder } from 'discord.js';

export default {
  name: 'anket',
  description: 'Anket oluştur',
  async execute(message, args) {
    if (!args[0]) {
      return message.reply('❌ Kullanım: `!anket [soru]`');
    }

    const question = args.join(' ');

    const embed = new EmbedBuilder()
      .setColor('#3498DB')
      .setTitle('📊 Anket')
      .setDescription(question)
      .setFooter({ text: `Anket: ${message.author.username} tarafından oluşturuldu` })
      .setTimestamp();

    const poll = await message.channel.send({ embeds: [embed] });
    
    await poll.react('✅');
    await poll.react('❌');
    await poll.react('🤷');

    message.delete().catch(() => {});
  }
};
