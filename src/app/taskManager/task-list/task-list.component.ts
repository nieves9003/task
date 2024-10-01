import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../task.service';
import { Task } from '../../entities/task';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  filter: string = 'all';

  constructor(private apiService: TaskService,
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
  onComplete(): void { }
}
