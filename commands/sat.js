import { EmbedBuilder } from 'discord.js';
import { getUser, updateUser } from '../economy/database.js';
import { animals } from '../economy/animals.js';

export default {
  name: 'sat',
  description: 'Hayvanlarını sat',
  async execute(message, args) {
    const user = getUser(message.author.id);

    if (!args[0]) {
      return message.reply('❌ Kullanım: `!sat [hayvan-emoji] [miktar]` veya `!sat hepsi`');
    }

    if (args[0].toLowerCase() === 'hepsi') {
      let totalValue = 0;
      let totalCount = 0;

      // Tüm hayvanların değerini hesapla
      const allAnimals = [...animals.common, ...animals.uncommon, ...animals.rare, ...animals.legendary];
      
      for (const [animalName, count] of Object.entries(user.animals)) {
        const animalData = allAnimals.find(a => a.name === animalName);
        if (animalData) {
          totalValue += animalData.value * count;
          totalCount += count;
        }
      }

      if (totalCount === 0) {
        return message.reply('❌ Satacak hayvanın yok!');
      }

      user.money += totalValue;
      user.animals = {};
      updateUser(message.author.id, user);

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('💰 Toplu Satış!')
        .setDescription(`${totalCount} hayvanı sattın!`)
        .addFields(
          { name: '💵 Kazanç', value: `${totalValue.toLocaleString()} coin`, inline: true },
          { name: '💰 Yeni Bakiye', value: `${user.money.toLocaleString()} coin`, inline: true }
        )
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    }

    // Tek hayvan sat
    const animalEmoji = args[0];
    const amount = parseInt(args[1]) || 1;

    const animalEntry = Object.entries(user.animals).find(([name]) => name.includes(animalEmoji));
    
    if (!animalEntry) {
      return message.reply('❌ Bu hayvandan sahip değilsin!');
    }

    const [animalName, ownedCount] = animalEntry;

    if (ownedCount < amount) {
      return message.reply(`❌ Sadece ${ownedCount} adet ${animalName} var!`);
    }

    const allAnimals = [...animals.common, ...animals.uncommon, ...animals.rare, ...animals.legendary];
    const animalData = allAnimals.find(a => a.name === animalName);

    if (!animalData) {
      return message.reply('❌ Hayvan bulunamadı!');
    }

    const totalValue = animalData.value * amount;
    user.money += totalValue;
    user.animals[animalName] -= amount;

    if (user.animals[animalName] <= 0) {
      delete user.animals[animalName];
    }

    updateUser(message.author.id, user);

    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('💰 Satış Başarılı!')
      .setDescription(`${amount}x ${animalName} sattın!`)
      .addFields(
        { name: '💵 Kazanç', value: `${totalValue.toLocaleString()} coin`, inline: true },
        { name: '💰 Yeni Bakiye', value: `${user.money.toLocaleString()} coin`, inline: true }
      )
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
