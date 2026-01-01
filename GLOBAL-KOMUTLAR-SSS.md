# 🌍 Global Komutlar - Sık Sorulan Sorular

## ❓ Botun bir sunucuda olması gerekir mi?

**HAYIR!** Global komutlar için botun herhangi bir sunucuda olması gerekmez.

### ✅ Nasıl Çalışır?

1. **Komutları Kaydet:**
   ```bash
   npm run deploy
   ```

2. **Discord API'ye Gönderilir:**
   - Komutlar Discord'un sunucularına kaydedilir
   - Bot online bile olmasa komutlar kaydedilir

3. **1 Saat İçinde Aktif Olur:**
   - Global komutlar tüm Discord'a yayılır
   - Botun olmadığı sunucularda bile görünür

### 🎯 Global vs Guild Komutlar

| Özellik | Global Komutlar | Guild Komutlar |
|---------|----------------|----------------|
| **Kapsam** | Tüm Discord | Sadece belirli sunucu |
| **Aktif Olma** | ~1 saat | Anında |
| **Bot Gerekli mi?** | Hayır | Evet |
| **Kullanım** | Her yerde | Sadece o sunucuda |

## 🔧 Hatalar ve Çözümler

### 1. "Cannot use 'in' operator to search for 'ephemeral'"

**Sebep:** `interaction.reply()` string yerine object bekliyor.

**Yanlış:**
```javascript
await interaction.reply(mesaj);
```

**Doğru:**
```javascript
await interaction.reply({ content: mesaj });
```

✅ **Düzeltildi!**

### 2. "Supplying ephemeral is deprecated"

**Sebep:** `ephemeral: true` yerine `flags: 64` kullanılmalı.

**Yanlış:**
```javascript
await interaction.reply({ content: 'Mesaj', ephemeral: true });
```

**Doğru:**
```javascript
await interaction.reply({ content: 'Mesaj', flags: 64 });
```

✅ **Düzeltildi!**

## 🚀 Global Komut Test Etme

### Adım 1: Komutları Kaydet
```bash
npm run deploy
```

**Çıktı:**
```
✅ Slash komutu yüklendi: mesaj
✅ 2 slash komutu başarıyla kaydedildi!
```

### Adım 2: Bekle
- ⏰ Global komutlar 1 saat içinde aktif olur
- 💡 Test için guild-specific komutlar kullanabilirsiniz (anında aktif)

### Adım 3: Test Et

**Kendi Sunucunuzda:**
```
/mesaj metin: Test mesajı
```

**Başka Sunucularda:**
- Botun olmadığı bir sunucuya gidin
- `/mesaj` yazın
- Komut görünmeli!

**DM'de:**
- Botla DM açın
- `/mesaj metin: Merhaba!`
- Çalışmalı!

## 🎮 Komut Türleri

### Global Komutlar (Mevcut)
- ✅ `/mesaj` - Her yerde çalışır
- ✅ `/sunucu-bilgi` - Her yerde çalışır

### Prefix Komutlar (Mevcut)
- ✅ `!yardım`
- ✅ `!ekonomi`
- ✅ `!avlan`
- ✅ Ve 40+ komut daha!

## 💡 İpuçları

### 1. Test İçin Guild Komutlar
Hızlı test için guild-specific komutlar kullanın:

```javascript
// deploy-commands.js içinde
// Global yerine guild-specific
await rest.put(
  Routes.applicationGuildCommands(config.clientId, 'GUILD_ID'),
  { body: commands },
);
```

### 2. Komut Güncelleme
Komut değiştirdiğinizde:
```bash
npm run deploy
```

### 3. Komut Silme
Tüm global komutları silmek için:
```bash
# deploy-commands.js'de body: [] gönderin
```

## 🔗 Faydalı Linkler

- [Discord.js Guide](https://discordjs.guide/)
- [Discord Developer Portal](https://discord.com/developers/applications)
- [Slash Commands Docs](https://discord.com/developers/docs/interactions/application-commands)

## ✅ Özet

1. ❌ **Botun sunucuda olması gerekmez**
2. ✅ **`npm run deploy` yeterli**
3. ⏰ **1 saat içinde aktif olur**
4. 🌍 **Her yerde çalışır**
5. 💬 **DM'lerde de çalışır**

Artık global komutlarınız hazır! 🎉
