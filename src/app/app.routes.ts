import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'tasks',
    loadComponent: () => import('./pages/tasks/tasks.component').then(t => t.TasksComponent)
  },
  {
    path: '**',
    redirectTo: 'tasks',
    pathMatch: 'full'
  }
];
