export interface Task {
  id?: string;
  name?: string;
  cost?: string;
  dueDate?: string;
  displayOrder?: number;
}

export interface CreateTaskRequest {
  name: string;
  cost: string;
  dueDate: string;
}

export interface UpdateTaskRequest {
  name: string;
  cost: string;
  dueDate: string;
}
