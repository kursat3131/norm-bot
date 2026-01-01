import { EmbedBuilder } from 'discord.js';

const games = new Map();

export default {
  name: 'sayı-tahmin',
  description: 'Sayı tahmin oyunu',
  async execute(message, args) {
    const userId = message.author.id;

    if (!args[0]) {
      // Yeni oyun başlat
      const number = Math.floor(Math.random() * 100) + 1;
      games.set(userId, { number, attempts: 0, maxAttempts: 7 });

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('🎯 Sayı Tahmin Oyunu')
        .setDescription('1-100 arası bir sayı tuttum!\n`!sayı-tahmin [sayı]` ile tahmin et.')
        .addFields(
          { name: '🎮 Hak', value: '7 tahmin hakkın var', inline: true }
        )
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    }

    // Tahmin yap
    const game = games.get(userId);
    if (!game) {
      return message.reply('❌ Önce `!sayı-tahmin` yazarak oyunu başlat!');
    }

    const guess = parseInt(args[0]);
    if (isNaN(guess) || guess < 1 || guess > 100) {
      return message.reply('❌ 1-100 arası bir sayı gir!');
    }

    game.attempts++;

    if (guess === game.number) {
      games.delete(userId);
      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('🎉 Tebrikler!')
        .setDescription(`Doğru tahmin! Sayı **${game.number}** idi.`)
        .addFields(
          { name: '🎯 Tahmin Sayısı', value: `${game.attempts}`, inline: true }
        )
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    }

    if (game.attempts >= game.maxAttempts) {
      games.delete(userId);
      return message.reply(`😢 Kaybettin! Sayı **${game.number}** idi. Tekrar denemek için \`!sayı-tahmin\` yaz.`);
    }

    const hint = guess < game.number ? '⬆️ Daha büyük!' : '⬇️ Daha küçük!';
    const remaining = game.maxAttempts - game.attempts;

    message.reply(`${hint} Kalan hak: **${remaining}**`);
  }
};
