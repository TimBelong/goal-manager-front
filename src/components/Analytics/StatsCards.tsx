import styles from './StatsCards.module.css';

interface StatsCardsProps {
  totalGoals: number;
  completedGoals: number;
  inProgressGoals: number;
  totalTasks: number;
  completedTasks: number;
  overallProgress: number;
}

export function StatsCards({
  totalGoals,
  completedGoals,
  inProgressGoals,
  totalTasks,
  completedTasks,
  overallProgress,
}: StatsCardsProps) {
  const stats = [
    {
      label: 'Всего целей',
      value: totalGoals,
      icon: '🎯',
      color: 'var(--accent-primary)',
    },
    {
      label: 'Выполнено',
      value: completedGoals,
      icon: '✅',
      color: 'var(--success)',
    },
    {
      label: 'В процессе',
      value: inProgressGoals,
      icon: '⏳',
      color: 'var(--warning)',
    },
    {
      label: 'Всего задач',
      value: totalTasks,
      icon: '📋',
      color: 'var(--text-muted)',
    },
    {
      label: 'Задач выполнено',
      value: completedTasks,
      icon: '✓',
      color: 'var(--success)',
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.progressCard}>
        <div className={styles.progressRing}>
          <svg viewBox="0 0 120 120">
            <circle
              className={styles.progressBg}
              cx="60"
              cy="60"
              r="50"
              strokeWidth="10"
              fill="none"
            />
            <circle
              className={styles.progressFill}
              cx="60"
              cy="60"
              r="50"
              strokeWidth="10"
              fill="none"
              strokeDasharray={`${overallProgress * 3.14} 314`}
              strokeLinecap="round"
            />
          </svg>
          <div className={styles.progressValue}>
            <span className={styles.progressNumber}>{overallProgress}</span>
            <span className={styles.progressPercent}>%</span>
          </div>
        </div>
        <div className={styles.progressLabel}>Общий прогресс</div>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <span className={styles.statIcon}>{stat.icon}</span>
            <div className={styles.statInfo}>
              <span className={styles.statValue} style={{ color: stat.color }}>
                {stat.value}
              </span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

