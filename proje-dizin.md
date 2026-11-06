# Proje Dizin Yapısı (norm-bot)

```
norm-bot/
├── .env                            # Ortam değişkenleri ve API anahtarları (gizli)
├── .env.example                    # Örnek ortam değişkenleri şablonu
├── .gitignore
├── AGENTS.md
├── BUTON-ORNEKLERI.md
├── config.js                       # Bot ana yapılandırması (token, model, client id)
├── deploy-commands.js              # Discord slash komutlarını REST ile kaydeden betik
├── GLOBAL-KOMUT-TEST.md
├── GLOBAL-KOMUTLAR-SSS.md
├── index.js                        # Ana Discord bot giriş noktası ve event dinleyicileri
├── KURULUM-TALIMATLARI.md
├── MINECRAFT-HATA-COZUM.md
├── package-lock.json
├── package.json                    # Bağımlılıklar ve çalıştırma scriptleri
├── proje-dizin.md                  # Proje dizin haritası
├── README.md
├── SLASH-COMMANDS.md
├── vercel.json
├── welcome-config.json             # Sunucu hoş geldin kanalı ayarları
│
├── commands/                       # Discord komut dosyaları
│   ├── ai.js                       # Groq AI komutu
│   ├── anket.js
│   ├── avlan.js
│   ├── bakiye.js
│   ├── balik-tut.js
│   ├── ban.js
│   ├── buton-mesaj.js
│   ├── calis.js
│   ├── cekilis.js
│   ├── coinflip.js
│   ├── dilenci.js
│   ├── ekonomi.js
│   ├── envanter.js
│   ├── gif.js
│   ├── gunluk.js
│   ├── hatirlatici.js
│   ├── hayvanlar.js
│   ├── hosgeldin.js
│   ├── index.js                    # Komut yükleyici (loadCommands)
│   ├── kanal-olustur.js
│   ├── kick.js
│   ├── lider.js
│   ├── magaza.js
│   ├── mc-bagla.js
│   ├── mc-collect.js
│   ├── mc-durum.js
│   ├── mc-hafiza.js
│   ├── mc-komut.js
│   ├── mc-mesaj.js
│   ├── mc-mine.js
│   ├── mc-msg.js
│   ├── mesaj.js
│   ├── mute.js
│   ├── op.js
│   ├── otorol.js
│   ├── rulet.js
│   ├── sablon.js
│   ├── saka.js
│   ├── saril.js
│   ├── sat.js
│   ├── sayi-tahmin.js
│   ├── slot.js
│   ├── soygun.js
│   ├── sunucu-bilgi.js
│   ├── tas-kagit-makas.js
│   ├── temizle.js
│   ├── ticket.js
│   ├── unmute.js
│   ├── yardim.js
│   └── zar.js
│
├── economy/                        # Ekonomi modülü
│   ├── animals.js                  # Hayvan listesi ve değerleri
│   ├── database.js                 # JSON tabanlı kullanıcı veri yöneticisi
│   └── users.json                  # Kullanıcı bakiye ve envanter verileri
│
├── minecraft/                      # Minecraft bot modülü (Mineflayer)
│   ├── abilities.js                # Bot yetenekleri (madencilik, toplama, savaş vb.)
│   ├── bot.js                      # Bot bağlantı ve durum yönetimi
│   ├── memory.js                   # Oyuncu etkileşim hafızası
│   └── memory.json                 # Hafıza veritabanı
│
├── web/                            # Express tabanlı web arayüzü ve API
│   ├── server.js                   # Express + Socket.IO sunucusu
│   ├── public/                     # Statik dosyalar
│   │   ├── css/
│   │   │   ├── inventory.css
│   │   │   └── style.css
│   │   └── js/
│   │       ├── inventory.js
│   │       └── minecraft.js
│   └── views/                      # EJS şablonları
│       ├── dashboard.ejs
│       ├── discord.ejs
│       ├── inventory.ejs
│       ├── login.ejs
│       ├── minecraft.ejs
│       └── partials/
│           └── header.ejs
│
├── components/                     # (Next.js statik site bileşenleri)
│   ├── Footer.js
│   └── Header.js
│
├── pages/                          # (Next.js statik site sayfaları)
│   ├── _app.js
│   └── index.js
│
└── styles/                         # (Next.js stil dosyaları)
    ├── Footer.module.css
    ├── globals.css
    ├── Header.module.css
    └── Home.module.css
```
