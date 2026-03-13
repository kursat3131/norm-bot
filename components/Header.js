import Link from 'next/link';
import styles from '../styles/Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <Link href="/">
            <h1>Norm Bot</h1>
          </Link>
        </div>
        <ul className={styles.navLinks}>
          <li><Link href="/">Ana Sayfa</Link></li>
          <li><Link href="#features">Özellikler</Link></li>
          <li><Link href="#installation">Kurulum</Link></li>
          <li><a href="https://github.com/kursat3131/norm-bot" target="_blank" rel="noopener noreferrer">GitHub</a></li>
        </ul>
      </nav>
    </header>
  );
}