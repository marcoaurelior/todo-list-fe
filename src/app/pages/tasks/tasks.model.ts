export interface Task {
  id?: string;
  name?: string;
  cost?: number;
  dueDate?: string;
  displayOrder?: number;
}

export interface CreateTaskRequest {
  name?: string;
  cost?: number;
  dueDate?: string;
}

export interface UpdateTaskRequest {
  name?: string;
  cost?: number;
  dueDate?: string;
}

export interface UpdateAllTasksOrderRequest {
  id?: string;
  displayOrder?: number;
}
