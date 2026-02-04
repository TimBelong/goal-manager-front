import type { GoalCategory } from '../types';

export const CATEGORIES: { id: GoalCategory; label: string; icon: string; description: string; color: string }[] = [
    { id: 'PersonalDevelopment', label: 'Личное развитие', icon: '🌱', description: 'Книги, курсы, навыки', color: '#10B981' },
    { id: 'Career', label: 'Карьера', icon: '💼', description: 'Повышение, новый проект', color: '#3B82F6' },
    { id: 'Finance', label: 'Финансы', icon: '💰', description: 'Накопления, инвестиции', color: '#F59E0B' },
    { id: 'Health', label: 'Здоровье', icon: '❤️', description: 'Чек-апы, лечение', color: '#EF4444' },
    { id: 'Sport', label: 'Спорт', icon: '🏃', description: 'Тренировки, активность', color: '#8B5CF6' },
    { id: 'Nutrition', label: 'Питание', icon: '🥗', description: 'Диета, режим воды', color: '#EC4899' },
    { id: 'Relationships', label: 'Отношения', icon: '💞', description: 'Семья, друзья', color: '#EC4899' },
    { id: 'Habits', label: 'Привычки', icon: '⚡', description: 'Режим дня, медитации', color: '#6366F1' },
    { id: 'Travel', label: 'Путешествия', icon: '✈️', description: 'Поездки, отпуск', color: '#0EA5E9' },
    { id: 'Other', label: 'Другое', icon: '✨', description: 'Всё остальное', color: '#64748B' },
];

export const getCategoryById = (id: GoalCategory) => CATEGORIES.find(c => c.id === id);
