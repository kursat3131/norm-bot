import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function loadCommands(client) {
  const commandFiles = readdirSync(__dirname).filter(file => file.endsWith('.js') && file !== 'index.js');
  
  for (const file of commandFiles) {
    const command = await import(`./${file}`);
    client.commands.set(command.default.name, command.default);
    console.log(`✅ Komut yüklendi: ${command.default.name}`);
  }
}
