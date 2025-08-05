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
import { v4 as uuidv4 } from 'uuid';
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
    this.currentUser = this.getCurrentUser();

    this.tasks = this.taskService.getTasks().filter(task => {
      return task.userId === this.currentUser?.id || !task.userId;
    });

    this.updateTaskStats();
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

    const newTask: Task = {
      id: uuidv4(),
      title: this.taskTitle.trim(),
      createdAt: new Date(),
      isCompleted: false,
      userId: this.currentUser?.id
    };

    this.tasks.unshift(newTask);
    this.taskTitle = '';
    this.updateLocalStorage();
    this.updateTaskStats();
  }

  // Toggle task status (complete/incomplete)
  toggleComplete(task: Task): void {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index > -1) {
      this.tasks[index].isCompleted = !this.tasks[index].isCompleted;
      this.updateLocalStorage();
      this.updateTaskStats();
    }
  }

  // Delete task by ID
  deleteTask(id: string): void {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.updateLocalStorage();
    this.updateTaskStats();
  }

  // Save task to localStorage
  updateLocalStorage(): void {
    this.taskService.saveTasks(this.tasks);
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

    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index > -1) {
      this.tasks[index].title = this.editedTitle.trim();
      this.updateLocalStorage();
    }

    this.editingTaskId = null;
    this.editedTitle = '';
  }

  // Cancel editing
  cancelEdit(): void {
    this.editingTaskId = null;
    this.editedTitle = '';
  }

  // Get the current user
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }
}