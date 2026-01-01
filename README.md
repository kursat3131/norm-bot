# Discord AI Bot

Groq AI entegrasyonlu Discord moderasyon botu.

## Özellikler

- 🤖 Groq AI ile akıllı sohbet
- 🔇 Mute/Unmute sistemi
- 👢 Kick/Ban komutları
- 📝 Kanal oluşturma
- 🧹 Mesaj temizleme
- 📊 Sunucu bilgileri

## Kurulum

1. Gerekli paketleri yükleyin:
```bash
npm install
```

2. `.env.example` dosyasını `.env` olarak kopyalayın ve bilgilerinizi girin:
```bash
DISCORD_TOKEN=your_discord_bot_token
GROQ_API_KEY=your_groq_api_key
CLIENT_ID=your_client_id
```

3. Botu başlatın:
```bash
npm start
```

4. Slash komutları kaydet (ilk kurulumda):
```bash
npm run deploy
```

## Discord Bot Oluşturma

1. [Discord Developer Portal](https://discord.com/developers/applications) adresine gidin
2. "New Application" butonuna tıklayın
3. Bot sekmesinden "Add Bot" butonuna tıklayın
4. Token'ı kopyalayın ve `.env` dosyasına ekleyin
5. Bot için gerekli izinleri verin:
   - Administrator (veya özel izinler)
6. OAuth2 > URL Generator'dan bot davet linkini oluşturun
   - Scopes: `bot` ve `applications.commands` seçin
7. Client ID'yi kopyalayın ve `.env` dosyasına ekleyin

## Groq API Key Alma

1. [Groq Console](https://console.groq.com) adresine gidin
2. Hesap oluşturun veya giriş yapın
3. API Keys bölümünden yeni bir key oluşturun
4. Key'i kopyalayın ve `.env` dosyasına ekleyin

## 🌐 Web Panel

Bot başlatıldığında otomatik olarak web panel açılır:
- **URL:** http://localhost:3000
- **Kullanıcı:** admin
- **Şifre:** admin123

### Panel Özellikleri:
- 🎮 Minecraft bot yönetimi
- 💬 Discord bot yönetimi
- 📊 Canlı istatistikler
- 💬 Minecraft chat entegrasyonu

## 🎮 Minecraft Bot

### Discord Komutları:
- `!mc-bağla [ip] [port] [kullanıcı]` - Minecraft sunucusuna bağlan
- `!mc-durum` - Bot durumunu göster
- `!mc-mesaj [mesaj]` - Minecraft'a mesaj gönder
- `!mc-collect [blok] [sayı]` - Blok topla, başa dön ve at
- `!mc-mine [x] [y] [z]` - Koordinattaki bloğu kaz

### Özellikler:
- ✅ AI ile sohbet (Groq)
- ✅ Discord-Minecraft mesaj köprüsü
- ✅ Otomatik küfür filtresi
- ✅ Web panelden yönetim
- ✅ Pathfinding (hareket)

## Komutlar

### 📌 Komut Türleri
Bot hem **prefix komutları** (`!`) hem de **slash komutları** (`/`) destekler!

**Prefix Komutları:** `!yardım`, `!ekonomi`, `!avlan` vb.
**Slash Komutları:** `/mesaj`, `/sunucu-bilgi`, `/ticket`, `/şablon` vb.

### 🌍 Global Slash Komutlar
Bu komutlar botun olmadığı sunucularda bile kullanılabilir:
- `/mesaj [metin]` - Yazdığınız mesajı tekrarlar (her yerde çalışır!)
- `/buton-mesaj [mesaj]` - Tıklanabilir butonlu mesaj gönderir (her yerde çalışır!)

### 🤖 AI & Genel
- `!yardım` - Tüm komutları gösterir
- `!ai` - AI sohbet modunu aç/kapat
- `@bot [mesaj]` - AI ile sohbet et
- `!sunucu-bilgi` veya `/sunucu-bilgi` - Sunucu bilgilerini göster

### 💰 Ekonomi Sistemi (OwO Benzeri)
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

### 🎮 Kumar Oyunları (Animasyonlu)
- `!slot [miktar]` - Slot makinesi (10x jackpot!)
- `!rulet [miktar] [kırmızı/siyah/yeşil]` - Rulet (yeşil 10x!)
- `!coinflip [miktar] [yazı/tura]` - Yazı tura at

### 🏪 Mağaza & Envanter
- `!mağaza` - Eşya satın al
- `!envanter` - Eşyalarını gör
- `!balık-tut` - Balık tut ve sat (olta gerekli)

### 💰 Diğer Ekonomi
- `!soygun @kullanıcı` - Başka kullanıcıyı soy

### 🎵 Müzik
- `!youtube [link]` - YouTube videosu çal (ses kanalında olmalısın)

### 🛡️ Moderasyon
- `!mute @kullanıcı [süre]` - Kullanıcıyı sustur (örn: 10m, 1h)
- `!unmute @kullanıcı` - Susturmayı kaldır
- `!kick @kullanıcı [sebep]` - Kullanıcıyı at
- `!ban @kullanıcı [sebep]` - Kullanıcıyı yasakla
- `!kanal-oluştur [isim]` - Yeni kanal oluştur
- `!temizle [sayı]` - Mesajları sil (max 100)

### 🎨 Sunucu Yönetimi
- `!şablon [1/2]` - Sunucu şablonları (Oyun/Genel)
  - 🎮 **1. Oyun Sunucusu:** Oyun topluluğu için özel kanallar, roller ve ticket sistemi
  - 💬 **2. Genel Sunucu:** Sohbet, eğlence ve topluluk için genel amaçlı sunucu
- `!ticket kur [#kanal]` - Ticket sistemini kur
- `!ticket kapat` - Ticket kanalını kapat
- `!ticket ekle @kullanıcı` - Ticket'a kullanıcı ekle
- `!ticket çıkar @kullanıcı` - Ticket'tan kullanıcı çıkar
- `!hoşgeldin ayarla [#kanal]` - Hoş geldin mesajı sistemini ayarla
- `!hoşgeldin kapat` - Hoş geldin sistemini kapat
- `!hoşgeldin test` - Hoş geldin mesajını test et
- `!otorol ayarla @rol` - Yeni üyelere otomatik rol ver
- `!otorol kapat` - Otomatik rol sistemini kapat
- `!otorol durum` - Otomatik rol durumunu göster

### 🎫 Ticket Sistemi
Ticket sistemi ile kullanıcılar destek talebi oluşturabilir:
1. `/ticket kur` komutu ile ticket panelini bir kanala gönderin
2. Kullanıcılar "Ticket Aç" butonuna tıklayarak özel destek kanalı oluşturabilir
3. Her kullanıcı için otomatik özel kanal oluşturulur
4. Moderatörler `/ticket kapat` ile ticket'ı kapatabilir

### 🎨 Sunucu Şablonları
Sunucunuzu hızlıca kurmak için hazır şablonlar:

**🎮 Oyun Sunucusu Şablonu:**
- 📢 Bilgilendirme (kurallar, duyurular, etkinlikler)
- 💬 Sohbet (genel, oyun, bot komutları, medya)
- 🎮 Oyun (takım bul, liderlik, ses kanalları)
- 🎤 Sesli Kanallar (genel, müzik, AFK)
- 🎫 Destek (ticket, SSS)
- Roller: Yönetici, Moderatör, Oyuncu, VIP, Bot

**💬 Genel Sunucu Şablonu:**
- 📢 Bilgi (hoşgeldin, kurallar, duyurular)
- 💬 Sohbet (genel, eğlence, bot, galeri, linkler)
- 🎨 İçerik (sanat, müzik, video, öneriler)
- 🎤 Sesli (genel, müzik, oyun, AFK)
- 🎫 Destek (ticket, yardım)
- Roller: Yönetici, Moderatör, Üye, İçerik Üreticisi, Bot

## Gereksinimler

- Node.js 18+
- Discord.js v14
- Groq API Key
- Discord Bot Token
