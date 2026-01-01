import { EmbedBuilder } from 'discord.js';
import { abilityDescriptions } from '../minecraft/abilities.js';

export default {
  name: 'mc-komut',
  description: 'Minecraft bot komutlarını göster',
  async execute(message) {
    const abilities = Object.entries(abilityDescriptions)
      .map(([name, desc]) => `**${name}**: ${desc}`)
      .join('\n');

    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('🤖 Minecraft Bot Yetenekleri')
      .setDescription('Bota doğal dille komut verebilirsin!')
      .addFields(
        { name: '🎯 Hareket', value: '• "gel buraya"\n• "beni takip et"\n• "dur"\n• "zıpla"', inline: true },
        { name: '⛏️ Etkileşim', value: '• "taş kır"\n• "eşya topla"\n• "envanterini göster"', inline: true },
        { name: '👀 Bilgi', value: '• "sağlığın nasıl"\n• "yakında kim var"\n• "etrafına bak"', inline: true }
      )
      .addFields(
        { name: '📋 Tüm Yetenekler', value: abilities, inline: false }
      )
      .setFooter({ text: 'Minecraft\'ta botu etiketleyerek komut ver!' })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
