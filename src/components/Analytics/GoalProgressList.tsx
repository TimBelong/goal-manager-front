import type { Goal } from '../../types';
import styles from './GoalProgressList.module.css';

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
                {item.goal.type === 'plan' ? '📅 План' : '✓ Подцели'}
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

