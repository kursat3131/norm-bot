import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
  name: 'buton-mesaj',
  description: 'Butona tıklanabilir mesaj gönderir',
  data: new SlashCommandBuilder()
    .setName('buton-mesaj')
    .setDescription('Butona tıklanabilir mesaj gönderir')
    .addStringOption(option =>
      option
        .setName('mesaj')
        .setDescription('Gösterilecek mesaj')
        .setRequired(true)
    ),
  async execute(interaction) {
    const mesaj = interaction.options.getString('mesaj');
    
    // Buton oluştur
    const button = new ButtonBuilder()
      .setCustomId('button_message')
      .setLabel('Tıkla!')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('👆');
    
    // Action Row oluştur (butonları tutar)
    const row = new ActionRowBuilder()
      .addComponents(button);
    
    // Mesajı butonla birlikte gönder
    await interaction.reply({
      content: `📨 **${mesaj}**`,
      components: [row]
    });
  }
};
