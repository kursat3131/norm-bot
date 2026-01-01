import Groq from 'groq-sdk';
import config from '../config.js';

const groq = new Groq({ apiKey: config.groqApiKey });
const aiSessions = new Map();
const conversationHistory = new Map();

export default {
  name: 'ai',
  description: 'AI ile sohbet et',
  async execute(message, args) {
    const userId = message.author.id;
    const isActive = aiSessions.get(userId);

    // AI modunu aç/kapat
    if (!args.length) {
      if (isActive) {
        aiSessions.delete(userId);
        conversationHistory.delete(userId);
        return message.reply('🤖 AI sohbet modu kapatıldı.');
      } else {
        aiSessions.set(userId, true);
        conversationHistory.set(userId, []);
        return message.reply('🤖 AI sohbet modu aktif! Benimle konuşabilirsiniz.\n`!ai` yazarak kapatabilirsiniz.');
      }
    }

    // AI modu aktif değilse
    if (!isActive) {
      return message.reply('❌ Önce `!ai` yazarak AI sohbet modunu aktif edin!');
    }

    const userMessage = args.join(' ');
    await message.channel.sendTyping();

    try {
      // Konuşma geçmişini al
      const history = conversationHistory.get(userId) || [];
      
      // Yeni mesajı ekle
      history.push({
        role: 'user',
        content: userMessage
      });

      // Son 10 mesajı tut
      if (history.length > 20) {
        history.splice(0, history.length - 20);
      }

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Sen yardımcı, arkadaş canlısı ve eğlenceli bir Discord botusun. Türkçe konuşuyorsun. Kullanıcılarla doğal bir şekilde sohbet ediyorsun.'
          },
          ...history
        ],
        model: config.aiModel,
        temperature: 0.8,
        max_tokens: 1024
      });

      const aiResponse = completion.choices[0]?.message?.content || 'Üzgünüm, bir cevap oluşturamadım.';
      
      // AI yanıtını geçmişe ekle
      history.push({
        role: 'assistant',
        content: aiResponse
      });

      conversationHistory.set(userId, history);

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
};
