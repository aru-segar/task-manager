import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';

import { Task } from '../../../app/core/models/task.model';
import { TaskService } from '../../services/task.service';
import { User } from '../../core/models/user.model';
import { TASK_STATUS_OPTIONS, TaskItemStatus, taskStatusToLabel } from '../../core/enums/task-item-status.enum';

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatChipsModule
  ],
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.scss']
})
export class TaskManagerComponent implements OnInit {
  taskTitle = '';
  tasks: Task[] = [];
  filter: 'all' | 'inprogress' | 'completed' | 'incomplete' = 'all';

  completedCount = 0;
  pendingCount = 0;

  editingTaskId: string | null = null;
  editedTitle = '';

  currentUser: User | null = null;

  TaskItemStatus = TaskItemStatus;
  statusOptions = TASK_STATUS_OPTIONS;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  // Load from backend
  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = Array.isArray(data) ? data : [];
        this.updateTaskStats();
      },
      error: (err) => console.error('Failed to load tasks', err)
    });
  }

  // Filtered tasks based on current filter setting
  get filteredTasks(): Task[] {
    switch (this.filter) {
      case 'inprogress':
        return this.tasks.filter((t) => t.status === TaskItemStatus.InProgress);
      case 'completed':
        return this.tasks.filter((t) => t.status === TaskItemStatus.Completed);
      case 'incomplete':
        return this.tasks.filter((t) => t.status !== TaskItemStatus.Completed);
      default:
        return this.tasks;
    }
  }

  // Add new task
  addTask(): void {
    if (!this.taskTitle.trim()) return;

    const newTask: Partial<Task> = {
      title: this.taskTitle.trim(),
      status: TaskItemStatus.Pending,
      isCompleted: false
    };

    this.taskService.createTask(newTask).subscribe({
      next: (task) => {
        if (!Array.isArray(this.tasks)) this.tasks = [];
        this.tasks.unshift(task);
        this.taskTitle = '';
        this.updateTaskStats();
      },
      error: (err) => console.error('Failed to create task', err)
    });
  }

  /** chip-based status change */
  onStatusChipChange(task: Task, newStatus: TaskItemStatus) {
    const prev = task.status ?? (task.isCompleted ? TaskItemStatus.Completed : TaskItemStatus.Pending);
    task.status = newStatus;
    task.isCompleted = newStatus === TaskItemStatus.Completed;

    this.taskService.updateStatus(task.id, newStatus).subscribe({
      next: () => this.updateTaskStats(),
      error: () => {
        // rollback on failure
        task.status = prev;
        task.isCompleted = prev === TaskItemStatus.Completed;
      }
    });
  }

  // Delete task by ID
  deleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter((t) => t.id !== id);
        this.updateTaskStats();
      },
      error: (err) => console.error('Failed to delete task', err)
    });
  }

  // Set current filter
  setFilter(filter: 'all' | 'inprogress' | 'completed' | 'incomplete'): void {
    this.filter = filter;
  }

  // Update stats for completed and pending tasks
  updateTaskStats(): void {
    const list = Array.isArray(this.tasks) ? this.tasks : [];
    this.completedCount = list.filter((t) => t.status === TaskItemStatus.Completed).length;
    this.pendingCount = list.filter((t) => t.status === TaskItemStatus.Pending).length;
  }

  // Start editing task
  startEdit(task: Task): void {
    this.editingTaskId = task.id;
    this.editedTitle = task.title;
  }

  // Save edited task
  saveEdit(task: Task): void {
    if (!this.editedTitle.trim()) return;

    task.title = this.editedTitle.trim();

    this.taskService.updateTask(task).subscribe({
      next: () => {
        this.editingTaskId = null;
        this.editedTitle = '';
      },
      error: (err) => console.error('Failed to update task', err)
    });
  }

  // Cancel editing
  cancelEdit(): void {
    this.editingTaskId = null;
    this.editedTitle = '';
  }

  // Label helper (kept for any template usage)
  statusLabel(s: TaskItemStatus | null | undefined): string {
    return taskStatusToLabel(s ?? null);
  }
}
