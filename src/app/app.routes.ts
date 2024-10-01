import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { TaskListComponent } from './taskManager/task-list/task-list.component';
import { TaskFormComponent } from './taskManager/task-form/task-form.component';
import { PersonFormComponent } from './taskManager/person-form/person-form.component';

export const routes: Routes = [

  { path: '', pathMatch: 'full', redirectTo: 'task' },
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: 'task',
        component: TaskListComponent
      },
      {
        path: 'create',
        component: TaskFormComponent,
      },
      {
        path: 'person',
        component: PersonFormComponent,
      },
    ]
  },
  { path: '**', redirectTo: 'task' }
];
