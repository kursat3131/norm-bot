<div align="center">

# 🤖 Norm Bot

### Çok Amaçlı Discord Botu

*Groq AI destekli, ekonomi sistemi ve Minecraft entegrasyonuyla dolu özelliklere sahip Discord botu*

[![Discord.js](https://img.shields.io/badge/discord.js-v14-blue.svg)](https://discord.js.org/)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-orange.svg)](LICENSE)

[Özellikler](#özellikler) • [Kurulum](#kurulum) • [Kullanım](#kullanım) • [Komutlar](#komutlar)

</div>

---

## ✨ Özellikler

### 🧠 Yapay Zeka
Groq AI entegrasyonu ile doğal dil işleme ve akıllı sohbet

### 💰 Ekonomi Sistemi
Günlük ödüller, hayvan yakalama, slot makinesi, rulet ve daha fazlası

### 🎮 Minecraft Entegrasyonu
Discord üzerinden Minecraft botunu kontrol edin ve yönetin

### 🛡️ Moderasyon Araçları
Mute, kick, ban, mesaj silme ve kanal yönetimi

### 🖥️ Electron GUI
Modern arayüzle bot yönetimi, istatistikler ve canlı log görüntüleme

---

## 📦 Kurulum

### Gereksinimler
- Node.js 18 veya üzeri
- npm veya yarn
- Discord Bot Token
- Groq API Key

### Adımlar

**1. Depoyu klonlayın**
```bash
git clone https://github.com/kursat3131/norm-bot.git
cd norm-bot
```

**2. Bağımlılıkları yükleyin**
```bash
npm install
```

**3. Ortam değişkenlerini ayarlayın**
```bash
# .env.example dosyasını .env olarak kopyalayın
cp .env.example .env
```

`.env` dosyasını düzenleyin:
```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
PREFIX=!
GROQ_API_KEY=your_groq_api_key_here
AI_MODEL=llama-3.3-70b-versatile
PORT=3000
```

**4. Slash komutlarını kaydedin**
```bash
npm run deploy
```

**5. Botu başlatın**
```bash
npm start
```

---

## 🔑 API Anahtarları Nasıl Alınır?

### Discord Bot Token

1. [Discord Developer Portal](https://discord.com/developers/applications)'a gidin
2. "New Application" butonuna tıklayın ve bot ismi verin
3. Sol menüden "Bot" sekmesine gidin
4. "Add Bot" butonuna tıklayın
5. "Reset Token" ile token'ı görüntüleyin ve kopyalayın
6. Bot izinleri: `Administrator` veya gerekli izinler
7. "Privileged Gateway Intents" bölümünden şunları aktif edin:
   - Presence Intent
   - Server Members Intent
   - Message Content Intent
8. OAuth2 > URL Generator'dan davet linki:
   - Scopes: `bot` + `applications.commands`
   - Permissions: `Administrator`

### Groq API Key

1. [Groq Console](https://console.groq.com)'a gidin
2. Ücretsiz hesap oluşturun
3. API Keys bölümünden yeni key oluşturun
4. Key'i kopyalayın ve `.env` dosyasına ekleyin

---

## 🖥️ GUI Kullanımı

Botu grafiksel arayüzden yönetmek için:

```bash
npm run gui
```

**GUI ile yapabilecekleriniz:**
- Bot başlatma ve durdurma
- Ayarları değiştirme
- Ekonomi verilerini görüntüleme
- Minecraft bot kontrolü
- Canlı log izleme
- Komut yönetimi

---

## 🎮 Minecraft Entegrasyonu

Norm Bot, Minecraft sunucunuza bağlanıp Discord üzerinden kontrol edilebilen bir bot içerir.

**Komutlar:**
```
!mc-bağla [ip] [port] [kullanıcı]  - Sunucuya bağlan
!mc-durum                           - Bot durumunu göster
!mc-mesaj [mesaj]                   - Minecraft chate mesaj gönder
!mc-collect [blok] [sayı]           - Blok topla ve getir
!mc-mine [x] [y] [z]                - Belirtilen bloğu kaz
!mc-hafıza                          - Botun hafızasını göster
```

**Özellikler:**
- Groq AI ile Minecraft'ta sohbet
- Discord-Minecraft mesaj köprüsü
- Otomatik pathfinding
- Blok toplama ve madencilik
- Oyuncu hafızası sistemi
- 50+ bot yeteneği

---

## 📝 Komutlar

Bot hem prefix (`!`) hem de slash (`/`) komutları destekler.

### 🤖 AI & Genel
- `!yardım` - Tüm komutları gösterir
- `!ai` - AI sohbet modunu aç/kapat
- `@bot [mesaj]` - AI ile sohbet et
- `!sunucu-bilgi` veya `/sunucu-bilgi` - Sunucu bilgilerini göster

### 💰 Ekonomi Sistemi
- `!ekonomi` - Ekonomi komutlarını göster
- `!bakiye` - Bakiyeni ve istatistiklerini gör
- `!günlük` - Günlük ödül topla (streak sistemi)
- `!dilenci` - Dilencilik yaparak para kazan
- `!çalış` - Çalışarak para kazan (1 saat cooldown)
- `!lider` - En zengin kullanıcılar

### 🦊 Hayvan Sistemi
- `!avlan` - Rastgele hayvan yakala (animasyonlu)
- `!hayvanlar [@kullanıcı]` - Hayvan koleksiyonunu gör
- `!sat [hayvan] [miktar]` - Hayvan sat
- `!sat hepsi` - Tüm hayvanları sat

### 🎮 Kumar Oyunları
- `!slot [miktar]` - Slot makinesi (10x jackpot!)
- `!rulet [miktar] [kırmızı/siyah/yeşil]` - Rulet (yeşil 10x!)
- `!coinflip [miktar] [yazı/tura]` - Yazı tura at

### 🏪 Mağaza & Envanter
- `!mağaza` - Eşya satın al
- `!envanter` - Eşyalarını gör
- `!balık-tut` - Balık tut ve sat (olta gerekli)

### 💰 Diğer Ekonomi
- `!soygun @kullanıcı` - Başka kullanıcıyı soy

### 🛡️ Moderasyon
- `!mute @kullanıcı [süre]` - Kullanıcıyı sustur (örn: 10m, 1h)
- `!unmute @kullanıcı` - Susturmayı kaldır
- `!kick @kullanıcı [sebep]` - Kullanıcıyı at
- `!ban @kullanıcı [sebep]` - Kullanıcıyı yasakla
- `!kanal-oluştur [isim]` - Yeni kanal oluştur
- `!temizle [sayı]` - Mesajları sil (max 100)

### 🎨 Sunucu Yönetimi
- `!şablon [1/2]` - Sunucu şablonları (Oyun/Genel)
- `!ticket kur [#kanal]` - Ticket sistemini kur
- `!hoşgeldin ayarla [#kanal]` - Hoş geldin mesajı sistemini ayarla
- `!otorol ayarla @rol` - Yeni üyelere otomatik rol ver

---

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen pull request göndermeden önce:

1. Projeyi fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🐛 Hata Bildirimi

Bir hata mı buldunuz? [Issues](https://github.com/kursat3131/norm-bot/issues) sayfasından bize bildirin.

## 📞 İletişim

Sorularınız için [Issues](https://github.com/kursat3131/norm-bot/issues) sayfasını kullanabilirsiniz.

---

<div align="center">

**Norm Bot** ile Discord sunucunuzu daha eğlenceli hale getirin!

Beğendiyseniz ⭐ vermeyi unutmayın!

</div>
