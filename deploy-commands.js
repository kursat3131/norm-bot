import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import config from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const commands = [];
const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js') && file !== 'index.js');

// Komutları yükle
for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  if (command.default.data) {
    commands.push(command.default.data.toJSON());
    console.log(`✅ Slash komutu yüklendi: ${command.default.name}`);
  }
}

// REST API ile komutları kaydet
const rest = new REST().setToken(config.token);

(async () => {
  try {
    console.log(`\n🔄 ${commands.length} slash komutu kaydediliyor...`);

    // Global komutlar (tüm sunucularda çalışır, 1 saat içinde aktif olur)
    const data = await rest.put(
      Routes.applicationCommands(config.clientId),
      { body: commands },
    );

    console.log(`✅ ${data.length} slash komutu başarıyla kaydedildi!`);
    console.log('\n📝 Kayıtlı komutlar:');
    data.forEach(cmd => console.log(`   /${cmd.name}`));
    
  } catch (error) {
    console.error('❌ Slash komut kaydetme hatası:', error);
  }
})();
