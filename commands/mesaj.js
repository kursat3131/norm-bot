import { SlashCommandBuilder } from 'discord.js';

export default {
  name: 'mesaj',
  description: 'Yazdığınız mesajı tekrarlar',
  data: new SlashCommandBuilder()
    .setName('mesaj')
    .setDescription('Yazdığınız mesajı tekrarlar')
    .addStringOption(option =>
      option
        .setName('metin')
        .setDescription('Tekrarlanacak mesaj')
        .setRequired(true)
    ),
  async execute(interaction) {
    const mesaj = interaction.options.getString('metin');
    
    // Mesajı tekrarla (herkese görünür)
    await interaction.reply({ 
      content: `${mesaj}\n\n*- ${interaction.user.username} tarafından gönderildi*`
    });
  }
};
