import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  name: 'şablon',
  description: 'Sunucu şablonları',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply('❌ Bu komutu kullanmak için yönetici yetkisine sahip olmalısınız!');
    }

    // Bot yetkilerini kontrol et
    const botMember = message.guild.members.me;
    if (!botMember.permissions.has(PermissionFlagsBits.ManageRoles) || 
        !botMember.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return message.reply('❌ Botun **Rolleri Yönet** ve **Kanalları Yönet** yetkisine ihtiyacı var!\n\n**Nasıl Verilir:**\n1. Sunucu Ayarları > Roller\n2. Bot rolünü bul\n3. "Rolleri Yönet" ve "Kanalları Yönet" yetkilerini aç');
    }

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('🎨 Sunucu Şablonları')
      .setDescription('Hangi şablonu kullanmak istersiniz?\n\n**Kullanım:** `!şablon [1/2]`\n\n⚠️ **Uyarı:** Bu işlem sunucunuza yeni kanallar ve roller ekleyecektir!')
      .addFields(
        { 
          name: '🎮 1. Oyun Sunucusu', 
          value: '5 kategori, 15+ kanal, 5 rol' 
        },
        { 
          name: '💬 2. Genel Sunucu', 
          value: '5 kategori, 15+ kanal, 5 rol' 
        }
      )
      .setFooter({ text: 'Örnek: !şablon 1 veya aşağıdaki menüden seçin' });

    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('template_select')
          .setPlaceholder('Şablon seçin...')
          .addOptions([
            {
              label: '🎮 Oyun Sunucusu',
              description: 'Oyun topluluğu şablonu',
              value: 'gaming',
              emoji: '🎮'
            },
            {
              label: '💬 Genel Sunucu',
              description: 'Genel amaçlı sunucu şablonu',
              value: 'general',
              emoji: '💬'
            }
          ])
      );

    await message.reply({ embeds: [embed], components: [row] });
  }
};
