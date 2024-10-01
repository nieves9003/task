
import { Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { PersonFormComponent } from './person-form/person-form.component';


export default [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: TaskListComponent,
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
] as Routes;
