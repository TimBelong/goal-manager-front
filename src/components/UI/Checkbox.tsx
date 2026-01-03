import type { InputHTMLAttributes } from 'react';
import styles from './Checkbox.module.css';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  onDelete?: () => void;
}

export function Checkbox({ label, checked, onDelete, className = '', ...props }: CheckboxProps) {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <label className={styles.label}>
        <input type="checkbox" checked={checked} className={styles.input} {...props} />
        <span className={`${styles.checkbox} ${checked ? styles.checked : ''}`}>
          <svg
            className={styles.checkIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        {label && <span className={`${styles.text} ${checked ? styles.textChecked : ''}`}>{label}</span>}
      </label>
      {onDelete && (
        <button
          type="button"
          className={styles.deleteBtn}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label="Удалить"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

