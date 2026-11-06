import { EmbedBuilder } from 'discord.js';
import { getUser, updateUser } from '../economy/database.js';

const jobs = [
  { name: '💼 Ofis İşi', min: 100, max: 300, emoji: '📊' },
  { name: '🍕 Pizza Dağıtımı', min: 80, max: 200, emoji: '🛵' },
  { name: '💻 Programcılık', min: 200, max: 500, emoji: '⌨️' },
  { name: '🎨 Tasarım', min: 150, max: 400, emoji: '🖌️' },
  { name: '🚗 Taksi Şoförlüğü', min: 120, max: 350, emoji: '🚕' },
  { name: '🏥 Doktorluk', min: 300, max: 600, emoji: '💉' },
  { name: '👨‍🍳 Aşçılık', min: 90, max: 250, emoji: '🍳' },
  { name: '🎵 Müzisyenlik', min: 100, max: 400, emoji: '🎸' }
];

export default {
  name: 'çalış',
  description: 'Çalışarak para kazan',
  async execute(message) {
    const username = message.author.username; const user = getUser(message.author.id, username);
    const now = Date.now();
    const cooldown = 3600000; // 1 saat

    if (now - (user.lastWork || 0) < cooldown) {
      const timeLeft = Math.ceil((cooldown - (now - (user.lastWork || 0))) / 60000);
      return message.reply(`⏰ Çok yorgunsun! ${timeLeft} dakika sonra tekrar çalışabilirsin.`);
    }

    const job = jobs[Math.floor(Math.random() * jobs.length)];
    const earned = Math.floor(Math.random() * (job.max - job.min + 1)) + job.min;

    user.money += earned;
    user.lastWork = now;
    updateUser(message.author.id, user);

    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle(`${job.emoji} ${job.name}`)
      .setDescription(`Çalıştın ve **${earned}** coin kazandın!`)
      .addFields(
        { name: '💰 Kazanç', value: `${earned} coin`, inline: true },
        { name: '💵 Toplam', value: `${user.money.toLocaleString()} coin`, inline: true }
      )
      .setFooter({ text: 'Her saat çalışabilirsin!' })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
