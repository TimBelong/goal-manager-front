import type { Goal } from '../../types';
import styles from './GoalProgressList.module.css';

const icons = {
  calendar: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="#3b82f6" strokeWidth="2" fill="none" />
      <line x1="16" y1="2" x2="16" y2="6" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="2" x2="8" y2="6" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
      <line x1="3" y1="10" x2="21" y2="10" stroke="#3b82f6" strokeWidth="2" />
    </svg>
  ),
  layers: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <polygon points="12 2 2 7 12 12 22 7 12 2" stroke="#a855f7" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <polyline points="2 17 12 22 22 17" stroke="#ec4899" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="2 12 12 17 22 12" stroke="#a855f7" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    </svg>
  ),
};

interface GoalProgressItem {
  goal: Goal;
  progress: number;
  totalTasks: number;
  completedTasks: number;
}

interface GoalProgressListProps {
  goalProgress: GoalProgressItem[];
}

export function GoalProgressList({ goalProgress }: GoalProgressListProps) {
  if (goalProgress.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Нет целей для отображения</p>
      </div>
    );
  }

  const sortedGoals = [...goalProgress].sort((a, b) => b.progress - a.progress);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Прогресс по целям</h3>
      <div className={styles.list}>
        {sortedGoals.map((item, index) => (
          <div
            key={item.goal.id}
            className={styles.item}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={styles.header}>
              <span className={styles.goalTitle}>{item.goal.title}</span>
              <span className={styles.tasks}>
                {item.completedTasks}/{item.totalTasks}
              </span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progressFill} ${getProgressClass(item.progress)}`}
                style={{ width: `${item.progress}%` }}
              />
            </div>
            <div className={styles.footer}>
              <span className={styles.type}>
                {item.goal.type === 'plan' ? <>{icons.calendar} План</> : <>{icons.layers} Подцели</>}
              </span>
              <span className={`${styles.percentage} ${getProgressClass(item.progress)}`}>
                {item.progress}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getProgressClass(progress: number): string {
  if (progress === 100) return styles.complete;
  if (progress >= 70) return styles.good;
  if (progress >= 40) return styles.warning;
  return styles.danger;
}

