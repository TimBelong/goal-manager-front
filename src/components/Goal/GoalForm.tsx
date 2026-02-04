import { useState } from 'react';
import { Button, Input } from '../UI';
import type { Goal, GoalType, GoalCategory } from '../../types';
import { getCurrentYear } from '../../types';
import { CATEGORIES } from '../../constants/categories';
import styles from './GoalForm.module.css';

interface GoalFormProps {
  onSubmit: (title: string, description: string, type: GoalType, category: GoalCategory, year: number) => void;
  onCancel: () => void;
  availableYears: number[];
  editingGoal?: Goal | null;
}

type Step = 'year' | 'category' | 'type' | 'details';

export function GoalForm({ onSubmit, onCancel, availableYears, editingGoal }: GoalFormProps) {
  const [step, setStep] = useState<Step>(editingGoal ? 'details' : 'year');
  const [title, setTitle] = useState(editingGoal?.title || '');
  const [description, setDescription] = useState(editingGoal?.description || '');
  const [type, setType] = useState<GoalType>(editingGoal?.type || 'plan');
  const [category, setCategory] = useState<GoalCategory>(editingGoal?.category || 'PersonalDevelopment');
  const [year, setYear] = useState(editingGoal?.year || getCurrentYear());

  const isEditing = !!editingGoal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title.trim(), description.trim(), type, category, year);
    }
  };

  // Generate year options (current year + 5 years ahead)
  const currentYear = getCurrentYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear + i);
  const allYears = [...new Set([...availableYears, ...yearOptions])].sort((a, b) => a - b);

  const renderStepContent = () => {
    switch (step) {
      case 'year':
        return (
          <div className={styles.stepContainer}>
            <h3 className={styles.stepTitle}>Выберите год</h3>
            <div className={styles.yearGrid}>
              {allYears.map((y) => (
                <button
                  key={y}
                  type="button"
                  className={`${styles.yearCard} ${year === y ? styles.selected : ''}`}
                  onClick={() => {
                    setYear(y);
                    setStep('category');
                  }}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        );

      case 'category':
        return (
          <div className={styles.stepContainer}>
            <h3 className={styles.stepTitle}>Категория цели</h3>
            <div className={styles.categoryGrid}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`${styles.categoryCard} ${category === cat.id ? styles.selected : ''}`}
                  onClick={() => {
                    setCategory(cat.id);
                    setStep('type');
                  }}
                >
                  <span className={styles.categoryIcon}>{cat.icon}</span>
                  <span className={styles.categoryLabel}>{cat.label}</span>
                  <span className={styles.categoryDesc}>{cat.description}</span>
                </button>
              ))}
            </div>
            <Button variant="ghost" className="mt-4" onClick={() => setStep('year')}>
              Назад
            </Button>
          </div>
        );

      case 'type':
        return (
          <div className={styles.stepContainer}>
            <h3 className={styles.stepTitle}>Как будем достигать?</h3>
            <div className={styles.typeOptions}>
              <button
                type="button"
                className={`${styles.typeOption} ${type === 'plan' ? styles.active : ''}`}
                onClick={() => {
                  setType('plan');
                  setStep('details');
                }}
              >
                <div className={styles.typeIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div className={styles.typeContent}>
                  <span className={styles.typeTitle}>План по месяцам</span>
                  <span className={styles.typeDesc}>Разбить большую цель на этапы по месяцам</span>
                </div>
              </button>

              <button
                type="button"
                className={`${styles.typeOption} ${type === 'subgoals' ? styles.active : ''}`}
                onClick={() => {
                  setType('subgoals');
                  setStep('details');
                }}
              >
                <div className={styles.typeIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 5h.01" />
                    <path d="M3 12h.01" />
                    <path d="M3 19h.01" />
                    <path d="M8 5h13" />
                    <path d="M8 12h13" />
                    <path d="M8 19h13" />
                  </svg>
                </div>
                <div className={styles.typeContent}>
                  <span className={styles.typeTitle}>Список подцелей</span>
                  <span className={styles.typeDesc}>Простой чек-лист задач без привязки к датам</span>
                </div>
              </button>
            </div>
            <Button variant="ghost" onClick={() => setStep('category')}>
              Назад
            </Button>
          </div>
        );

      case 'details':
        return (
          <div className={styles.stepContainer}>
            <h3 className={styles.stepTitle}>{isEditing ? 'Редактировать цель' : 'Описание цели'}</h3>

            <Input
              label="Название"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Выучить английский до B2"
              autoFocus
            />

            <div className={styles.field} style={{ marginBottom: '1rem', marginTop: '1rem' }}>
              <label className={styles.label}>Описание (опционально)</label>
              <textarea
                className={styles.textarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Зачем мне это нужно? Что я получу в итоге?"
                rows={3}
              />
            </div>

            <div className={styles.summary}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Год:</span>
                <span className={styles.summaryValue}>{year}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Категория:</span>
                <span className={styles.summaryValue}>
                  {CATEGORIES.find(c => c.id === category)?.label}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Тип:</span>
                <span className={styles.summaryValue}>
                  {type === 'plan' ? 'План по месяцам' : 'Подцели'}
                </span>
              </div>
            </div>

            <div className={styles.actions}>
              <Button type="submit" disabled={!title.trim()}>
                {isEditing ? 'Сохранить' : 'Создать цель'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => isEditing ? onCancel() : setStep('type')}>
                {isEditing ? 'Отмена' : 'Назад'}
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <form className={styles.form} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        {!isEditing && step !== 'year' && (
          <div className={styles.progress}>
            <div className={`${styles.stepDot} ${['year', 'category', 'type', 'details'].indexOf(step) >= 0 ? styles.active : ''}`} />
            <div className={`${styles.stepLine} ${['year', 'category', 'type', 'details'].indexOf(step) >= 1 ? styles.active : ''}`} />
            <div className={`${styles.stepDot} ${['year', 'category', 'type', 'details'].indexOf(step) >= 1 ? styles.active : ''}`} />
            <div className={`${styles.stepLine} ${['year', 'category', 'type', 'details'].indexOf(step) >= 2 ? styles.active : ''}`} />
            <div className={`${styles.stepDot} ${['year', 'category', 'type', 'details'].indexOf(step) >= 2 ? styles.active : ''}`} />
            <div className={`${styles.stepLine} ${['year', 'category', 'type', 'details'].indexOf(step) >= 3 ? styles.active : ''}`} />
            <div className={`${styles.stepDot} ${['year', 'category', 'type', 'details'].indexOf(step) >= 3 ? styles.active : ''}`} />
          </div>
        )}
        {renderStepContent()}
      </form>
    </div>
  );
}
