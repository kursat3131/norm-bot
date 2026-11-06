import { EmbedBuilder } from 'discord.js';
import { getUser, updateUser } from '../economy/database.js';

export default {
  name: 'soygun',
  description: 'Başka bir kullanıcıyı soy',
  async execute(message) {
    const username = message.author.username; const user = getUser(message.author.id, username);
    const now = Date.now();
    const cooldown = 7200000; // 2 saat

    if (now - (user.lastRob || 0) < cooldown) {
      const timeLeft = Math.ceil((cooldown - (now - (user.lastRob || 0))) / 60000);
      return message.reply(`⏰ Polisten saklanıyorsun! ${timeLeft} dakika sonra tekrar soygun yapabilirsin.`);
    }

    const target = message.mentions.users.first();
    if (!target) {
      return message.reply('❌ Kullanım: `!soygun @kullanıcı`');
    }

    if (target.id === message.author.id) {
      return message.reply('❌ Kendini soyamazsın!');
    }

    if (target.bot) {
      return message.reply('❌ Botları soyamazsın!');
    }

    const targetUsername = target.username;
    const targetUser = getUser(target.id, targetUsername);

    if (targetUser.money < 100) {
      return message.reply('❌ Bu kullanıcının yeterli parası yok!');
    }

    const success = Math.random() > 0.4; // %60 başarı şansı

    if (success) {
      const stolen = Math.floor(targetUser.money * (Math.random() * 0.3 + 0.1)); // %10-40 arası
      
      user.money += stolen;
      targetUser.money -= stolen;
      user.lastRob = now;
      
      updateUser(message.author.id, user);
      updateUser(target.id, targetUser);

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('💰 Başarılı Soygun!')
        .setDescription(`${target.username} kullanıcısından **${stolen}** coin çaldın!`)
        .addFields(
          { name: '💵 Çalınan', value: `${stolen} coin`, inline: true },
          { name: '💰 Yeni Bakiye', value: `${user.money.toLocaleString()} coin`, inline: true }
        )
        .setTimestamp();

      await message.reply({ embeds: [embed] });
    } else {
      const fine = Math.floor(user.money * 0.2); // %20 ceza
      user.money = Math.max(0, user.money - fine);
      user.lastRob = now;
      updateUser(message.author.id, user);

      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('🚨 Yakalandın!')
        .setDescription(`Polis seni yakaladı ve **${fine}** coin ceza aldın!`)
        .addFields(
          { name: '❌ Ceza', value: `${fine} coin`, inline: true },
          { name: '💰 Kalan', value: `${user.money.toLocaleString()} coin`, inline: true }
        )
        .setTimestamp();

      await message.reply({ embeds: [embed] });
    }
  }
};
