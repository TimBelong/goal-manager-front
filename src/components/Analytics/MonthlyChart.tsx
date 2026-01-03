import styles from './MonthlyChart.module.css';

interface MonthData {
  month: string;
  completed: number;
  total: number;
  percentage: number;
}

interface MonthlyChartProps {
  data: MonthData[];
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  const maxTotal = Math.max(...data.map((d) => d.total), 1);
  const currentMonth = new Date().getMonth();

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Прогресс по месяцам</h3>
      <div className={styles.chart}>
        {data.map((item, index) => {
          const barHeight = item.total > 0 ? (item.total / maxTotal) * 100 : 10;
          const fillHeight = item.total > 0 ? (item.completed / item.total) * 100 : 0;
          const isCurrent = index === currentMonth;

          return (
            <div
              key={item.month}
              className={`${styles.barContainer} ${isCurrent ? styles.current : ''}`}
            >
              <div className={styles.barWrapper}>
                <div
                  className={styles.bar}
                  style={{ height: `${barHeight}%` }}
                >
                  <div
                    className={styles.barFill}
                    style={{ height: `${fillHeight}%` }}
                  />
                </div>
              </div>
              <span className={styles.label}>{item.month}</span>
              {item.total > 0 && (
                <span className={styles.value}>{item.percentage}%</span>
              )}
            </div>
          );
        })}
      </div>
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.total}`} />
          <span>Всего задач</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.completed}`} />
          <span>Выполнено</span>
        </div>
      </div>
    </div>
  );
}

