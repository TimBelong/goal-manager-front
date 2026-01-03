import { useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from './useLocalStorage';
import type { Goal, GoalType, Month, Task, SubGoal, DailyActivity } from '../types';
import { getCurrentYear } from '../types';

export function useGoals() {
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);
  const [dailyActivity, setDailyActivity] = useLocalStorage<DailyActivity[]>('dailyActivity', []);

  const addGoal = useCallback((title: string, description: string, type: GoalType, year?: number) => {
    const newGoal: Goal = {
      id: uuidv4(),
      title,
      description,
      type,
      createdAt: new Date().toISOString(),
      year: year ?? getCurrentYear(),
      ...(type === 'plan' ? { plan: { id: uuidv4(), months: [] } } : { subGoals: [] }),
    };
    setGoals((prev) => [...prev, newGoal]);
    return newGoal;
  }, [setGoals]);

  const deleteGoal = useCallback((goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  }, [setGoals]);

  const addMonth = useCallback((goalId: string, monthName: string, monthOrder: number) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId && goal.plan) {
          const exists = goal.plan.months.some((m) => m.name === monthName);
          if (exists) return goal;
          
          const newMonth: Month = {
            id: uuidv4(),
            name: monthName,
            order: monthOrder,
            tasks: [],
          };
          return {
            ...goal,
            plan: {
              ...goal.plan,
              months: [...goal.plan.months, newMonth].sort((a, b) => a.order - b.order),
            },
          };
        }
        return goal;
      })
    );
  }, [setGoals]);

  const deleteMonth = useCallback((goalId: string, monthId: string) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId && goal.plan) {
          return {
            ...goal,
            plan: {
              ...goal.plan,
              months: goal.plan.months.filter((m) => m.id !== monthId),
            },
          };
        }
        return goal;
      })
    );
  }, [setGoals]);

  const addTask = useCallback((goalId: string, monthId: string, text: string) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId && goal.plan) {
          return {
            ...goal,
            plan: {
              ...goal.plan,
              months: goal.plan.months.map((month) => {
                if (month.id === monthId) {
                  const newTask: Task = {
                    id: uuidv4(),
                    text,
                    completed: false,
                  };
                  return { ...month, tasks: [...month.tasks, newTask] };
                }
                return month;
              }),
            },
          };
        }
        return goal;
      })
    );
  }, [setGoals]);

  const recordActivity = useCallback((date: string) => {
    setDailyActivity((prev) => {
      const existing = prev.find((a) => a.date === date);
      if (existing) {
        return prev.map((a) =>
          a.date === date ? { ...a, tasksCompleted: a.tasksCompleted + 1 } : a
        );
      }
      return [...prev, { date, tasksCompleted: 1 }];
    });
  }, [setDailyActivity]);

  const toggleTask = useCallback((goalId: string, monthId: string, taskId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId && goal.plan) {
          return {
            ...goal,
            plan: {
              ...goal.plan,
              months: goal.plan.months.map((month) => {
                if (month.id === monthId) {
                  return {
                    ...month,
                    tasks: month.tasks.map((task) => {
                      if (task.id === taskId) {
                        const newCompleted = !task.completed;
                        if (newCompleted) {
                          recordActivity(today);
                        }
                        return {
                          ...task,
                          completed: newCompleted,
                          completedAt: newCompleted ? today : undefined,
                        };
                      }
                      return task;
                    }),
                  };
                }
                return month;
              }),
            },
          };
        }
        return goal;
      })
    );
  }, [setGoals, recordActivity]);

  const deleteTask = useCallback((goalId: string, monthId: string, taskId: string) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId && goal.plan) {
          return {
            ...goal,
            plan: {
              ...goal.plan,
              months: goal.plan.months.map((month) => {
                if (month.id === monthId) {
                  return {
                    ...month,
                    tasks: month.tasks.filter((t) => t.id !== taskId),
                  };
                }
                return month;
              }),
            },
          };
        }
        return goal;
      })
    );
  }, [setGoals]);

  const addSubGoal = useCallback((goalId: string, text: string) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId && goal.subGoals) {
          const newSubGoal: SubGoal = {
            id: uuidv4(),
            text,
            completed: false,
          };
          return { ...goal, subGoals: [...goal.subGoals, newSubGoal] };
        }
        return goal;
      })
    );
  }, [setGoals]);

  const toggleSubGoal = useCallback((goalId: string, subGoalId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId && goal.subGoals) {
          return {
            ...goal,
            subGoals: goal.subGoals.map((sg) => {
              if (sg.id === subGoalId) {
                const newCompleted = !sg.completed;
                if (newCompleted) {
                  recordActivity(today);
                }
                return {
                  ...sg,
                  completed: newCompleted,
                  completedAt: newCompleted ? today : undefined,
                };
              }
              return sg;
            }),
          };
        }
        return goal;
      })
    );
  }, [setGoals, recordActivity]);

  const deleteSubGoal = useCallback((goalId: string, subGoalId: string) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId && goal.subGoals) {
          return {
            ...goal,
            subGoals: goal.subGoals.filter((sg) => sg.id !== subGoalId),
          };
        }
        return goal;
      })
    );
  }, [setGoals]);

  const getProgress = useCallback((goal: Goal): number => {
    if (goal.type === 'plan' && goal.plan) {
      const allTasks = goal.plan.months.flatMap((m) => m.tasks);
      if (allTasks.length === 0) return 0;
      const completed = allTasks.filter((t) => t.completed).length;
      return Math.round((completed / allTasks.length) * 100);
    }
    if (goal.type === 'subgoals' && goal.subGoals) {
      if (goal.subGoals.length === 0) return 0;
      const completed = goal.subGoals.filter((sg) => sg.completed).length;
      return Math.round((completed / goal.subGoals.length) * 100);
    }
    return 0;
  }, []);

  // Get unique years from goals
  const years = useMemo(() => {
    const yearSet = new Set(goals.map((g) => g.year ?? getCurrentYear()));
    return Array.from(yearSet).sort((a, b) => b - a); // descending
  }, [goals]);

  // Group goals by year
  const goalsByYear = useMemo(() => {
    const grouped: Record<number, Goal[]> = {};
    goals.forEach((goal) => {
      const year = goal.year ?? getCurrentYear();
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(goal);
    });
    return grouped;
  }, [goals]);

  // Add a new year (years are derived from goals, so this is a no-op placeholder)
  const addYear = useCallback((_year: number) => {
    // Years are automatically derived from goals
    // This function exists as a placeholder for future functionality
  }, []);

  return {
    goals,
    dailyActivity,
    years,
    goalsByYear,
    addGoal,
    deleteGoal,
    addMonth,
    deleteMonth,
    addTask,
    toggleTask,
    deleteTask,
    addSubGoal,
    toggleSubGoal,
    deleteSubGoal,
    getProgress,
    addYear,
  };
}
