import { EmbedBuilder } from 'discord.js';
import { getBotMemory } from '../minecraft/bot.js';

export default {
  name: 'mc-hafıza',
  description: 'Minecraft bot hafızasını göster',
  async execute(message, args) {
    const memory = getBotMemory();
    
    if (!args[0]) {
      // Genel hafıza istatistikleri
      const stats = memory.getMemoryStats();
      
      const embed = new EmbedBuilder()
        .setColor('#9B59B6')
        .setTitle('🧠 Minecraft Bot Hafızası')
        .addFields(
          { name: '👥 Oyuncular', value: `${stats.players}`, inline: true },
          { name: '📍 Konumlar', value: `${stats.locations}`, inline: true },
          { name: '📝 Olaylar', value: `${stats.events}`, inline: true },
          { name: '💬 Sohbetler', value: `${stats.conversations}`, inline: true },
          { name: '📋 Görevler', value: `${stats.tasks} (${stats.activeTasks} aktif)`, inline: true },
          { name: '📚 Bilgi', value: `${stats.knowledge}`, inline: true }
        )
        .setFooter({ text: 'Detay için: !mc-hafıza [oyuncu/konum/görev]' })
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }

    const subcommand = args[0].toLowerCase();
    
    if (subcommand === 'oyuncu' || subcommand === 'player') {
      const username = args[1];
      if (!username) {
        const players = Object.keys(memory.getMemoryStats().players);
        return message.reply(`👥 **Bilinen Oyuncular:**\n${players.join(', ') || 'Henüz yok'}`);
      }
      
      const playerData = memory.getPlayerMemory(username);
      if (!playerData) {
        return message.reply('❌ Bu oyuncu hafızada yok!');
      }
      
      const embed = new EmbedBuilder()
        .setColor('#3498DB')
        .setTitle(`👤 ${username}`)
        .addFields(
          { name: '🕐 İlk Görülme', value: new Date(playerData.firstSeen).toLocaleString('tr-TR'), inline: true },
          { name: '🕐 Son Görülme', value: new Date(playerData.lastSeen).toLocaleString('tr-TR'), inline: true },
          { name: '💬 Etkileşim', value: `${playerData.interactions}`, inline: true },
          { name: '❤️ Arkadaşlık', value: `${playerData.friendship}/100`, inline: true }
        );
      
      if (playerData.notes && playerData.notes.length > 0) {
        embed.addFields({ name: '📝 Notlar', value: playerData.notes.join('\n') });
      }
      
      return message.reply({ embeds: [embed] });
    }
    
    if (subcommand === 'konum' || subcommand === 'location') {
      const locations = memory.getAllLocations();
      const locationList = Object.entries(locations).map(([name, data]) => {
        const pos = data.position;
        return `📍 **${name}**: X:${Math.floor(pos.x)} Y:${Math.floor(pos.y)} Z:${Math.floor(pos.z)}`;
      }).join('\n');
      
      return message.reply(`**Kayıtlı Konumlar:**\n${locationList || 'Henüz yok'}`);
    }
    
    if (subcommand === 'görev' || subcommand === 'task') {
      const tasks = memory.getActiveTasks();
      const taskList = tasks.map(task => {
        return `📋 **${task.description || task.type}** (ID: ${task.id})`;
      }).join('\n');
      
      return message.reply(`**Aktif Görevler:**\n${taskList || 'Henüz yok'}`);
    }
    
    message.reply('❌ Geçersiz komut! Kullanım: `!mc-hafıza [oyuncu/konum/görev]`');
  }
};
