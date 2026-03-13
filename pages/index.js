import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Norm Bot - Discord AI Bot</title>
        <meta name="description" content="Groq AI entegrasyonlu Discord moderasyon botu" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>
            Norm Bot'a Hoş Geldiniz!
          </h1>
          <p className={styles.description}>
            Groq AI entegrasyonlu Discord moderasyon botu. Eğlence, ekonomi ve Minecraft entegrasyonu ile sunucunuzu zenginleştirin.
          </p>
          <button className={styles.ctaButton} onClick={() => window.open('https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot', '_blank')}>
            Botu Sunucuya Ekle
          </button>
        </section>

        <section className={styles.features}>
          <h2>Özellikler</h2>
          <div className={styles.featureGrid}>
            <div className={styles.feature}>
              <h3>🤖 AI Sohbet</h3>
              <p>Groq AI ile akıllı ve doğal sohbet deneyimi</p>
            </div>
            <div className={styles.feature}>
              <h3>🎮 Minecraft Entegrasyonu</h3>
              <p>Discord'dan Minecraft sunucusunu yönetin</p>
            </div>
            <div className={styles.feature}>
              <h3>💰 Ekonomi Sistemi</h3>
              <p>Para kazanma, hayvan avlama ve mağaza sistemi</p>
            </div>
            <div className={styles.feature}>
              <h3>🛡️ Moderasyon</h3>
              <p>Mute, ban, kick ve kanal yönetimi</p>
            </div>
            <div className={styles.feature}>
              <h3>🎉 Eğlence</h3>
              <p>Oyunlar, şakalar ve eğlenceli komutlar</p>
            </div>
            <div className={styles.feature}>
              <h3>🌐 Web Panel</h3>
              <p>Botu web arayüzünden yönetin</p>
            </div>
          </div>
        </section>

        <section className={styles.installation}>
          <h2>Kurulum</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <h3>1. Paketleri Yükleyin</h3>
              <code>npm install</code>
            </div>
            <div className={styles.step}>
              <h3>2. .env Dosyası Oluşturun</h3>
              <pre>
{`DISCORD_TOKEN=your_discord_bot_token
GROQ_API_KEY=your_groq_api_key
CLIENT_ID=your_client_id`}
              </pre>
            </div>
            <div className={styles.step}>
              <h3>3. Botu Başlatın</h3>
              <code>npm start</code>
            </div>
            <div className={styles.step}>
              <h3>4. Slash Komutları Kaydedin</h3>
              <code>npm run deploy</code>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}