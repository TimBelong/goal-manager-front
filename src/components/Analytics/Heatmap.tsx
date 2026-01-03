import { useMemo, useState } from 'react';
import type { DailyActivity } from '../../types';
import styles from './Heatmap.module.css';

interface HeatmapProps {
  activity: DailyActivity[];
  year: number;
}

export function Heatmap({ activity, year }: HeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number; x: number; y: number } | null>(null);

  const { weeks, months, activityMap, maxActivity } = useMemo(() => {
    // Create activity map
    const map: Record<string, number> = {};
    let max = 0;
    activity.forEach((a) => {
      map[a.date] = a.tasksCompleted;
      if (a.tasksCompleted > max) max = a.tasksCompleted;
    });

    // Generate all days of the year
    const allDays: Date[] = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    // Start from the Sunday of the week containing Jan 1
    const firstDayOfWeek = startDate.getDay(); // 0 = Sunday
    const adjustedStart = new Date(startDate);
    adjustedStart.setDate(adjustedStart.getDate() - firstDayOfWeek);
    
    // Generate all days from adjusted start to end of year
    const current = new Date(adjustedStart);
    while (current <= endDate) {
      allDays.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    // Add remaining days to complete the last week
    while (allDays.length % 7 !== 0) {
      allDays.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    // Group days into weeks (each week is 7 days, Sunday to Saturday)
    const weeksArr: Date[][] = [];
    for (let i = 0; i < allDays.length; i += 7) {
      weeksArr.push(allDays.slice(i, i + 7));
    }

    // Generate month labels
    const monthLabels: { name: string; week: number }[] = [];
    const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    let lastMonth = -1;
    
    weeksArr.forEach((week, weekIndex) => {
      // Find the first day of this week that's in the target year
      const dayInYear = week.find(d => d.getFullYear() === year);
      if (dayInYear && dayInYear.getMonth() !== lastMonth) {
        monthLabels.push({ name: monthNames[dayInYear.getMonth()], week: weekIndex });
        lastMonth = dayInYear.getMonth();
      }
    });

    return { weeks: weeksArr, months: monthLabels, activityMap: map, maxActivity: max || 1 };
  }, [activity, year]);

  const getLevel = (count: number): number => {
    if (count === 0) return 0;
    const ratio = count / maxActivity;
    if (ratio < 0.25) return 1;
    if (ratio < 0.5) return 2;
    if (ratio < 0.75) return 3;
    return 4;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ru-RU', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const handleMouseEnter = (date: Date, count: number, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredDay({
      date: formatDate(date),
      count,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  };

  const dayLabels = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>📅 Активность за {year} год</h3>
      
      <div className={styles.heatmapWrapper}>
        <div className={styles.dayLabels}>
          {dayLabels.map((day, i) => (
            <span key={day} className={styles.dayLabel}>
              {i % 2 === 1 ? day : ''}
            </span>
          ))}
        </div>

        <div className={styles.gridContainer}>
          <div className={styles.monthLabels}>
            {months.map((month, idx) => (
              <span
                key={`${month.name}-${idx}`}
                className={styles.monthLabel}
                style={{ left: `${month.week * 15}px` }}
              >
                {month.name}
              </span>
            ))}
          </div>

          <div className={styles.grid}>
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className={styles.week}>
                {week.map((date, dayIndex) => {
                  const dateStr = date.toISOString().split('T')[0];
                  const count = activityMap[dateStr] || 0;
                  const level = getLevel(count);
                  const isCurrentYear = date.getFullYear() === year;
                  const isToday = dateStr === new Date().toISOString().split('T')[0];

                  return (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`${styles.day} ${styles[`level${level}`]} ${!isCurrentYear ? styles.outside : ''} ${isToday ? styles.today : ''}`}
                      onMouseEnter={(e) => handleMouseEnter(date, count, e)}
                      onMouseLeave={() => setHoveredDay(null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.legend}>
        <span className={styles.legendLabel}>Меньше</span>
        <div className={`${styles.legendDay} ${styles.level0}`} />
        <div className={`${styles.legendDay} ${styles.level1}`} />
        <div className={`${styles.legendDay} ${styles.level2}`} />
        <div className={`${styles.legendDay} ${styles.level3}`} />
        <div className={`${styles.legendDay} ${styles.level4}`} />
        <span className={styles.legendLabel}>Больше</span>
      </div>

      {hoveredDay && (
        <div
          className={styles.tooltip}
          style={{
            left: hoveredDay.x,
            top: hoveredDay.y,
          }}
        >
          <strong>{hoveredDay.count} задач</strong>
          <span>{hoveredDay.date}</span>
        </div>
      )}
    </div>
  );
}
