import { useState } from 'react';
import { Checkbox, ConfirmModal } from '../UI';
import type { Task } from '../../types';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      <Checkbox
        label={task.text}
        checked={task.completed}
        onChange={onToggle}
        onDelete={() => setShowDeleteConfirm(true)}
      />
      {showDeleteConfirm && (
        <ConfirmModal
          title="Удалить задачу?"
          message={`Вы уверены, что хотите удалить задачу "${task.text}"?`}
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
