import { EmbedBuilder } from 'discord.js';

export default {
  name: 'taş-kağıt-makas',
  description: 'Bot ile taş kağıt makas oyna',
  async execute(message, args) {
    const choices = ['taş', 'kağıt', 'makas'];
    const emojis = { 'taş': '🪨', 'kağıt': '📄', 'makas': '✂️' };
    
    const userChoice = args[0]?.toLowerCase();
    
    if (!userChoice || !choices.includes(userChoice)) {
      return message.reply('❌ Kullanım: `!taş-kağıt-makas [taş/kağıt/makas]`');
    }

    const botChoice = choices[Math.floor(Math.random() * choices.length)];
    
    let result = '';
    let color = '#FFD700';
    
    if (userChoice === botChoice) {
      result = '🤝 Berabere!';
      color = '#FFA500';
    } else if (
      (userChoice === 'taş' && botChoice === 'makas') ||
      (userChoice === 'kağıt' && botChoice === 'taş') ||
      (userChoice === 'makas' && botChoice === 'kağıt')
    ) {
      result = '🎉 Kazandın!';
      color = '#00FF00';
    } else {
      result = '😢 Kaybettin!';
      color = '#FF0000';
    }

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle('🎮 Taş Kağıt Makas')
      .addFields(
        { name: '👤 Senin Seçimin', value: `${emojis[userChoice]} ${userChoice}`, inline: true },
        { name: '🤖 Botun Seçimi', value: `${emojis[botChoice]} ${botChoice}`, inline: true },
        { name: '🏆 Sonuç', value: result, inline: false }
      )
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
