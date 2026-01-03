import { YearSection } from '../Year';
import type { Goal } from '../../types';
import { getCurrentYear } from '../../types';
import styles from './GoalList.module.css';

interface GoalListProps {
  goals: Goal[];
  goalsByYear: Record<number, Goal[]>;
  years: number[];
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

export function GoalList({
  goals,
  goalsByYear,
  years,
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
}: GoalListProps) {
  // If no years (no goals), show current year section
  const displayYears = years.length > 0 ? years : [getCurrentYear()];

  if (goals.length === 0) {
    return (
      <div className={styles.container}>
        <YearSection
          year={getCurrentYear()}
          goals={[]}
          getProgress={getProgress}
          onDeleteGoal={onDeleteGoal}
          onEditGoal={onEditGoal}
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
    );
  }

  return (
    <div className={styles.container}>
      {displayYears.map((year) => (
        <YearSection
          key={year}
          year={year}
          goals={goalsByYear[year] || []}
          getProgress={getProgress}
          onDeleteGoal={onDeleteGoal}
          onEditGoal={onEditGoal}
          onAddMonth={onAddMonth}
          onDeleteMonth={onDeleteMonth}
          onAddTask={onAddTask}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
          onAddSubGoal={onAddSubGoal}
          onToggleSubGoal={onToggleSubGoal}
          onDeleteSubGoal={onDeleteSubGoal}
        />
      ))}
    </div>
  );
}
