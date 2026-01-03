import { useState } from 'react';
import { GoalCard } from '../Goal/GoalCard';
import type { Goal } from '../../types';
import { getCurrentYear } from '../../types';
import styles from './YearSection.module.css';

interface YearSectionProps {
  year: number;
  goals: Goal[];
  getProgress: (goal: Goal) => number;
  onDeleteGoal: (goalId: string) => void;
  onEditGoal: (goal: Goal) => void;
  onAddMonth: (goalId: string, monthName: string, monthOrder: number) => void;
  onDeleteMonth: (goalId: string, monthId: string) => void;
  onAddTask: (goalId: string, monthId: string, text: string) => void;
  onToggleTask: (goalId: string, monthId: string, taskId: string) => void;
  onDeleteTask: (goalId: string, monthId: string, taskId: string) => void;
  onAddSubGoal: (goalId: string, text: string) => void;
  onToggleSubGoal: (goalId: string, subGoalId: string) => void;
  onDeleteSubGoal: (goalId: string, subGoalId: string) => void;
}

export function YearSection({
  year,
  goals,
  getProgress,
  onDeleteGoal,
  onEditGoal,
  onAddMonth,
  onDeleteMonth,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onAddSubGoal,
  onToggleSubGoal,
  onDeleteSubGoal,
}: YearSectionProps) {
  const [isExpanded, setIsExpanded] = useState(year === getCurrentYear());

  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => getProgress(g) === 100).length;
  const overallProgress = totalGoals > 0 
    ? Math.round(goals.reduce((sum, g) => sum + getProgress(g), 0) / totalGoals) 
    : 0;

  return (
    <section className={styles.section}>
      <button className={styles.header} onClick={() => setIsExpanded(!isExpanded)}>
        <div className={styles.headerLeft}>
          <svg
            className={`${styles.chevron} ${isExpanded ? styles.expanded : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
          <h2 className={styles.year}>{year}</h2>
          {year === getCurrentYear() && (
            <span className={styles.currentBadge}>Текущий</span>
          )}
        </div>
        <div className={styles.headerRight}>
          <div className={styles.stats}>
            <span className={styles.statItem}>
              <span className={styles.statValue}>{completedGoals}</span>
              <span className={styles.statLabel}>/{totalGoals} целей</span>
            </span>
            <div className={styles.progressMini}>
              <div className={styles.progressFill} style={{ width: `${overallProgress}%` }} />
            </div>
            <span className={styles.progressPercent}>{overallProgress}%</span>
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className={styles.content}>
          {goals.length === 0 ? (
            <div className={styles.empty}>
              Нет целей на {year} год
            </div>
          ) : (
            <div className={styles.goalsList}>
              {goals.map((goal, index) => (
                <div key={goal.id} style={{ animationDelay: `${index * 50}ms` }} className={styles.goalItem}>
                  <GoalCard
                    goal={goal}
                    progress={getProgress(goal)}
                    onDelete={onDeleteGoal}
                    onEdit={onEditGoal}
                    onAddMonth={onAddMonth}
                    onDeleteMonth={onDeleteMonth}
                    onAddTask={onAddTask}
                    onToggleTask={onToggleTask}
                    onDeleteTask={onDeleteTask}
                    onAddSubGoal={onAddSubGoal}
                    onToggleSubGoal={onToggleSubGoal}
                    onDeleteSubGoal={onDeleteSubGoal}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

