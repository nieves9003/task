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

  addTask(task: Task): Observable<Task> {
    return this._httpClient.post<Task>(`${this.apiUrl}/tasks`, task);
  }

  updateTask(task: Task): Observable<Task> {
    return this._httpClient.put<Task>(`${this.apiUrl}/tasks/${task.id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this._httpClient.delete<void>(`${this.apiUrl}/tasks/${id}`);
  }

  // Métodos para gestionar personas
  getPersons(taskId: number): Observable<Person[]> {
    return this._httpClient.get<Person[]>(`${this.apiUrl}/tasks/${taskId}/persons`);
  }

  addPerson(taskId: number, person: Person): Observable<Person> {
    return this._httpClient.post<Person>(`${this.apiUrl}/tasks/${taskId}/persons`, person);
  }

  updatePerson(taskId: number, person: Person): Observable<Person> {
    return this._httpClient.put<Person>(`${this.apiUrl}/tasks/${taskId}/persons/${person.id}`, person);
  }

  deletePerson(taskId: number, personId: number): Observable<void> {
    return this._httpClient.delete<void>(`${this.apiUrl}/tasks/${taskId}/persons/${personId}`);
  }

  // Métodos para gestionar habilidades
  addSkill(taskId: number, personId: number, skill: string): Observable<Person> {
    return this._httpClient.post<Person>(`${this.apiUrl}/tasks/${taskId}/persons/${personId}/skills`, { skill });
  }

  deleteSkill(taskId: number, personId: number, skill: string): Observable<Person> {
    return this._httpClient.delete<Person>(`${this.apiUrl}/tasks/${taskId}/persons/${personId}/skills/${skill}`);
  }
}
