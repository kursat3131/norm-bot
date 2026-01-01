import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import fs from 'fs';

const AUTO_ROLE_CONFIG_FILE = './autorole-config.json';

function loadConfig() {
  try {
    if (fs.existsSync(AUTO_ROLE_CONFIG_FILE)) {
      return JSON.parse(fs.readFileSync(AUTO_ROLE_CONFIG_FILE, 'utf8'));
    }
  } catch (error) {
    console.error('Auto role config yükleme hatası:', error);
  }
  return {};
}

function saveConfig(config) {
  try {
    fs.writeFileSync(AUTO_ROLE_CONFIG_FILE, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error('Auto role config kaydetme hatası:', error);
  }
}

export default {
  name: 'otorol',
  description: 'Otomatik rol verme sistemi',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply('❌ Bu komutu kullanmak için yönetici yetkisine sahip olmalısınız!');
    }

    const subcommand = args[0]?.toLowerCase();
    const config = loadConfig();

    if (subcommand === 'ayarla') {
      const role = message.mentions.roles.first();
      if (!role) {
        return message.reply('❌ Lütfen bir rol etiketleyin! Örnek: `!otorol ayarla @rol`');
      }
      
      config[message.guild.id] = {
        roleId: role.id,
        enabled: true
      };
      
      saveConfig(config);
      
      await message.reply(`✅ Yeni üyelere otomatik olarak ${role} rolü verilecek!`);
    }
    
    else if (subcommand === 'kapat') {
      if (config[message.guild.id]) {
        config[message.guild.id].enabled = false;
        saveConfig(config);
        await message.reply('✅ Otomatik rol sistemi kapatıldı!');
      } else {
        await message.reply('❌ Otomatik rol sistemi zaten kapalı!');
      }
    }
    
    else if (subcommand === 'durum') {
      const guildConfig = config[message.guild.id];
      
      if (!guildConfig || !guildConfig.enabled) {
        return message.reply('❌ Otomatik rol sistemi kapalı!');
      }
      
      const role = message.guild.roles.cache.get(guildConfig.roleId);
      
      if (!role) {
        return message.reply('❌ Ayarlanan rol bulunamadı!');
      }
      
      await message.reply(`✅ Otomatik rol sistemi aktif!\n📝 Rol: ${role}`);
    }

    else {
      const helpEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('🎭 Otomatik Rol Komutları')
        .setDescription('**Kullanım:**\n`!otorol ayarla @rol` - Otomatik rol ayarla\n`!otorol kapat` - Sistemi kapat\n`!otorol durum` - Durumu göster');
      
      await message.reply({ embeds: [helpEmbed] });
    }
  }
};

// Event handler için export
export function handleAutoRole(member) {
  const config = loadConfig();
  const guildConfig = config[member.guild.id];
  
  if (!guildConfig || !guildConfig.enabled) return;
  
  const role = member.guild.roles.cache.get(guildConfig.roleId);
  if (!role) return;
  
  member.roles.add(role).catch(console.error);
}
