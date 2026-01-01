# 🔘 Butonlu Mesaj Örnekleri

## 🎯 `/buton-mesaj` Komutu

Tıklanabilir butonlu mesajlar oluşturur!

### ✨ Özellikler:
- ✅ Buton her tıklandığında mesaj gönderir
- ✅ Buton kaybolmaz (sürekli kullanılabilir)
- ✅ Sadece tıklayan kişi cevabı görür (ephemeral)
- ✅ Global komut (her yerde çalışır)

## 📝 Kullanım

### Temel Kullanım:
```
/buton-mesaj mesaj: Selam!
```

**Sonuç:**
- Bot "📨 **Selam!**" mesajı gönderir
- Altında "👆 Tıkla!" butonu olur
- Butona tıklayınca "✅ @kullanıcı butona tıkladı!" mesajı gelir

### Örnek Kullanımlar:

**1. Hoş Geldin Mesajı:**
```
/buton-mesaj mesaj: Sunucumuza hoş geldiniz! 🎉
```

**2. Duyuru:**
```
/buton-mesaj mesaj: Yeni etkinlik başladı! Katılmak için butona tıkla!
```

**3. Anket:**
```
/buton-mesaj mesaj: Bu özelliği beğendiniz mi?
```

**4. Bilgilendirme:**
```
/buton-mesaj mesaj: Kuralları okudum ve kabul ediyorum ✅
```

**5. Eğlence:**
```
/buton-mesaj mesaj: Bana tıkla! 😄
```

## 🎮 Nasıl Çalışır?

### 1. Komutu Kullan:
```
/buton-mesaj mesaj: Test mesajı
```

### 2. Bot Mesaj Gönderir:
```
📨 Test mesajı
[👆 Tıkla!]
```

### 3. Butona Tıkla:
- Sadece sen görürsün: "✅ @sen butona tıkladı!"
- Buton kaybolmaz
- Tekrar tıklayabilirsin

### 4. Başkaları da Tıklayabilir:
- Her kullanıcı butona tıklayabilir
- Herkes kendi mesajını görür
- Buton herkese açık

## 🔧 Teknik Detaylar

### Buton Özellikleri:
- **Stil:** Primary (Mavi)
- **Emoji:** 👆
- **Label:** "Tıkla!"
- **Custom ID:** `button_message`

### Mesaj Özellikleri:
- **Ephemeral:** Evet (sadece tıklayan görür)
- **Kalıcı:** Evet (buton kaybolmaz)
- **Sınırsız:** Sınırsız tıklama

## 💡 İpuçları

### 1. Çoklu Butonlar
Gelecekte birden fazla buton eklenebilir:
```javascript
// Örnek: Evet/Hayır butonları
const yesButton = new ButtonBuilder()...
const noButton = new ButtonBuilder()...
```

### 2. Farklı Renkler
Buton stilleri:
- `Primary` - Mavi 🔵
- `Secondary` - Gri ⚪
- `Success` - Yeşil 🟢
- `Danger` - Kırmızı 🔴
- `Link` - Link butonu 🔗

### 3. Emoji Değiştirme
Farklı emojiler kullanabilirsiniz:
- 👆 Tıkla
- ✅ Onayla
- ❌ Reddet
- 🎉 Kutla
- 📝 Kayıt

## 🚀 Gelişmiş Örnekler

### Rol Verme Butonu (Gelecek):
```
/buton-mesaj mesaj: Üye rolü almak için tıkla!
```

### Ticket Oluşturma (Mevcut):
```
/ticket kur #kanal
```

### Anket Sistemi (Gelecek):
```
/buton-mesaj mesaj: Hangi oyunu oynayalım?
[Minecraft] [Valorant] [LOL]
```

## 📊 Kullanım Senaryoları

### 1. Sunucu Kuralları
```
/buton-mesaj mesaj: Kuralları okudum ✅
```
- Üyeler butona tıklayarak onaylar
- Moderatörler kimin okuduğunu görebilir

### 2. Etkinlik Katılımı
```
/buton-mesaj mesaj: Turnuvaya katıl! 🏆
```
- Üyeler butona tıklayarak kaydolur
- Otomatik liste oluşturulur

### 3. Geri Bildirim
```
/buton-mesaj mesaj: Botu beğendiniz mi? 💙
```
- Üyeler görüşlerini bildirir
- İstatistik toplanır

### 4. Bildirim Sistemi
```
/buton-mesaj mesaj: Yeni güncelleme! Detaylar için tıkla 📢
```
- Üyeler bilgilendirilir
- Detaylar gösterilir

## ✅ Özet

**Komut:**
```
/buton-mesaj mesaj: [mesajınız]
```

**Özellikler:**
- ✅ Tıklanabilir buton
- ✅ Buton kaybolmaz
- ✅ Sınırsız kullanım
- ✅ Global komut
- ✅ Her yerde çalışır

**Kullanım Alanları:**
- 📝 Onay sistemleri
- 🎮 Etkinlik kayıtları
- 💬 Geri bildirim
- 📢 Duyurular
- 🎉 Eğlence

Artık butonlu mesajlar oluşturabilirsiniz! 🎉
