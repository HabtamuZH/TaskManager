import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskPriority, TaskStatus } from '../../models/task.model';

export interface TaskFormData {
  mode: 'create' | 'edit';
  task?: Task;
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  templateUrl: './task-form.html',
  styleUrls: ['./task-form.scss']
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isLoading = false;
  isEditMode = false;

  priorities = [
    { value: TaskPriority.Low, label: 'Low' },
    { value: TaskPriority.Medium, label: 'Medium' },
    { value: TaskPriority.High, label: 'High' },
    { value: TaskPriority.Critical, label: 'Critical' }
  ];

  statuses = [
    { value: TaskStatus.Pending, label: 'Pending' },
    { value: TaskStatus.InProgress, label: 'In Progress' },
    { value: TaskStatus.Completed, label: 'Completed' },
    { value: TaskStatus.Cancelled, label: 'Cancelled' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskFormData
  ) {
    this.isEditMode = data.mode === 'edit';
    
    this.taskForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(1000)]],
      priority: [TaskPriority.Medium, [Validators.required]],
      status: [TaskStatus.Pending],
      dueDate: [null]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.task) {
      this.populateForm(this.data.task);
    }
  }

  populateForm(task: Task): void {
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate ? new Date(task.dueDate) : null
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.isLoading = true;
      
      if (this.isEditMode) {
        this.updateTask();
      } else {
        this.createTask();
      }
    }
  }

  createTask(): void {
    const formValue = this.taskForm.value;
    const createRequest: CreateTaskRequest = {
      title: formValue.title,
      description: formValue.description || '',
      priority: formValue.priority,
      dueDate: formValue.dueDate ? formValue.dueDate.toISOString() : undefined
    };

    this.apiService.createTask(createRequest).subscribe({
      next: (task) => {
        this.isLoading = false;
        this.snackBar.open('Task created successfully!', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.isLoading = false;
        const message = error.error?.message || 'Failed to create task. Please try again.';
        this.snackBar.open(message, 'Close', { duration: 5000 });
      }
    });
  }

  updateTask(): void {
    if (!this.data.task) return;

    const formValue = this.taskForm.value;
    const updateRequest: UpdateTaskRequest = {
      title: formValue.title,
      description: formValue.description || '',
      status: formValue.status,
      priority: formValue.priority,
      dueDate: formValue.dueDate ? formValue.dueDate.toISOString() : undefined
    };

    this.apiService.updateTask(this.data.task.id, updateRequest).subscribe({
      next: (task) => {
        this.isLoading = false;
        this.snackBar.open('Task updated successfully!', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.isLoading = false;
        const message = error.error?.message || 'Failed to update task. Please try again.';
        this.snackBar.open(message, 'Close', { duration: 5000 });
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  get title() { return this.taskForm.get('title'); }
  get description() { return this.taskForm.get('description'); }
}

