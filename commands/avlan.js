import { EmbedBuilder } from 'discord.js';
import { getUser, updateUser, addAnimal, addMoney } from '../economy/database.js';
import { getRandomAnimal } from '../economy/animals.js';

export default {
  name: 'avlan',
  description: 'Hayvan avla ve para kazan',
  async execute(message) {
    const user = getUser(message.author.id);
    const now = Date.now();
    const cooldown = 15000; // 15 saniye

    if (now - user.lastHunt < cooldown) {
      const timeLeft = Math.ceil((cooldown - (now - user.lastHunt)) / 1000);
      return message.reply(`⏰ Çok yorgunsun! ${timeLeft} saniye sonra tekrar avlanabilirsin.`);
    }

    // Animasyon
    const huntMsg = await message.reply('🏹 Avlanıyorsun...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await huntMsg.edit('🌲 Ormanda arıyorsun...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    const animal = getRandomAnimal();
    const success = Math.random() > 0.3; // %70 başarı şansı

    if (success) {
      await huntMsg.edit('🎯 Hedef kilitlendi!');
      await new Promise(resolve => setTimeout(resolve, 800));

      addAnimal(message.author.id, animal.name);
      addMoney(message.author.id, animal.value);
      user.lastHunt = now;
      updateUser(message.author.id, user);

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('🎯 Başarılı Av!')
        .setDescription(`${animal.name} yakaladın!`)
        .addFields(
          { name: '💰 Kazanç', value: `${animal.value} coin`, inline: true },
          { name: '⭐ Nadirlik', value: animal.rank, inline: true },
          { name: '💵 Toplam', value: `${user.money + animal.value} coin`, inline: true }
        )
        .setTimestamp();

      await huntMsg.edit({ content: '', embeds: [embed] });
    } else {
      await huntMsg.edit('💨 Kaçıyor...');
      await new Promise(resolve => setTimeout(resolve, 800));

      user.lastHunt = now;
      updateUser(message.author.id, user);

      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Kaçtı!')
        .setDescription('Hayvan kaçtı! Daha hızlı olmalısın.')
        .setTimestamp();

      await huntMsg.edit({ content: '', embeds: [embed] });
    }
  }
};
