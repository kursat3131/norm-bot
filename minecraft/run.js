import { createMinecraftBot } from './bot.js';

const [host, port, username, version] = process.argv.slice(2);

if (!host || !username) {
  console.log('Kullanim: node minecraft/run.js <host> <port> <username> [version]');
  process.exit(1);
}

createMinecraftBot({
  host,
  port: Number(port) || 25565,
  username,
  version: version || undefined
});
