import styles from './StatsCards.module.css';

// Стильные SVG иконки с яркими цветами
const icons = {
  target: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#f97316" strokeWidth="2" fill="none" />
      <circle cx="12" cy="12" r="6" stroke="#ec4899" strokeWidth="2" fill="none" opacity="0.7" />
      <circle cx="12" cy="12" r="2.5" fill="#f97316" />
    </svg>
  ),
  clock: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#f59e0b" strokeWidth="2" fill="none" />
      <path d="M12 6v6l4 2" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  list: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="#8b5cf6" strokeWidth="2" fill="none" />
      <path d="M7 8h10M7 12h10M7 16h6" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

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
      title: 'Цели',
      value: `${completedGoals}/${totalGoals}`,
      subtitle: 'целей выполнено',
      icon: icons.target,
      color: 'var(--accent-primary)',
    },
    {
      title: 'В процессе',
      value: inProgressGoals,
      subtitle: 'целей в работе',
      icon: icons.clock,
      color: 'var(--warning)',
    },
    {
      title: 'Задачи',
      value: `${completedTasks}/${totalTasks}`,
      subtitle: 'задач выполнено',
      icon: icons.list,
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
          <div key={stat.title} className={styles.statCard}>
            <span className={styles.statIcon}>{stat.icon}</span>
            <div className={styles.statInfo}>
              <span className={styles.statTitle}>{stat.title}</span>
              <span className={styles.statValue} style={{ color: stat.color }}>
                {stat.value}
              </span>
              <span className={styles.statSubtitle}>{stat.subtitle}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

