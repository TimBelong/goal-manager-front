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
}

export function Header({ theme, onThemeToggle, onAddGoal, currentPage, onPageChange }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.title}>
          <span>🎯</span>
          Goal Tracker
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
      </div>
    </header>
  );
}
