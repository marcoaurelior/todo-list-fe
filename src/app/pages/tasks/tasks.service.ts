import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CreateTaskRequest, Task, UpdateAllTasksOrderRequest, UpdateTaskRequest} from './tasks.model';

@Injectable({
  providedIn: 'root'
})

export class TasksService {
  private url = environment.API + '/tasks';

  constructor(private httpClient: HttpClient) {
  }

  getAllTasks(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(this.url)
  }

  getTaskById(id: string): Observable<Task> {
    return this.httpClient.get<Task>(this.url + '/' + id);
  }

  createTask(task: CreateTaskRequest): Observable<void> {
    return this.httpClient.post<void>(this.url, task)
  }

  updateTask(id: string, request: UpdateTaskRequest) {
    return this.httpClient.put(this.url + '/' + id, request);
  }

  deleteTask(id: string): Observable<void> {
    return this.httpClient.delete<void>(this.url + '/' + id)
  }

  updateAllDisplayOrder(tasks: UpdateAllTasksOrderRequest[]): Observable<Task[]> {
    return this.httpClient.put<Task[]>(this.url, tasks);
  }
}
