import { Client, GatewayIntentBits, Collection, EmbedBuilder, ChannelType, PermissionFlagsBits } from 'discord.js';
import Groq from 'groq-sdk';
import config from './config.js';
import { loadCommands } from './commands/index.js';
import { startWebServer } from './web/server.js';
import { handleGuildMemberAdd } from './commands/hosgeldin.js';
import { handleAutoRole } from './commands/otorol.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration
  ]
});

const groq = new Groq({ apiKey: config.groqApiKey });
client.commands = new Collection();

// Komutları yükle
loadCommands(client);

client.once('clientReady', () => {
  console.log(`✅ Bot hazır! ${client.user.tag} olarak giriş yapıldı`);
  console.log(`\n🔗 Botu sunucuya davet etmek için bu linki kullan:`);
  console.log(`https://discord.com/api/oauth2/authorize?client_id=${config.clientId}&permissions=8&scope=bot\n`);
  client.user.setActivity('AI ile sohbet | !yardım', { type: 0 });
});

// Yeni üye katıldığında
client.on('guildMemberAdd', (member) => {
  handleGuildMemberAdd(member);
  handleAutoRole(member);
});

// Mesaj komutları
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  // Prefix kontrolü
  if (!message.content.startsWith(config.prefix)) {
    // AI ile sohbet (bot mention edildiğinde)
    if (message.mentions.has(client.user)) {
      await handleAIChat(message);
    }
    return;
  }

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args, client);
  } catch (error) {
    console.error(error);
    message.reply('❌ Komut çalıştırılırken bir hata oluştu!');
  }
});

// AI sohbet fonksiyonu
async function handleAIChat(message) {
  try {
    await message.channel.sendTyping();
    
    const userMessage = message.content.replace(/<@!?\d+>/g, '').trim();
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Sen yardımcı ve arkadaş canlısı bir Discord botusun. Türkçe konuşuyorsun ve kullanıcılara yardımcı olmaya çalışıyorsun.'
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      model: config.aiModel,
      temperature: 0.7,
      max_tokens: 1024
    });

    const aiResponse = completion.choices[0]?.message?.content || 'Üzgünüm, bir cevap oluşturamadım.';
    
    // Uzun mesajları böl
    if (aiResponse.length > 2000) {
      const chunks = aiResponse.match(/[\s\S]{1,2000}/g);
      for (const chunk of chunks) {
        await message.reply(chunk);
      }
    } else {
      await message.reply(aiResponse);
    }
  } catch (error) {
    console.error('AI hatası:', error);
    message.reply('❌ AI ile iletişim kurarken bir hata oluştu.');
  }
}

// Interaction Handler (Butonlar ve Select Menu)
client.on('interactionCreate', async (interaction) => {
  // Slash komutları
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      const errorMessage = { content: '❌ Komut çalıştırılırken bir hata oluştu!', flags: 64 };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    }
  }

  // Ticket Butonu
  if (interaction.isButton() && interaction.customId === 'create_ticket') {
    await handleTicketCreate(interaction);
  }

  // Buton Mesaj
  if (interaction.isButton() && interaction.customId === 'button_message') {
    await handleButtonMessage(interaction);
  }

  // Şablon Seçimi
  if (interaction.isStringSelectMenu() && interaction.customId === 'template_select') {
    await handleTemplateSelect(interaction);
  }
});

// Ticket oluşturma
async function handleTicketCreate(interaction) {
  const guild = interaction.guild;
  const member = interaction.member;

  // Zaten açık ticket var mı kontrol et
  const existingTicket = guild.channels.cache.find(
    ch => ch.name === `ticket-${member.user.username.toLowerCase()}`
  );

  if (existingTicket) {
    return interaction.reply({ 
      content: `❌ Zaten açık bir ticketınız var: ${existingTicket}`, 
      flags: 64
    });
  }

  await interaction.deferReply({ flags: 64 });

  try {
    // Ticket kanalı oluştur
    const ticketChannel = await guild.channels.create({
      name: `ticket-${member.user.username}`,
      type: ChannelType.GuildText,
      parent: interaction.channel.parent,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [PermissionFlagsBits.ViewChannel]
        },
        {
          id: member.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory
          ]
        },
        {
          id: client.user.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory
          ]
        }
      ]
    });

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('🎫 Ticket Oluşturuldu')
      .setDescription(`Merhaba ${member}!\n\nDestek ekibimiz en kısa sürede size yardımcı olacaktır.\nLütfen sorununuzu detaylı bir şekilde açıklayın.`)
      .addFields(
        { name: '📝 Ticket Sahibi', value: member.user.tag, inline: true },
        { name: '🕐 Oluşturulma', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
      )
      .setFooter({ text: 'Ticket kapatmak için /ticket kapat' })
      .setTimestamp();

    await ticketChannel.send({ content: `${member}`, embeds: [embed] });
    await interaction.editReply({ content: `✅ Ticket oluşturuldu: ${ticketChannel}` });
  } catch (error) {
    console.error('Ticket oluşturma hatası:', error);
    await interaction.editReply({ content: '❌ Ticket oluşturulurken bir hata oluştu!' });
  }
}

