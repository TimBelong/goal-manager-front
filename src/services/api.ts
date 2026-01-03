import type { Goal, GoalType, Month, Task, SubGoal, DailyActivity } from '../types';

const API_BASE_URL = '/api';

interface ApiError {
  message: string;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP error ${response.status}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  // Auth
  async register(email: string, password: string, name: string) {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email: string, password: string) {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser() {
    return this.request<UserDto>('/auth/me');
  }

  // Goals
  async getGoals(): Promise<Goal[]> {
    const response = await this.request<GoalApiResponse[]>('/goals');
    return response.map(mapGoalFromApi);
  }

  async createGoal(title: string, description: string, type: GoalType, year?: number): Promise<Goal> {
    const response = await this.request<GoalApiResponse>('/goals', {
      method: 'POST',
      body: JSON.stringify({ title, description, type, year }),
    });
    return mapGoalFromApi(response);
  }

  async updateGoal(goalId: string, title: string, description: string): Promise<Goal> {
    const response = await this.request<GoalApiResponse>(`/goals/${goalId}`, {
      method: 'PUT',
      body: JSON.stringify({ title, description }),
    });
    return mapGoalFromApi(response);
  }

  async deleteGoal(goalId: string): Promise<void> {
    await this.request(`/goals/${goalId}`, { method: 'DELETE' });
  }

  // Months
  async addMonth(goalId: string, name: string, order: number): Promise<Month> {
    const response = await this.request<MonthApiResponse>(`/goals/${goalId}/months`, {
      method: 'POST',
      body: JSON.stringify({ name, order }),
    });
    return mapMonthFromApi(response);
  }

  async deleteMonth(goalId: string, monthId: string): Promise<void> {
    await this.request(`/goals/${goalId}/months/${monthId}`, { method: 'DELETE' });
  }

  // Tasks
  async addTask(goalId: string, monthId: string, text: string): Promise<Task> {
    const response = await this.request<TaskApiResponse>(`/goals/${goalId}/months/${monthId}/tasks`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    return mapTaskFromApi(response);
  }

  async toggleTask(goalId: string, taskId: string): Promise<Task> {
    const response = await this.request<TaskApiResponse>(`/goals/${goalId}/tasks/${taskId}/toggle`, {
      method: 'PATCH',
    });
    return mapTaskFromApi(response);
  }

  async deleteTask(goalId: string, monthId: string, taskId: string): Promise<void> {
    await this.request(`/goals/${goalId}/months/${monthId}/tasks/${taskId}`, { method: 'DELETE' });
  }

  // SubGoals
  async addSubGoal(goalId: string, text: string): Promise<SubGoal> {
    const response = await this.request<SubGoalApiResponse>(`/goals/${goalId}/subgoals`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    return mapSubGoalFromApi(response);
  }

  async toggleSubGoal(goalId: string, subGoalId: string): Promise<SubGoal> {
    const response = await this.request<SubGoalApiResponse>(`/goals/${goalId}/subgoals/${subGoalId}/toggle`, {
      method: 'PATCH',
    });
    return mapSubGoalFromApi(response);
  }

  async deleteSubGoal(goalId: string, subGoalId: string): Promise<void> {
    await this.request(`/goals/${goalId}/subgoals/${subGoalId}`, { method: 'DELETE' });
  }

  // Analytics
  async getAnalytics(): Promise<AnalyticsData> {
    return this.request<AnalyticsData>('/analytics/activity');
  }
}

// API Response types
interface AuthResponse {
  token: string;
  user: UserDto;
}

interface UserDto {
  id: string;
  email: string;
  name: string;
}

interface GoalApiResponse {
  id: string;
  title: string;
  description?: string;
  type: string;
  year: number;
  createdAt: string;
  months?: MonthApiResponse[];
  subGoals?: SubGoalApiResponse[];
  progress: number;
}

interface MonthApiResponse {
  id: string;
  name: string;
  order: number;
  tasks: TaskApiResponse[];
}

interface TaskApiResponse {
  id: string;
  text: string;
  completed: boolean;
  completedAt?: string;
}

interface SubGoalApiResponse {
  id: string;
  text: string;
  completed: boolean;
  completedAt?: string;
}

export interface AnalyticsData {
  activity: DailyActivity[];
  totalGoals: number;
  completedTasks: number;
  totalTasks: number;
  currentStreak: number;
}

// Mappers
function mapGoalFromApi(goal: GoalApiResponse): Goal {
  const baseGoal = {
    id: goal.id,
    title: goal.title,
    description: goal.description,
    type: goal.type as GoalType,
    year: goal.year,
    createdAt: goal.createdAt,
  };

  if (goal.type === 'plan') {
    return {
      ...baseGoal,
      type: 'plan',
      plan: {
        id: goal.id,
        months: goal.months?.map(mapMonthFromApi) || [],
      },
    };
  } else {
    return {
      ...baseGoal,
      type: 'subgoals',
      subGoals: goal.subGoals?.map(mapSubGoalFromApi) || [],
    };
  }
}

function mapMonthFromApi(month: MonthApiResponse): Month {
  return {
    id: month.id,
    name: month.name,
    order: month.order,
    tasks: month.tasks.map(mapTaskFromApi),
  };
}

function mapTaskFromApi(task: TaskApiResponse): Task {
  return {
    id: task.id,
    text: task.text,
    completed: task.completed,
    completedAt: task.completedAt,
  };
}

function mapSubGoalFromApi(subGoal: SubGoalApiResponse): SubGoal {
  return {
    id: subGoal.id,
    text: subGoal.text,
    completed: subGoal.completed,
    completedAt: subGoal.completedAt,
  };
}

export const api = new ApiService();
export type { AuthResponse, UserDto };

