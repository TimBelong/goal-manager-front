import { useState } from 'react';
import { Button, Input, ConfirmModal } from '../UI';
import { TaskItem } from './TaskItem';
import type { Month } from '../../types';
import styles from './MonthCard.module.css';

interface MonthCardProps {
  month: Month;
  goalId: string;
  onAddTask: (goalId: string, monthId: string, text: string) => void;
  onToggleTask: (goalId: string, monthId: string, taskId: string) => void;
  onDeleteTask: (goalId: string, monthId: string, taskId: string) => void;
  onDeleteMonth: (goalId: string, monthId: string) => void;
}

export function MonthCard({
  month,
  goalId,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onDeleteMonth,
}: MonthCardProps) {
  const [taskText, setTaskText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const completedCount = month.tasks.filter((t) => t.completed).length;
  const totalCount = month.tasks.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleAddTask = () => {
    if (taskText.trim()) {
      onAddTask(goalId, month.id, taskText.trim());
      setTaskText('');
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setTaskText('');
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h4 className={styles.title}>{month.name}</h4>
          <button
            className={styles.deleteBtn}
            onClick={() => setShowDeleteConfirm(true)}
            aria-label="Удалить месяц"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className={styles.stats}>
          <span className={styles.count}>
            {completedCount}/{totalCount}
          </span>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className={styles.tasks}>
        {month.tasks.map((task, index) => (
          <div key={task.id} className={styles.taskItem} style={{ animationDelay: `${index * 50}ms` }}>
            <TaskItem
              task={task}
              onToggle={() => onToggleTask(goalId, month.id, task.id)}
              onDelete={() => onDeleteTask(goalId, month.id, task.id)}
            />
          </div>
        ))}
      </div>

      {isAdding ? (
        <div className={styles.addForm}>
          <Input
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Название задачи..."
            autoFocus
          />
          <div className={styles.addFormActions}>
            <Button size="sm" onClick={handleAddTask} disabled={!taskText.trim()}>
              Добавить
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { setIsAdding(false); setTaskText(''); }}>
              Отмена
            </Button>
          </div>
        </div>
      ) : (
        <button className={styles.addBtn} onClick={() => setIsAdding(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Добавить задачу
        </button>
      )}

      {showDeleteConfirm && (
        <ConfirmModal
          title="Удалить месяц?"
          message={`Вы уверены, что хотите удалить "${month.name}" и все его задачи?`}
          confirmText="Удалить"
          cancelText="Отмена"
          variant="danger"
          onConfirm={() => {
            onDeleteMonth(goalId, month.id);
            setShowDeleteConfirm(false);
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}