// Buton mesaj handler
async function handleButtonMessage(interaction) {
  // Butona her tıklandığında mesaj gönder (buton kalır)
  await interaction.reply({
    content: `✅ ${interaction.user} butona tıkladı!`,
    flags: 64 // ephemeral - sadece tıklayan görür
  });
}

// Şablon seçimi
async function handleTemplateSelect(interaction) {
  const template = interaction.values[0];
  await interaction.deferReply({ flags: 64 }); // ephemeral yerine flags kullan

  try {
    // Bot yetkilerini kontrol et
    const botMember = interaction.guild.members.me;
    if (!botMember.permissions.has(PermissionFlagsBits.ManageRoles) || 
        !botMember.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return await interaction.editReply({ 
        content: '❌ Botun **Rolleri Yönet** ve **Kanalları Yönet** yetkisine ihtiyacı var!' 
      });
    }

    if (template === 'gaming') {
      await createGamingTemplate(interaction.guild);
      await interaction.editReply({ content: '✅ **Oyun Sunucusu** şablonu başarıyla uygulandı!' });
    } else if (template === 'general') {
      await createGeneralTemplate(interaction.guild);
      await interaction.editReply({ content: '✅ **Genel Sunucu** şablonu başarıyla uygulandı!' });
    }
  } catch (error) {
    console.error('Şablon hatası:', error);
    await interaction.editReply({ 
      content: `❌ Şablon uygulanırken bir hata oluştu!\n\`\`\`${error.message}\`\`\`` 
    });
  }
}

// Oyun Sunucusu Şablonu
async function createGamingTemplate(guild) {
  // Roller
  const roles = [
    { name: '👑 Yönetici', color: 0xe74c3c, permissions: [] }, // Admin rolü oluşturma
    { name: '🛡️ Moderatör', color: 0x3498db, permissions: [] },
    { name: '🎮 Oyuncu', color: 0x2ecc71, permissions: [] },
    { name: '🎯 VIP', color: 0xf1c40f, permissions: [] },
    { name: '🤖 Bot', color: 0x95a5a6, permissions: [] }
  ];

  for (const role of roles) {
    const existing = guild.roles.cache.find(r => r.name === role.name);
    if (!existing) {
      try {
        await guild.roles.create({
          name: role.name,
          color: role.color,
          permissions: role.permissions
        });
      } catch (error) {
        console.error(`Rol oluşturma hatası (${role.name}):`, error.message);
      }
    }
  }

  // Kategoriler ve Kanallar
  const categories = [
    {
      name: '📢 BİLGİLENDİRME',
      channels: [
        { name: '📜・kurallar', type: ChannelType.GuildText },
        { name: '📣・duyurular', type: ChannelType.GuildText },
        { name: '🎉・etkinlikler', type: ChannelType.GuildText }
      ]
    },
    {
      name: '💬 SOHBET',
      channels: [
        { name: '💬・genel-sohbet', type: ChannelType.GuildText },
        { name: '🎮・oyun-sohbet', type: ChannelType.GuildText },
        { name: '🤖・bot-komutları', type: ChannelType.GuildText },
        { name: '📷・medya', type: ChannelType.GuildText }
      ]
    },
    {
      name: '🎮 OYUN',
      channels: [
        { name: '🎯・takım-bul', type: ChannelType.GuildText },
        { name: '🏆・liderlik-tablosu', type: ChannelType.GuildText },
        { name: '🎮・Oyun Odası 1', type: ChannelType.GuildVoice },
        { name: '🎮・Oyun Odası 2', type: ChannelType.GuildVoice }
      ]
    },
    {
      name: '🎤 SESLİ KANALLAR',
      channels: [
        { name: '🔊・Genel Ses', type: ChannelType.GuildVoice },
        { name: '🎵・Müzik', type: ChannelType.GuildVoice },
        { name: '🔇・AFK', type: ChannelType.GuildVoice }
      ]
    },
    {
      name: '🎫 DESTEK',
      channels: [
        { name: '🎫・ticket-aç', type: ChannelType.GuildText },
        { name: '❓・sss', type: ChannelType.GuildText }
      ]
    }
  ];

  for (const category of categories) {
    try {
      const cat = await guild.channels.create({
        name: category.name,
        type: ChannelType.GuildCategory
      });

      for (const channel of category.channels) {
        try {
          await guild.channels.create({
            name: channel.name,
            type: channel.type,
            parent: cat.id
          });
        } catch (error) {
          console.error(`Kanal oluşturma hatası (${channel.name}):`, error.message);
        }
      }
    } catch (error) {
      console.error(`Kategori oluşturma hatası (${category.name}):`, error.message);
    }
  }
}

