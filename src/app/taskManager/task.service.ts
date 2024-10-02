import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Person } from '../entities/person';
import { Task } from '../entities/task';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private apiUrl = 'http://localhost:3000';

  private _httpClient = inject(HttpClient);
  constructor() { }
  // Métodos para gestionar tareas
  getTasks(): Observable<Task[]> {
    return this._httpClient.get<Task[]>(`${this.apiUrl}/tasks`);
  }
  getTask(id: number): Observable<Task> {
    return this._httpClient.get<Task>(`${this.apiUrl}/tasks/${id}`);
  }
  addTask(task: Task): Observable<Task> {
    return this._httpClient.post<Task>(`${this.apiUrl}/tasks`, task);
  }

  updateTask(task: Task): Observable<Task> {
    return this._httpClient.put<Task>(`${this.apiUrl}/tasks/${task.id}`, task);
  }
}
