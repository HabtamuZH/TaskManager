import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';
import { Task, TaskStatus, TaskPriority } from '../../models/task.model';
import { TaskFormComponent } from '../task-form/task-form';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatMenuModule,
    MatDividerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  displayedColumns: string[] = ['title', 'status', 'priority', 'dueDate', 'actions'];
  isLoading = false;

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.apiService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Failed to load tasks', 'Close', { duration: 3000 });
        console.error('Error loading tasks:', error);
      }
    });
  }

  getStatusText(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.Pending: return 'Pending';
      case TaskStatus.InProgress: return 'In Progress';
      case TaskStatus.Completed: return 'Completed';
      case TaskStatus.Cancelled: return 'Cancelled';
      default: return 'Unknown';
    }
  }

  getStatusColor(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.Pending: return 'warn';
      case TaskStatus.InProgress: return 'primary';
      case TaskStatus.Completed: return 'accent';
      case TaskStatus.Cancelled: return '';
      default: return '';
    }
  }

  getPriorityText(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.Low: return 'Low';
      case TaskPriority.Medium: return 'Medium';
      case TaskPriority.High: return 'High';
      case TaskPriority.Critical: return 'Critical';
      default: return 'Unknown';
    }
  }

  getPriorityColor(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.Low: return '#4caf50';
      case TaskPriority.Medium: return '#ff9800';
      case TaskPriority.High: return '#f44336';
      case TaskPriority.Critical: return '#9c27b0';
      default: return '#666';
    }
  }

  openCreateTaskDialog(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '600px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  openEditTaskDialog(task: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '600px',
      data: { mode: 'edit', task: task }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  updateTaskStatus(task: Task, newStatus: TaskStatus): void {
    this.apiService.updateTaskStatus(task.id, newStatus).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        this.snackBar.open('Task status updated', 'Close', { duration: 2000 });
      },
      error: (error) => {
        this.snackBar.open('Failed to update task status', 'Close', { duration: 3000 });
        console.error('Error updating task status:', error);
      }
    });
  }

  deleteTask(task: Task): void {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      this.apiService.deleteTask(task.id).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(t => t.id !== task.id);
          this.snackBar.open('Task deleted successfully', 'Close', { duration: 2000 });
        },
        error: (error) => {
          this.snackBar.open('Failed to delete task', 'Close', { duration: 3000 });
          console.error('Error deleting task:', error);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}

