# 🚀 Slash Komutları Kurulum

## ⚡ Hızlı Başlangıç

### 1. Slash Komutları Kaydet
Terminal'de çalıştırın:
```bash
npm run deploy
```

**Çıktı:**
```
✅ Slash komutu yüklendi: mesaj
✅ Slash komutu yüklendi: sunucu-bilgi
🔄 2 slash komutu kaydediliyor...
✅ 2 slash komutu başarıyla kaydedildi!

📝 Kayıtlı komutlar:
   /mesaj
   /sunucu-bilgi
```

### 2. Botu Başlat
```bash
npm start
```

### 3. Kullan!

**Discord'da:**
- `/mesaj Merhaba Dünya!` → Bot "Merhaba Dünya!" yazar
- `/sunucu-bilgi` → Sunucu istatistikleri

## 🌍 Global Komut: /mesaj

`/mesaj` komutu **global** bir komuttur. Bu ne demek?

### ✨ Özellikler:
- ✅ Botun olmadığı sunucularda bile görünür
- ✅ DM'lerde çalışır
- ✅ Her yerde kullanılabilir
- ⏰ 1 saat içinde tüm Discord'da aktif olur

### 📝 Kullanım:
```
/mesaj metin: Merhaba!
```

Bot yazdığınız mesajı tekrarlar.

## 🔗 Bot Davet Linki

Botunuzu davet etmek için bu linki kullanın (YOUR_CLIENT_ID yerine kendi Client ID'nizi yazın):
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
```

**Önemli:** `applications.commands` scope'u slash komutlar için gereklidir!

## 🎯 Test Etme

### 1. Kendi Sunucunuzda
- Botu sunucunuza davet edin
- `/mesaj test` yazın
- Bot "test" yazmalı

### 2. Başka Sunucularda
- Botun olmadığı bir sunucuya gidin
- `/mesaj` yazın
- Komut görünmeli (global olduğu için)
- Kullanın!

### 3. DM'de
- Botla DM açın
- `/mesaj Merhaba!` yazın
- Çalışmalı!

## ⚠️ Sorun Giderme

### Komutlar görünmüyor?
1. `npm run deploy` çalıştırdınız mı?
2. 1 saat beklediniz mi? (Global komutlar için)
3. Discord'u yeniden başlattınız mı?

### "Application did not respond" hatası?
- Bot çalışıyor mu kontrol edin (`npm start`)
- `index.js` dosyasında interaction handler var mı?

### Komut çalışmıyor?
- Console'da hata var mı kontrol edin
- Bot yetkilerine sahip mi?

## 📊 Komut İstatistikleri

**Mevcut Slash Komutlar:**
- `/mesaj` - Global (her yerde)
- `/sunucu-bilgi` - Global (her yerde)

**Yakında:**
- `/ekonomi`
- `/avlan`
- `/bakiye`

## 🎮 Örnek Kullanımlar

```
/mesaj metin: Selam Discord!
/mesaj metin: 🎉 Kutlama zamanı!
/mesaj metin: Bot çalışıyor! ✅
/sunucu-bilgi
```

## 💡 İpuçları

1. **Global vs Guild Komutlar:**
   - Global: Her yerde çalışır, 1 saat sürer
   - Guild: Sadece o sunucuda, anında aktif

2. **Komut Güncelleme:**
   - Komut değiştirdiğinizde `npm run deploy` çalıştırın
   - Global komutlar için 1 saat bekleyin

3. **Test Sunucusu:**
   - Test için guild-specific komutlar kullanın (anında aktif)
   - Production için global komutlar kullanın

## 🔥 Başarı!

Artık botunuz slash komutları destekliyor! 🎉

**Sonraki Adımlar:**
- Daha fazla komut ekleyin
- Kullanıcı geri bildirimlerini toplayın
- Komutları geliştirin
