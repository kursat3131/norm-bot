import { EmbedBuilder } from 'discord.js';

export default {
  name: 'zar',
  description: 'Zar at',
  async execute(message, args) {
    const count = parseInt(args[0]) || 1;
    
    if (count < 1 || count > 10) {
      return message.reply('❌ 1-10 arası zar atabilirsin!');
    }

    const results = [];
    let total = 0;

    for (let i = 0; i < count; i++) {
      const roll = Math.floor(Math.random() * 6) + 1;
      results.push(roll);
      total += roll;
    }

    const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    const diceDisplay = results.map(r => diceEmojis[r - 1]).join(' ');

    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('🎲 Zar Atıldı!')
      .setDescription(`${diceDisplay}\n\n**Toplam:** ${total}`)
      .setFooter({ text: `${count} zar atıldı` })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
