import styles from '../styles/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p>&copy; 2024 Norm Bot. Tüm hakları saklıdır.</p>
        <div className={styles.links}>
          <a href="https://discord.gg/your-invite" target="_blank" rel="noopener noreferrer">Discord Sunucusu</a>
          <a href="https://github.com/kursat3131/norm-bot" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>
    </footer>
  );
}