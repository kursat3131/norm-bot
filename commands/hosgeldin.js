import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import fs from 'fs';

const WELCOME_CONFIG_FILE = './welcome-config.json';

function loadConfig() {
  try {
    if (fs.existsSync(WELCOME_CONFIG_FILE)) {
      return JSON.parse(fs.readFileSync(WELCOME_CONFIG_FILE, 'utf8'));
    }
  } catch (error) {
    console.error('Welcome config yükleme hatası:', error);
  }
  return {};
}

function saveConfig(config) {
  try {
    fs.writeFileSync(WELCOME_CONFIG_FILE, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error('Welcome config kaydetme hatası:', error);
  }
}

export default {
  name: 'hoşgeldin',
  description: 'Hoş geldin sistemi',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply('❌ Bu komutu kullanmak için yönetici yetkisine sahip olmalısınız!');
    }

    const subcommand = args[0]?.toLowerCase();
    const config = loadConfig();

    if (subcommand === 'ayarla') {
      const channel = message.mentions.channels.first() || message.channel;
      
      config[message.guild.id] = {
        channelId: channel.id,
        enabled: true
      };
      
      saveConfig(config);
      
      await message.reply(`✅ Hoş geldin sistemi ${channel} kanalına ayarlandı!`);
    }
    
    else if (subcommand === 'kapat') {
      if (config[message.guild.id]) {
        config[message.guild.id].enabled = false;
        saveConfig(config);
        await message.reply('✅ Hoş geldin sistemi kapatıldı!');
      } else {
        await message.reply('❌ Hoş geldin sistemi zaten kapalı!');
      }
    }
    
    else if (subcommand === 'test') {
      const guildConfig = config[message.guild.id];
      
      if (!guildConfig || !guildConfig.enabled) {
        return message.reply('❌ Hoş geldin sistemi ayarlanmamış!');
      }
      
      const channel = message.guild.channels.cache.get(guildConfig.channelId);
      
      if (!channel) {
        return message.reply('❌ Hoş geldin kanalı bulunamadı!');
      }
      
      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('🎉 Hoş Geldin!')
        .setDescription(`Merhaba ${message.author}!\n\n**${message.guild.name}** sunucusuna hoş geldin!\n\nKuralları okumayı unutma ve iyi eğlenceler! 🎮`)
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: '👥 Üye Sayısı', value: `${message.guild.memberCount}`, inline: true },
          { name: '📅 Katılma Tarihi', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
        )
        .setFooter({ text: `Sunucu: ${message.guild.name}` })
        .setTimestamp();
      
      await channel.send({ embeds: [embed] });
      await message.reply('✅ Test mesajı gönderildi!');
    }

    else {
      const helpEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('👋 Hoş Geldin Komutları')
        .setDescription('**Kullanım:**\n`!hoşgeldin ayarla [#kanal]` - Hoş geldin kanalı ayarla\n`!hoşgeldin kapat` - Sistemi kapat\n`!hoşgeldin test` - Test mesajı gönder');
      
      await message.reply({ embeds: [helpEmbed] });
    }
  }
};

// Event handler için export
export function handleGuildMemberAdd(member) {
  const config = loadConfig();
  const guildConfig = config[member.guild.id];
  
  if (!guildConfig || !guildConfig.enabled) return;
  
  const channel = member.guild.channels.cache.get(guildConfig.channelId);
  if (!channel) return;
  
  const embed = new EmbedBuilder()
    .setColor('#00ff00')
    .setTitle('🎉 Hoş Geldin!')
    .setDescription(`Merhaba ${member}!\n\n**${member.guild.name}** sunucusuna hoş geldin!\n\nKuralları okumayı unutma ve iyi eğlenceler! 🎮`)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .addFields(
      { name: '👥 Üye Sayısı', value: `${member.guild.memberCount}`, inline: true },
      { name: '📅 Katılma Tarihi', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
    )
    .setFooter({ text: `Sunucu: ${member.guild.name}` })
    .setTimestamp();
  
  channel.send({ embeds: [embed] });
}
