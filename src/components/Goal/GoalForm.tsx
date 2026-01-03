import { useState } from 'react';
import { Button, Input, Select } from '../UI';
import type { GoalType } from '../../types';
import { getCurrentYear } from '../../types';
import styles from './GoalForm.module.css';

interface GoalFormProps {
  onSubmit: (title: string, description: string, type: GoalType, year: number) => void;
  onCancel: () => void;
  availableYears: number[];
}

export function GoalForm({ onSubmit, onCancel, availableYears }: GoalFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<GoalType>('plan');
  const [year, setYear] = useState(getCurrentYear());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title.trim(), description.trim(), type, year);
    }
  };

  // Generate year options (current year + 5 years ahead)
  const currentYear = getCurrentYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear + i);
  const allYears = [...new Set([...availableYears, ...yearOptions])].sort((a, b) => a - b);

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <form className={styles.form} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Новая цель</h2>
        
        <Input
          label="Название цели"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Например: Накопить 10 млн за год"
          autoFocus
        />

        <div className={styles.field}>
          <label className={styles.label}>Описание (необязательно)</label>
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Подробное описание цели..."
            rows={3}
          />
        </div>

        <Select
          label="Год"
          value={year.toString()}
          onChange={(e) => setYear(Number(e.target.value))}
          options={allYears.map((y) => ({ value: y.toString(), label: y.toString() }))}
        />

        <div className={styles.typeSelector}>
          <label className={styles.label}>Тип отслеживания</label>
          <div className={styles.typeOptions}>
            <button
              type="button"
              className={`${styles.typeOption} ${type === 'plan' ? styles.active : ''}`}
              onClick={() => setType('plan')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>План по месяцам</span>
              <small>Добавляйте задачи в каждый месяц</small>
            </button>
            <button
              type="button"
              className={`${styles.typeOption} ${type === 'subgoals' ? styles.active : ''}`}
              onClick={() => setType('subgoals')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              <span>Подцели</span>
              <small>Список подцелей с чекбоксами</small>
            </button>
          </div>
        </div>

        <div className={styles.actions}>
          <Button type="submit" disabled={!title.trim()}>
            Создать цель
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel}>
            Отмена
          </Button>
        </div>
      </form>
    </div>
  );
}
