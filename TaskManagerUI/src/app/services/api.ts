import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskFilter } from '../models/task.model';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = 'http://localhost:5000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Task endpoints
  getTasks(filter?: TaskFilter): Observable<Task[]> {
    let params = new HttpParams();
    
    if (filter) {
      if (filter.status !== undefined) params = params.set('status', filter.status.toString());
      if (filter.priority !== undefined) params = params.set('priority', filter.priority.toString());
      if (filter.dueDateFrom) params = params.set('dueDateFrom', filter.dueDateFrom);
      if (filter.dueDateTo) params = params.set('dueDateTo', filter.dueDateTo);
      if (filter.search) params = params.set('search', filter.search);
      if (filter.page) params = params.set('page', filter.page.toString());
      if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());
    }

    return this.http.get<Task[]>(`${this.API_URL}/tasks`, { 
      params,
      headers: this.getAuthHeaders()
    });
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.API_URL}/tasks/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  createTask(task: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(`${this.API_URL}/tasks`, task, {
      headers: this.getAuthHeaders()
    });
  }

  updateTask(id: number, task: UpdateTaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.API_URL}/tasks/${id}`, task, {
      headers: this.getAuthHeaders()
    });
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/tasks/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateTaskStatus(id: number, status: number): Observable<Task> {
    return this.http.patch<Task>(`${this.API_URL}/tasks/${id}/status`, { status }, {
      headers: this.getAuthHeaders()
    });
  }

  // Admin endpoints
  getAllTasks(filter?: TaskFilter): Observable<Task[]> {
    let params = new HttpParams();
    
    if (filter) {
      if (filter.status !== undefined) params = params.set('status', filter.status.toString());
      if (filter.priority !== undefined) params = params.set('priority', filter.priority.toString());
      if (filter.dueDateFrom) params = params.set('dueDateFrom', filter.dueDateFrom);
      if (filter.dueDateTo) params = params.set('dueDateTo', filter.dueDateTo);
      if (filter.search) params = params.set('search', filter.search);
      if (filter.page) params = params.set('page', filter.page.toString());
      if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());
    }

    return this.http.get<Task[]>(`${this.API_URL}/tasks/all`, { 
      params,
      headers: this.getAuthHeaders()
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
}

