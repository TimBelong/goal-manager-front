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
import analyticIcon from '../../assets/analitic.png';

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
    <img src={analyticIcon} alt="Аналитика" width="40" height="40" style={{ marginRight: '10px', verticalAlign: 'middle' }} />
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

