import { EmbedBuilder } from 'discord.js';
import { getUser, updateUser } from '../economy/database.js';

const items = {
  '🎣': { name: 'Olta', price: 500, description: 'Balık tutmak için' },
  '🔫': { name: 'Silah', price: 2000, description: 'Soygun başarı şansını artırır' },
  '🛡️': { name: 'Kalkan', price: 1500, description: 'Soygunlardan korur' },
  '🎰': { name: 'Şans Tılsımı', price: 3000, description: 'Kumar şansını artırır' },
  '💍': { name: 'Yüzük', price: 5000, description: 'Prestij için' },
  '👑': { name: 'Taç', price: 10000, description: 'Krallık sembolü' },
  '🚗': { name: 'Araba', price: 15000, description: 'Lüks araç' },
  '🏠': { name: 'Ev', price: 50000, description: 'Kendi evin' }
};

export default {
  name: 'mağaza',
  description: 'Mağazadan eşya al',
  async execute(message, args) {
    const username = message.author.username; const user = getUser(message.author.id, username);

    // Mağazayı göster
    if (!args[0]) {
      let itemList = '';
      for (const [emoji, item] of Object.entries(items)) {
        itemList += `${emoji} **${item.name}** - ${item.price.toLocaleString()} coin\n${item.description}\n\n`;
      }

      const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle('🏪 Mağaza')
        .setDescription(itemList)
        .setFooter({ text: 'Satın almak için: !mağaza [emoji]' })
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    }

    // Eşya satın al
    const itemEmoji = args[0];
    const item = items[itemEmoji];

    if (!item) {
      return message.reply('❌ Geçersiz eşya! Mağazayı görmek için `!mağaza` yaz.');
    }

    if (user.money < item.price) {
      return message.reply(`❌ Yeterli paran yok! ${item.name} için ${item.price.toLocaleString()} coin gerekli.`);
    }

    if (!user.inventory) user.inventory = {};
    if (user.inventory[itemEmoji]) {
      return message.reply('❌ Bu eşyaya zaten sahipsin!');
    }

    user.money -= item.price;
    user.inventory[itemEmoji] = item.name;
    updateUser(message.author.id, user);

    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('✅ Satın Alma Başarılı!')
      .setDescription(`${itemEmoji} **${item.name}** satın aldın!`)
      .addFields(
        { name: '💰 Ödenen', value: `${item.price.toLocaleString()} coin`, inline: true },
        { name: '💵 Kalan', value: `${user.money.toLocaleString()} coin`, inline: true }
      )
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
