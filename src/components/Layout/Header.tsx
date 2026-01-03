import { Button, ThemeToggle } from '../UI';
import { Navigation } from './Navigation';
import type { Theme } from '../../types';
import type { Page } from './Navigation';
import styles from './Header.module.css';

interface HeaderProps {
  theme: Theme;
  onThemeToggle: () => void;
  onAddGoal: () => void;
  currentPage: Page;
  onPageChange: (page: Page) => void;
  userName?: string;
  onLogout?: () => void;
}

export function Header({ 
  theme, 
  onThemeToggle, 
  onAddGoal, 
  currentPage, 
  onPageChange,
  userName,
  onLogout
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.title}>
          <span><img src="/arrow.png" alt="Arrow" width={40} height={40} /></span>
          Goals Track
        </h1>
        <Navigation currentPage={currentPage} onPageChange={onPageChange} />
      </div>
      <div className={styles.right}>
        {currentPage === 'goals' && (
          <Button onClick={onAddGoal}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Новая цель
          </Button>
        )}
        <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        
        {userName && (
          <div className={styles.userInfo}>
            <span className={styles.userName}>{userName}</span>
            {onLogout && (
              <button 
                onClick={onLogout} 
                className={styles.logoutBtn}
                title="Выйти"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16,17 21,12 16,7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
