import type { GoalCategory } from '../types';
import type { ReactNode } from 'react';
import { Dumbbell, Salad, Plane } from 'lucide-react';

export const CATEGORIES: { id: GoalCategory; label: string; icon: ReactNode; description: string; color: string }[] = [
    {
        id: 'PersonalDevelopment',
        label: 'Личное развитие',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="#10B981" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="#34D399" />
            </svg>
        ),
        description: 'Книги, курсы, навыки',
        color: '#10B981',
    },
    {
        id: 'Career',
        label: 'Карьера',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" stroke="#3B82F6" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" stroke="#60A5FA" />
            </svg>
        ),
        description: 'Повышение, новый проект',
        color: '#3B82F6',
    },
    {
        id: 'Finance',
        label: 'Финансы',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" stroke="#F59E0B" />
                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" stroke="#FBBF24" />
                <path d="M12 18V6" stroke="#F59E0B" />
            </svg>
        ),
        description: 'Накопления, инвестиции',
        color: '#F59E0B',
    },
    {
        id: 'Health',
        label: 'Здоровье',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" stroke="#EF4444" fill="none" />
                <path d="M12 5.5v2" stroke="#F87171" strokeLinecap="round" />
            </svg>
        ),
        description: 'Чек-апы, лечение',
        color: '#EF4444',
    },
    {
        id: 'Sport',
        label: 'Спорт',
        icon: <Dumbbell size={24} color="#8B5CF6" />,
        description: 'Тренировки, активность',
        color: '#8B5CF6',
    },
    {
        id: 'Nutrition',
        label: 'Питание',
        icon: <Salad size={24} color="#EC4899" />,
        description: 'Диета, режим воды',
        color: '#EC4899',
    },
    {
        id: 'Relationships',
        label: 'Отношения',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#EC4899" />
                <circle cx="9" cy="7" r="4" stroke="#F472B6" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="#EC4899" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#F472B6" />
            </svg>
        ),
        description: 'Семья, друзья',
        color: '#EC4899',
    },
    {
        id: 'Habits',
        label: 'Привычки',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke="#6366F1" fill="none" />
            </svg>
        ),
        description: 'Режим дня, медитации',
        color: '#6366F1',
    },
    {
        id: 'Travel',
        label: 'Путешествия',
        icon: <Plane size={24} color="#0EA5E9" />,
        description: 'Поездки, отпуск',
        color: '#0EA5E9',
    },
    {
        id: 'Other',
        label: 'Другое',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1" fill="#64748B" />
                <circle cx="19" cy="12" r="1" fill="#94A3B8" />
                <circle cx="5" cy="12" r="1" fill="#475569" />
            </svg>
        ),
        description: 'Всё остальное',
        color: '#64748B',
    },
];

export const getCategoryById = (id: GoalCategory) => CATEGORIES.find(c => c.id === id);
