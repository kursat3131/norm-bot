# Slash Komutları Kurulum Rehberi

## 🎯 Slash Komutları Nedir?

Slash komutları Discord'un yeni komut sistemidir. `/` ile başlar ve Discord'un "Uygulamalar" menüsünden erişilebilir.

### ✨ Avantajları:
- ✅ Otomatik tamamlama
- ✅ Parametre açıklamaları
- ✅ Daha profesyonel görünüm
- ✅ Mobil uyumlu
- ✅ Global kullanım (botun olmadığı sunucularda bile bazı komutlar)

## 📦 Kurulum

### 1. Bot İzinlerini Ayarla

Discord Developer Portal'da:
1. Applications > OAuth2 > URL Generator
2. **Scopes** bölümünde seçin:
   - ✅ `bot`
   - ✅ `applications.commands`
3. **Bot Permissions** bölümünde gerekli izinleri seçin
4. Oluşan URL ile botu sunucuya davet edin

### 2. Slash Komutları Kaydet

Terminal'de çalıştırın:
```bash
npm run deploy
```

Bu komut tüm slash komutlarını Discord'a kaydeder.

### 3. Botu Başlat

```bash
npm start
```

## 🎮 Kullanım

### Prefix Komutları (Eski Yöntem)
```
!yardım
!ekonomi
!avlan
```

### Slash Komutları (Yeni Yöntem)
```
/sunucu-bilgi
/ticket kur
/şablon
```

## 📝 Mevcut Slash Komutları

### Sunucu Yönetimi
- `/sunucu-bilgi` - Sunucu istatistikleri

### Gelecekte Eklenecekler
- `/ekonomi` - Ekonomi sistemi
- `/avlan` - Hayvan avlama
- `/bakiye` - Bakiye görüntüleme
- `/yardım` - Yardım menüsü

## 🔧 Sorun Giderme

### Slash komutlar görünmüyor?
1. `npm run deploy` komutunu çalıştırdınız mı?
2. Bot davet linkinde `applications.commands` scope'u var mı?
3. Global komutlar 1 saat içinde aktif olur, bekleyin

### "Missing Access" hatası?
- Botun sunucuda gerekli izinleri var mı kontrol edin

### Komutlar çalışmıyor?
- `index.js` dosyasında interaction handler var mı kontrol edin
- Bot çalışıyor mu kontrol edin

## 🚀 Yeni Slash Komut Ekleme

1. Komut dosyasına `data` ekleyin:
```javascript
import { SlashCommandBuilder } from 'discord.js';

export default {
  name: 'komut-adi',
  description: 'Açıklama',
  data: new SlashCommandBuilder()
    .setName('komut-adi')
    .setDescription('Açıklama'),
  async execute(interaction) {
    // Komut kodu
  }
};
```

2. Komutları kaydet:
```bash
npm run deploy
```

3. Botu yeniden başlat:
```bash
npm start
```

## 📚 Daha Fazla Bilgi

- [Discord.js Slash Commands Guide](https://discordjs.guide/interactions/slash-commands.html)
- [Discord Developer Portal](https://discord.com/developers/applications)
