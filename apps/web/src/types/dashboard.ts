export interface Project {
  id: string;
  name: string;
  description?: string;
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

export interface Comment {
  id: string;
  content: string;
  userId: string;
  projectId?: string | null;
  taskId?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
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

interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface DataResponse<T> {
  data: Array<T>;
  meta: PageMeta;
}

export interface ProjectsResponse extends DataResponse<Project> {}

export interface TasksResponse extends DataResponse<Task> {}

export interface ActivityResponse extends DataResponse<Activity> {}