// Genel Sunucu Şablonu
async function createGeneralTemplate(guild) {
  // Roller
  const roles = [
    { name: '👑 Yönetici', color: 0xe74c3c, permissions: [] },
    { name: '🛡️ Moderatör', color: 0x3498db, permissions: [] },
    { name: '⭐ Üye', color: 0x2ecc71, permissions: [] },
    { name: '🎨 İçerik Üreticisi', color: 0x9b59b6, permissions: [] },
    { name: '🤖 Bot', color: 0x95a5a6, permissions: [] }
  ];

  for (const role of roles) {
    const existing = guild.roles.cache.find(r => r.name === role.name);
    if (!existing) {
      try {
        await guild.roles.create({
          name: role.name,
          color: role.color,
          permissions: role.permissions
        });
      } catch (error) {
        console.error(`Rol oluşturma hatası (${role.name}):`, error.message);
      }
    }
  }

  // Kategoriler ve Kanallar
  const categories = [
    {
      name: '📢 BİLGİ',
      channels: [
        { name: '👋・hoşgeldin', type: ChannelType.GuildText },
        { name: '📜・kurallar', type: ChannelType.GuildText },
        { name: '📣・duyurular', type: ChannelType.GuildText }
      ]
    },
    {
      name: '💬 SOHBET',
      channels: [
        { name: '💬・genel', type: ChannelType.GuildText },
        { name: '🎭・eğlence', type: ChannelType.GuildText },
        { name: '🤖・bot-komutları', type: ChannelType.GuildText },
        { name: '📸・galeri', type: ChannelType.GuildText },
        { name: '🔗・linkler', type: ChannelType.GuildText }
      ]
    },
    {
      name: '🎨 İÇERİK',
      channels: [
        { name: '🎨・sanat', type: ChannelType.GuildText },
        { name: '🎵・müzik', type: ChannelType.GuildText },
        { name: '📺・video', type: ChannelType.GuildText },
        { name: '💡・öneriler', type: ChannelType.GuildText }
      ]
    },
    {
      name: '🎤 SESLİ',
      channels: [
        { name: '🔊・Genel Ses', type: ChannelType.GuildVoice },
        { name: '🎵・Müzik Dinle', type: ChannelType.GuildVoice },
        { name: '🎮・Oyun', type: ChannelType.GuildVoice },
        { name: '🔇・AFK', type: ChannelType.GuildVoice }
      ]
    },
    {
      name: '🎫 DESTEK',
      channels: [
        { name: '🎫・ticket-aç', type: ChannelType.GuildText },
        { name: '❓・yardım', type: ChannelType.GuildText }
      ]
    }
  ];

  for (const category of categories) {
    try {
      const cat = await guild.channels.create({
        name: category.name,
        type: ChannelType.GuildCategory
      });

      for (const channel of category.channels) {
        try {
          await guild.channels.create({
            name: channel.name,
            type: channel.type,
            parent: cat.id
          });
        } catch (error) {
          console.error(`Kanal oluşturma hatası (${channel.name}):`, error.message);
        }
      }
    } catch (error) {
      console.error(`Kategori oluşturma hatası (${category.name}):`, error.message);
    }
  }
}

client.login(config.token);
