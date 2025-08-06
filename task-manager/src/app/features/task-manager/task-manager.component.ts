import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { Task } from '../../../app/core/models/task.model';
import { TaskService } from '../../services/task.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatListModule
  ],
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.scss']
})
export class TaskManagerComponent implements OnInit {
  taskTitle = '';
  tasks: Task[] = [];
  filter: 'all' | 'completed' | 'incomplete' = 'all';

  completedCount = 0;
  pendingCount = 0;

  editingTaskId: string | null = null;
  editedTitle = '';

  currentUser: User | null = null;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  // Load from backend
  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.updateTaskStats();
      },
      error: (err) => {
        console.error('Failed to load tasks', err);
      }
    });
  }

  // Filtered tasks based on current filter setting
  get filteredTasks(): Task[] {
    switch (this.filter) {
      case 'completed':
        return this.tasks.filter(t => t.isCompleted);
      case 'incomplete':
        return this.tasks.filter(t => !t.isCompleted);
      default:
        return this.tasks;
    }
  }

  // Add new task with date and unique ID
  addTask(): void {
    if (!this.taskTitle.trim()) return;

    const newTask: Partial<Task> = {
      title: this.taskTitle.trim()
    };

    this.taskService.createTask(newTask).subscribe({
      next: (task) => {
        this.tasks.unshift(task);
        this.taskTitle = '';
        this.updateTaskStats();
      },
      error: (err) => console.error('Failed to create task', err)
    });
  }

  // Toggle task status (complete/incomplete)
  toggleComplete(task: Task): void {
    task.isCompleted = !task.isCompleted;

    this.taskService.updateTask(task).subscribe({
      next: () => this.updateTaskStats(),
      error: (err) => console.error('Failed to update task', err)
    });
  }

  // Delete task by ID
  deleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.updateTaskStats();
      },
      error: (err) => console.error('Failed to delete task', err)
    });
  }

  // Set current filter
  setFilter(filter: 'all' | 'completed' | 'incomplete'): void {
    this.filter = filter;
  }

  // Update stats for completed and pending tasks
  updateTaskStats(): void {
    this.completedCount = this.tasks.filter(t => t.isCompleted).length;
    this.pendingCount = this.tasks.length - this.completedCount;
  }

  // Optional: reusable counter method
  getTaskCount(type: 'total' | 'completed' | 'pending'): number {
    switch (type) {
      case 'completed':
        return this.completedCount;
      case 'pending':
        return this.pendingCount;
      default:
        return this.tasks.length;
    }
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
}