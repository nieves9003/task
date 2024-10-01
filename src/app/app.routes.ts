import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { TaskListComponent } from './taskManager/task-list/task-list.component';
import { TaskFormComponent } from './taskManager/task-form/task-form.component';
import { TaskFormEditComponent } from './taskManager/task-form-edit/task-form-edit.component';

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
        path: 'edit/:id',
        component: TaskFormEditComponent,
      },
    ]
  },
  { path: '**', redirectTo: 'task' }
];
