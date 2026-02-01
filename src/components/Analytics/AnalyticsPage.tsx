import { useState } from 'react';
import { StatsCards } from './StatsCards';
import { GoalProgressList } from './GoalProgressList';
import { MonthlyChart } from './MonthlyChart';
import { Heatmap } from './Heatmap';
import { Select } from '../UI';
import { useAnalytics } from '../../hooks/useAnalytics';
import type { Goal, DailyActivity } from '../../types';
import { getCurrentYear } from '../../types';
import styles from './AnalyticsPage.module.css';

interface AnalyticsPageProps {
  goals: Goal[];
  dailyActivity: DailyActivity[];
  years: number[];
  getProgress: (goal: Goal) => number;
}

export function AnalyticsPage({
  goals,
  dailyActivity,
  years,
  getProgress,
}: AnalyticsPageProps) {
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const { analytics, activityByYear } = useAnalytics(goals, dailyActivity, getProgress, selectedYear);

  const yearOptions = years.length > 0
    ? years.map((y) => ({ value: y.toString(), label: y.toString() }))
    : [{ value: getCurrentYear().toString(), label: getCurrentYear().toString() }];

  const chartIcon = (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" style={{ marginRight: '10px', verticalAlign: 'middle' }}>
      <rect x="17" y="10" width="4" height="10" rx="1" fill="#a855f7" />
      <rect x="10" y="4" width="4" height="16" rx="1" fill="#8b5cf6" />
      <rect x="3" y="14" width="4" height="6" rx="1" fill="#6366f1" />
    </svg>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{chartIcon}Аналитика</h2>
        <Select
          value={selectedYear.toString()}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          options={yearOptions}
        />
      </div>

      <StatsCards
        totalGoals={analytics.totalGoals}
        completedGoals={analytics.completedGoals}
        inProgressGoals={analytics.inProgressGoals}
        totalTasks={analytics.totalTasks}
        completedTasks={analytics.completedTasks}
        overallProgress={analytics.overallProgress}
      />

      <div className={styles.grid}>
        <GoalProgressList goalProgress={analytics.goalProgress} />
        <MonthlyChart data={analytics.monthlyProgress} />
      </div>

      <Heatmap activity={activityByYear} year={selectedYear} />
    </div>
  );
}

