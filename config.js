import dotenv from 'dotenv';
dotenv.config();

export default {
  token: process.env.DISCORD_TOKEN,
  groqApiKey: process.env.GROQ_API_KEY,
  clientId: process.env.CLIENT_ID,
  prefix: '!',
  aiModel: 'llama-3.3-70b-versatile' // Alternatif: 'llama-3.1-8b-instant' (daha hızlı)
};
