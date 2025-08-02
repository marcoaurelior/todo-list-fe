import {Component, OnInit} from '@angular/core';
import {Task} from './tasks.model';
import {TasksService} from './tasks.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-list-tasks',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {

  tasks: Task[] = [];

  constructor(
    private tasksService: TasksService,
  ) {
  }

  ngOnInit() {
    this.getTasks()
  }

  private getTasks() {
    this.tasksService.getTasks().subscribe({
      next: (tasks: Task[]) => {
        this.tasks = tasks;
      },
      error: (err: any) => {
        console.error('Erro ao carregar tasks', err);
      }
    });
  }
}
