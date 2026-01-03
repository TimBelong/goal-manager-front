import { useState } from 'react';
import { Checkbox, ConfirmModal } from '../UI';
import type { SubGoal } from '../../types';

interface SubGoalItemProps {
  subGoal: SubGoal;
  onToggle: () => void;
  onDelete: () => void;
}

export function SubGoalItem({ subGoal, onToggle, onDelete }: SubGoalItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      <Checkbox
        label={subGoal.text}
        checked={subGoal.completed}
        onChange={onToggle}
        onDelete={() => setShowDeleteConfirm(true)}
      />
      {showDeleteConfirm && (
        <ConfirmModal
          title="Удалить подцель?"
          message={`Вы уверены, что хотите удалить подцель "${subGoal.text}"?`}
          confirmText="Удалить"
          cancelText="Отмена"
          variant="danger"
          onConfirm={() => {
            onDelete();
            setShowDeleteConfirm(false);
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
}
