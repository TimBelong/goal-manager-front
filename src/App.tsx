import { useState } from 'react';
import { Header } from './components/Layout';
import type { Page } from './components/Layout';
import { GoalForm, GoalList } from './components/Goal';
import { AnalyticsPage } from './components/Analytics';
import { LoginPage, RegisterPage } from './pages';
import { useGoals } from './hooks/useGoals';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './contexts/AuthContext';
import './styles/globals.css';

type AuthPage = 'login' | 'register';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('goals');
  const [authPage, setAuthPage] = useState<AuthPage>('login');
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, isLoading, user, logout } = useAuth();
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="app" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎯</div>
          <div>Загрузка...</div>
        </div>
      </div>
    );
  }

  // Show auth pages if not authenticated
  if (!isAuthenticated) {
    if (authPage === 'login') {
      return <LoginPage onSwitchToRegister={() => setAuthPage('register')} />;
    }
    return <RegisterPage onSwitchToLogin={() => setAuthPage('login')} />;
  }

  return (
    <div className="app">
      <Header
        theme={theme}
        onThemeToggle={toggleTheme}
        onAddGoal={() => setShowForm(true)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        userName={user?.name}
        onLogout={logout}
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
