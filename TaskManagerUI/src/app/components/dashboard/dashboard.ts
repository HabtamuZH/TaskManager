import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ApiService } from '../../services/api';
import { User } from '../../models/auth.model';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskFormComponent } from '../task-form/task-form';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  taskStats = {
    pending: 0,
    inProgress: 0,
    completed: 0,
    total: 0,
  };
  isLoadingStats = false;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    this.loadTaskStats();
  }

  loadTaskStats(): void {
    this.isLoadingStats = true;
    this.apiService.getTasks().subscribe({
      next: (tasks) => {
        this.calculateStats(tasks);
        this.isLoadingStats = false;
      },
      error: (error) => {
        console.error('Error loading task stats:', error);
        this.isLoadingStats = false;
      },
    });
  }

  calculateStats(tasks: Task[]): void {
    this.taskStats = {
      pending: tasks.filter((t) => t.status === TaskStatus.Pending).length,
      inProgress: tasks.filter((t) => t.status === TaskStatus.InProgress)
        .length,
      completed: tasks.filter((t) => t.status === TaskStatus.Completed).length,
      total: tasks.length,
    };
  }

  createNewTask(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '500px',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTaskStats();
      }
    });
  }

  navigateToTasks(): void {
    this.router.navigate(['/tasks']);
  }
}
