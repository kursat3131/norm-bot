# 🌍 Global Komut Test Rehberi

## ✅ `/mesaj` Komutu Global!

`/mesaj` komutu **global** bir komuttur ve **her yerde** çalışır!

### 🎯 Nerede Çalışır?

1. ✅ **Botun olduğu sunucularda**
2. ✅ **Botun olmadığı sunucularda**
3. ✅ **DM'lerde (Özel Mesajlar)**
4. ✅ **Grup DM'lerinde**

## 🧪 Test Etme

### 1. Komutları Kaydet
```bash
npm run deploy
```

**Çıktı:**
```
✅ Slash komutu yüklendi: mesaj
✅ Slash komutu yüklendi: buton-mesaj
✅ Slash komutu yüklendi: sunucu-bilgi
✅ 3 slash komutu başarıyla kaydedildi!

📝 Kayıtlı komutlar:
   /mesaj
   /buton-mesaj
   /sunucu-bilgi
```

### 2. Bekle (Önemli!)
⏰ **Global komutlar 1 saat içinde aktif olur**

Discord'un tüm sunucularına yayılması zaman alır.

### 3. Test Et

#### Test 1: Botun Olduğu Sunucuda
```
/mesaj metin: Test mesajı
```
✅ Çalışmalı

#### Test 2: Botun Olmadığı Sunucuda
1. Botun olmadığı bir sunucuya git
2. `/mesaj` yaz
3. Komut görünmeli!
4. Kullan: `/mesaj metin: Merhaba!`
5. ✅ Çalışmalı

#### Test 3: DM'de
1. Herhangi biriyle DM aç
2. `/mesaj metin: Test`
3. ✅ Çalışmalı

#### Test 4: Kendi Kendine DM
1. Kendine mesaj at
2. `/mesaj metin: Selam!`
3. ✅ Çalışmalı

## 🔍 Sorun Giderme

### Komut Görünmüyor?

**1. Beklediniz mi?**
- Global komutlar 1 saat sürer
- Sabırlı olun!

**2. Discord'u Yenilediniz mi?**
- Discord'u tamamen kapatın
- Yeniden açın
- Tekrar deneyin

**3. Doğru Client ID?**
- `.env` dosyasında `CLIENT_ID=1363822408544292985`
- Doğru mu kontrol edin

**4. Deploy Çalıştırdınız mı?**
```bash
npm run deploy
```

### "Application did not respond" Hatası?

**Bot çalışıyor mu?**
```bash
npm start
```

Bot çalışmazsa komutlar çalışmaz!

### Komut Çalışmıyor?

**1. Console'da hata var mı?**
- Terminal'i kontrol edin
- Hata mesajlarını okuyun

**2. Bot Yetkisi?**
- Botun mesaj gönderme yetkisi var mı?
- Kanal izinlerini kontrol edin

## 📊 Komut Karşılaştırması

| Komut | Global? | Botun Olmadığı Sunucularda? | DM'de? |
|-------|---------|----------------------------|--------|
| `/mesaj` | ✅ Evet | ✅ Çalışır | ✅ Çalışır |
| `/buton-mesaj` | ✅ Evet | ✅ Çalışır | ✅ Çalışır |
| `/sunucu-bilgi` | ✅ Evet | ❌ Hata verir (guild gerekli) | ❌ Hata verir |
| `!yardım` | ❌ Hayır | ❌ Çalışmaz | ❌ Çalışmaz |

## 💡 İpuçları

### 1. Test Sunucusu
Hızlı test için guild-specific komutlar kullanın:

```javascript
// deploy-commands.js içinde değiştirin:
await rest.put(
  Routes.applicationGuildCommands(config.clientId, 'GUILD_ID'),
  { body: commands },
);
```

Guild komutlar **anında** aktif olur!

### 2. Global vs Guild

**Global Komutlar:**
- ✅ Her yerde çalışır
- ⏰ 1 saat sürer
- 🌍 Production için ideal

**Guild Komutlar:**
- ✅ Sadece o sunucuda
- ⚡ Anında aktif
- 🧪 Test için ideal

### 3. Komut Silme

Tüm global komutları silmek için:

```javascript
// deploy-commands.js içinde:
await rest.put(
  Routes.applicationCommands(config.clientId),
  { body: [] }, // Boş array
);
```

## ✅ Başarı Kriterleri

Komutunuz başarılı çalışıyorsa:

1. ✅ Botun olduğu sunucularda çalışır
2. ✅ Botun olmadığı sunucularda görünür
3. ✅ DM'lerde çalışır
4. ✅ Herkese mesaj görünür
5. ✅ Hata vermez

## 🎉 Sonuç

`/mesaj` komutu **global** bir komuttur ve **her yerde** çalışır!

**Kullanım:**
```
/mesaj metin: [mesajınız]
```

**Özellikler:**
- 🌍 Global (her yerde)
- 👥 Herkese görünür
- 💬 DM'lerde çalışır
- ⚡ Hızlı ve kolay

Artık komutunuz tüm Discord'da kullanılabilir! 🚀
