import { useState } from 'react';
import { Button, Input, Select, ConfirmModal } from '../UI';
import { MonthCard } from '../Plan';
import { SubGoalItem } from '../SubGoal';
import type { Goal } from '../../types';
import { MONTHS_LIST } from '../../types';
import styles from './GoalCard.module.css';

interface GoalCardProps {
  goal: Goal;
  progress: number;
  onDelete: (goalId: string) => void;
  onAddMonth: (goalId: string, monthName: string, monthOrder: number) => void;
  onDeleteMonth: (goalId: string, monthId: string) => void;
  onAddTask: (goalId: string, monthId: string, text: string) => void;
  onToggleTask: (goalId: string, monthId: string, taskId: string) => void;
  onDeleteTask: (goalId: string, monthId: string, taskId: string) => void;
  onAddSubGoal: (goalId: string, text: string) => void;
  onToggleSubGoal: (goalId: string, subGoalId: string) => void;
  onDeleteSubGoal: (goalId: string, subGoalId: string) => void;
}

export function GoalCard({
  goal,
  progress,
  onDelete,
  onAddMonth,
  onDeleteMonth,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onAddSubGoal,
  onToggleSubGoal,
  onDeleteSubGoal,
}: GoalCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddMonth, setShowAddMonth] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [showAddSubGoal, setShowAddSubGoal] = useState(false);
  const [subGoalText, setSubGoalText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const usedMonths = goal.plan?.months.map((m) => m.name) || [];
  const availableMonths = MONTHS_LIST.filter((m) => !usedMonths.includes(m.name));

  const handleAddMonth = () => {
    if (selectedMonth) {
      const month = MONTHS_LIST.find((m) => m.name === selectedMonth);
      if (month) {
        onAddMonth(goal.id, month.name, month.order);
        setSelectedMonth('');
        setShowAddMonth(false);
      }
    }
  };

  const handleAddSubGoal = () => {
    if (subGoalText.trim()) {
      onAddSubGoal(goal.id, subGoalText.trim());
      setSubGoalText('');
      setShowAddSubGoal(false);
    }
  };

  const handleSubGoalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddSubGoal();
    } else if (e.key === 'Escape') {
      setShowAddSubGoal(false);
      setSubGoalText('');
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <button className={styles.expandBtn} onClick={() => setIsExpanded(!isExpanded)}>
            <svg
              className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <div className={styles.titleArea}>
            <h3 className={styles.title}>{goal.title}</h3>
            {goal.description && <p className={styles.description}>{goal.description}</p>}
          </div>
          <div className={styles.actions}>
            <span className={`${styles.badge} ${goal.type === 'plan' ? styles.badgePlan : styles.badgeSubgoals}`}>
              {goal.type === 'plan' ? 'План' : 'Подцели'}
            </span>
            <button
              className={styles.deleteBtn}
              onClick={() => setShowDeleteConfirm(true)}
              aria-label="Удалить цель"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        </div>
        <div className={styles.progressSection}>
          <div className={styles.progressInfo}>
            <span className={styles.progressLabel}>Прогресс</span>
            <span className={styles.progressValue}>{progress}%</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className={styles.content}>
          {goal.type === 'plan' && goal.plan && (
            <>
              <div className={styles.monthsGrid}>
                {goal.plan.months.map((month) => (
                  <MonthCard
                    key={month.id}
                    month={month}
                    goalId={goal.id}
                    onAddTask={onAddTask}
                    onToggleTask={onToggleTask}
                    onDeleteTask={onDeleteTask}
                    onDeleteMonth={onDeleteMonth}
                  />
                ))}
              </div>

              {availableMonths.length > 0 && (
                showAddMonth ? (
                  <div className={styles.addMonthForm}>
                    <Select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      options={[
                        { value: '', label: 'Выберите месяц...', disabled: true },
                        ...availableMonths.map((m) => ({ value: m.name, label: m.name })),
                      ]}
                    />
                    <div className={styles.addMonthActions}>
                      <Button size="sm" onClick={handleAddMonth} disabled={!selectedMonth}>
                        Добавить
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => { setShowAddMonth(false); setSelectedMonth(''); }}>
                        Отмена
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button className={styles.addMonthBtn} onClick={() => setShowAddMonth(true)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    Добавить месяц
                  </button>
                )
              )}
            </>
          )}

          {goal.type === 'subgoals' && goal.subGoals && (
            <>
              <div className={styles.subGoalsList}>
                {goal.subGoals.map((subGoal, index) => (
                  <div key={subGoal.id} className={styles.subGoalItem} style={{ animationDelay: `${index * 50}ms` }}>
                    <SubGoalItem
                      subGoal={subGoal}
                      onToggle={() => onToggleSubGoal(goal.id, subGoal.id)}
                      onDelete={() => onDeleteSubGoal(goal.id, subGoal.id)}
                    />
                  </div>
                ))}
              </div>

              {showAddSubGoal ? (
                <div className={styles.addSubGoalForm}>
                  <Input
                    value={subGoalText}
                    onChange={(e) => setSubGoalText(e.target.value)}
                    onKeyDown={handleSubGoalKeyDown}
                    placeholder="Название подцели..."
                    autoFocus
                  />
                  <div className={styles.addSubGoalActions}>
                    <Button size="sm" onClick={handleAddSubGoal} disabled={!subGoalText.trim()}>
                      Добавить
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { setShowAddSubGoal(false); setSubGoalText(''); }}>
                      Отмена
                    </Button>
                  </div>
                </div>
              ) : (
                <button className={styles.addSubGoalBtn} onClick={() => setShowAddSubGoal(true)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Добавить подцель
                </button>
              )}
            </>
          )}
        </div>
      )}

      {showDeleteConfirm && (
        <ConfirmModal
          title="Удалить цель?"
          message={`Вы уверены, что хотите удалить цель "${goal.title}"? Это действие нельзя отменить.`}
          confirmText="Удалить"
          cancelText="Отмена"
          variant="danger"
          onConfirm={() => {
            onDelete(goal.id);
            setShowDeleteConfirm(false);
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}

