import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } from 'discord.js';

export default {
  name: 'ticket',
  description: 'Ticket sistemi yönetimi',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply('❌ Bu komutu kullanmak için yönetici yetkisine sahip olmalısınız!');
    }

    const subcommand = args[0]?.toLowerCase();

    if (subcommand === 'kur') {
      const channel = message.mentions.channels.first() || message.channel;

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('🎫 Destek Talebi Oluştur')
        .setDescription('Destek ekibiyle iletişime geçmek için aşağıdaki butona tıklayın.\n\n**Ticket açmadan önce:**\n• Kuralları okuduğunuzdan emin olun\n• Sorununuzu açık ve net bir şekilde anlatın\n• Gereksiz ticket açmayın')
        .setFooter({ text: 'Ticket sistemi aktif' })
        .setTimestamp();

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('create_ticket')
            .setLabel('Ticket Aç')
            .setEmoji('🎫')
            .setStyle(ButtonStyle.Primary)
        );

      await channel.send({ embeds: [embed], components: [row] });
      await message.reply(`✅ Ticket paneli ${channel} kanalına gönderildi!`);
    }

    else if (subcommand === 'kapat') {
      if (!message.channel.name.startsWith('ticket-')) {
        return message.reply('❌ Bu komut sadece ticket kanallarında kullanılabilir!');
      }

      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('🔒 Ticket Kapatılıyor')
        .setDescription('Bu ticket 5 saniye içinde kapatılacak...')
        .setFooter({ text: `Kapatan: ${message.author.tag}` })
        .setTimestamp();

      await message.reply({ embeds: [embed] });

      setTimeout(async () => {
        await message.channel.delete();
      }, 5000);
    }

    else if (subcommand === 'ekle') {
      if (!message.channel.name.startsWith('ticket-')) {
        return message.reply('❌ Bu komut sadece ticket kanallarında kullanılabilir!');
      }

      const user = message.mentions.users.first();
      if (!user) {
        return message.reply('❌ Lütfen bir kullanıcı etiketleyin! Örnek: `!ticket ekle @kullanıcı`');
      }
      
      await message.channel.permissionOverwrites.create(user, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true
      });

      await message.reply(`✅ ${user} ticket kanalına eklendi!`);
    }

    else if (subcommand === 'çıkar' || subcommand === 'cikar') {
      if (!message.channel.name.startsWith('ticket-')) {
        return message.reply('❌ Bu komut sadece ticket kanallarında kullanılabilir!');
      }

      const user = message.mentions.users.first();
      if (!user) {
        return message.reply('❌ Lütfen bir kullanıcı etiketleyin! Örnek: `!ticket çıkar @kullanıcı`');
      }
      
      await message.channel.permissionOverwrites.delete(user);

      await message.reply(`✅ ${user} ticket kanalından çıkarıldı!`);
    }

    else {
      const helpEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('🎫 Ticket Komutları')
        .setDescription('**Kullanım:**\n`!ticket kur [#kanal]` - Ticket paneli oluştur\n`!ticket kapat` - Ticket kanalını kapat\n`!ticket ekle @kullanıcı` - Kullanıcı ekle\n`!ticket çıkar @kullanıcı` - Kullanıcı çıkar');
      
      await message.reply({ embeds: [helpEmbed] });
    }
  }
};
