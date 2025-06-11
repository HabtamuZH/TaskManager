import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard';
import { AuthService } from '../../services/auth';
import { ApiService } from '../../services/api';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { User } from '../../models/auth.model';
import { Task, TaskStatus, TaskPriority } from '../../models/task.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let authServiceStub: Partial<AuthService>;
  let apiServiceStub: Partial<ApiService>;
  let router: Router;
  let dialog: MatDialog;

  const mockUser: User = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: 'admin',
    createdAt: new Date().toISOString(),
  };

  const mockTasks: Task[] = [
    {
      id: 1,
      title: 'Task 1',
      status: TaskStatus.Pending,
      dueDate: new Date().toISOString(),
      description: '',
      priority: TaskPriority.Low,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 1,
      userName: 'John Doe',
    },
    {
      id: 2,
      title: 'Task 2',
      status: TaskStatus.InProgress,
      dueDate: new Date().toISOString(),
      description: '',
      priority: TaskPriority.Medium,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 1,
      userName: 'John Doe',
    },
    {
      id: 3,
      title: 'Task 3',
      status: TaskStatus.Completed,
      dueDate: new Date().toISOString(),
      description: '',
      priority: TaskPriority.High,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 1,
      userName: 'John Doe',
    },
  ];

  beforeEach(async () => {
    authServiceStub = {
      currentUser$: new BehaviorSubject<User | null>(mockUser),
    };

    apiServiceStub = {
      getTasks: () => of(mockTasks),
    };

    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceStub },
        { provide: ApiService, useValue: apiServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load task stats on init', () => {
    spyOn(component, 'loadTaskStats');
    component.ngOnInit();
    expect(component.loadTaskStats).toHaveBeenCalled();
  });

  it('should calculate task stats correctly', () => {
    component.calculateStats(mockTasks);
    expect(component.taskStats).toEqual({
      pending: 1,
      inProgress: 1,
      completed: 1,
      total: 3,
    });
  });

  it('should open task form dialog on createNewTask', () => {
    spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of(true),
    } as any);
    component.createNewTask();
    expect(dialog.open).toHaveBeenCalledWith(jasmine.anything(), {
      width: '500px',
      data: { mode: 'create' },
    });
  });

  it('should navigate to tasks on navigateToTasks', () => {
    spyOn(router, 'navigate');
    component.navigateToTasks();
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });
});
