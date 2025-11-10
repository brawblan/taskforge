export interface Project {
  id: string;
  name: string;
  description: string | null;
  updatedAt: string;
  createdAt: string;
  ownerId: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  projectId: string;
  assigneeId: string | null;
  updatedAt: string;
  createdAt: string;
  dueDate: string | null;
}

export interface Activity {
  id: string;
  action: string;
  message: string | null;
  userId: string | null;
  projectId: string | null;
  taskId: string | null;
  oldValue: unknown | null;
  newValue: unknown | null;
  createdAt: string;
}

export interface RecentProjectsResponse {
  data: Array<Project>;
}

export interface RecentTasksResponse {
  data: Array<Task>;
}

export interface RecentActivityResponse {
  data: Array<Activity>;
}
