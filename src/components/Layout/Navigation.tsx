import styles from './Navigation.module.css';

export type Page = 'goals' | 'analytics';

interface NavigationProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  return (
    <nav className={styles.nav}>
      <button
        className={`${styles.navItem} ${currentPage === 'goals' ? styles.active : ''}`}
        onClick={() => onPageChange('goals')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
        <span>Цели</span>
      </button>
      <button
        className={`${styles.navItem} ${currentPage === 'analytics' ? styles.active : ''}`}
        onClick={() => onPageChange('analytics')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 20V10M12 20V4M6 20v-6" />
        </svg>
        <span>Аналитика</span>
      </button>
    </nav>
  );
}

