import { useState } from 'react';
import { Header } from './components/Layout';
import type { Page } from './components/Layout';
import { GoalForm, GoalList } from './components/Goal';
import { AnalyticsPage } from './components/Analytics';
import { useGoals } from './hooks/useGoals';
import { useTheme } from './hooks/useTheme';
import './styles/globals.css';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('goals');
  const { theme, toggleTheme } = useTheme();
  const {
    goals,
    years,
    goalsByYear,
    dailyActivity,
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
  } = useGoals();

  const handleAddGoal = (title: string, description: string, type: 'plan' | 'subgoals', year: number) => {
    addGoal(title, description, type, year);
    setShowForm(false);
  };

  return (
    <div className="app">
      <Header
        theme={theme}
        onThemeToggle={toggleTheme}
        onAddGoal={() => setShowForm(true)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      <main>
        {currentPage === 'goals' && (
          <GoalList
            goals={goals}
            goalsByYear={goalsByYear}
            years={years}
            getProgress={getProgress}
            onDeleteGoal={deleteGoal}
            onAddMonth={addMonth}
            onDeleteMonth={deleteMonth}
            onAddTask={addTask}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
            onAddSubGoal={addSubGoal}
            onToggleSubGoal={toggleSubGoal}
            onDeleteSubGoal={deleteSubGoal}
          />
        )}

        {currentPage === 'analytics' && (
          <AnalyticsPage
            goals={goals}
            dailyActivity={dailyActivity}
            years={years}
            getProgress={getProgress}
          />
        )}
      </main>

      {showForm && (
        <GoalForm
          onSubmit={handleAddGoal}
          onCancel={() => setShowForm(false)}
          availableYears={years}
        />
      )}
    </div>
  );
}

export default App;
