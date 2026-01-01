# 🔧 Minecraft Bot Hata Çözümleri

## ❌ "Read error" / "Chunk size" Hatası

### Sorun:
```
Error: Read error for undefined : array size is abnormally large
Chunk size is 63 but only 29 was read
```

### Sebep:
Minecraft sunucu versiyonu ile bot versiyonu uyuşmuyor.

### Çözüm:

#### 1. Sunucu Versiyonunu Öğren
Minecraft sunucusuna gir ve `/version` komutunu çalıştır.

Örnek çıktı:
```
This server is running Paper version git-Paper-387 (MC: 1.20.1)
```

#### 2. Bot Versiyonunu Ayarla
`minecraft/bot.js` dosyasında version'ı değiştir:

```javascript
bot = mineflayer.createBot({
  host: options.host || 'localhost',
  port: options.port || 25565,
  username: options.username || 'DiscordBot',
  version: '1.20.1', // Sunucu versiyonunu yaz
  auth: 'offline'
});
```

#### 3. Desteklenen Versiyonlar
- ✅ 1.8.x
- ✅ 1.12.x
- ✅ 1.16.x
- ✅ 1.18.x
- ✅ 1.19.x
- ✅ 1.20.x
- ✅ 1.21.x

## ❌ "Client timed out" Hatası

### Sorun:
```
Error: client timed out after 30000 milliseconds
```

### Sebep:
1. Sunucu yanıt vermiyor
2. Ağ bağlantısı yavaş
3. Sunucu offline

### Çözüm:

#### 1. Sunucu Durumunu Kontrol Et
```bash
ping sunucu_ip
```

#### 2. Sunucu Online mı?
Minecraft launcher ile bağlanmayı dene.

#### 3. Firewall Kontrolü
- Windows Firewall'da Node.js'e izin ver
- Sunucu firewall'ında port açık mı kontrol et

## ❌ "Connection refused" Hatası

### Sorun:
```
Error: connect ECONNREFUSED
```

### Sebep:
1. Sunucu kapalı
2. Yanlış IP/Port
3. Firewall engelliyor

### Çözüm:

#### 1. IP ve Port Kontrolü
```
!mc-bağla sunucu_ip 25565 BotIsmi
```

#### 2. Localhost için:
```
!mc-bağla localhost 25565 BotIsmi
```

#### 3. Sunucu Ayarları
`server.properties` dosyasında:
```properties
online-mode=false
```

## 🔧 Genel Çözümler

### 1. Bot Versiyonunu Güncelle
```bash
npm update mineflayer
npm update mineflayer-pathfinder
```

### 2. Node.js Versiyonu
Node.js 18+ kullanın:
```bash
node --version
```

### 3. Botu Yeniden Başlat
```bash
# Ctrl+C ile durdur
npm start
```

### 4. Sunucu Loglarını Kontrol Et
Minecraft sunucu konsolunda hata var mı bak.

## 📝 Önerilen Ayarlar

### minecraft/bot.js
```javascript
bot = mineflayer.createBot({
  host: 'sunucu_ip',
  port: 25565,
  username: 'DiscordBot',
  version: '1.20.1', // Sunucu versiyonu
  auth: 'offline',
  hideErrors: false,
  checkTimeoutInterval: 60000, // 60 saniye
  keepAlive: true
});
```

### server.properties (Sunucu)
```properties
online-mode=false
enable-command-block=true
spawn-protection=0
```

## 🎯 Test Etme

### 1. Basit Test
```
!mc-bağla localhost 25565 TestBot
```

### 2. Durum Kontrolü
```
!mc-durum
```

### 3. Mesaj Gönder
```
!mc-mesaj Merhaba!
```

## 🐛 Hata Ayıklama

### Console Logları
Bot çalışırken console'u izleyin:
```
[MC Chat] oyuncu: mesaj
✅ Minecraft botu sunucuya bağlandı!
🧠 Bot yetenekleri yüklendi!
```

### Hata Mesajları
```
❌ Minecraft bot hatası: [hata]
❌ Bot sunucudan atıldı: [sebep]
❌ Bot bağlantısı kesildi: [sebep]
```

## 💡 İpuçları

### 1. Offline Mode
Sunucu offline mode'da olmalı (premium değil).

### 2. Whitelist
Sunucuda whitelist varsa botu ekle:
```
/whitelist add DiscordBot
```

### 3. OP Yetkisi
Bot için OP yetkisi ver:
```
/op DiscordBot
```

### 4. Spawn Koruma
Spawn protection'ı kapat:
```properties
spawn-protection=0
```

## 🔗 Faydalı Linkler

- [Mineflayer Docs](https://github.com/PrismarineJS/mineflayer)
- [Minecraft Protocol](https://wiki.vg/Protocol)
- [Node.js Download](https://nodejs.org/)

## ✅ Başarılı Bağlantı

Başarılı bağlantıda göreceğiniz mesajlar:
```
✅ Minecraft botu sunucuya bağlandı!
🧠 Bot yetenekleri yüklendi!
[MC Chat] oyuncu: Merhaba bot!
```

Discord'da:
```
✅ Minecraft botuna bağlanıldı!
📍 Sunucu: sunucu_ip:25565
👤 Kullanıcı: DiscordBot
```

Artık bot çalışıyor! 🎮
