import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Task} from './tasks.model';

@Injectable({
  providedIn: 'root'
})

export class TasksService {
  private url = environment.API + '/tasks';

  constructor(private httpClient: HttpClient) {
  }

  getTasks(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(this.url)
  }
}
