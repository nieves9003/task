import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { TaskService } from '../task.service';
import { Task } from '../../entities/task';
import { RouterLink } from '@angular/router';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  standalone: true,
  imports: [
    RouterLink,
    MatSnackBarModule,
    MatButtonToggleModule,
    FormsModule,
    CommonModule
  ],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  filter: string = 'all';

  constructor(private apiService: TaskService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.apiService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    if (this.filter === 'completed') {
      this.filteredTasks = this.tasks.filter(task => task.completed);
    } else if (this.filter === 'pending') {
      this.filteredTasks = this.tasks.filter(task => !task.completed);
    } else {
      this.filteredTasks = this.tasks;
    }
  }

  setFilter(filter: string): void {
    this.filter = filter;
    this.applyFilter();
  }
  onComplete(task): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Estás seguro de que deseas completar esta tarea?',
        icon: 'warning',
        iconColor: 'red'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.complete(task);
      }
    });
  }

  complete(task): void {
    const updatedTask = { ...task, completed: true };
    this.apiService.updateTask(updatedTask).subscribe(() => {
      this.loadTasks(); // Recargar las tareas para reflejar el cambio
    });
  }
}
