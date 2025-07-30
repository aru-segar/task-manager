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

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.tasks = this.taskService.getTasks();
  }

  // Getter for filtering tasks based on the current filter
  get filteredTasks(): Task[] {
    switch (this.filter) {
      case 'completed': return this.tasks.filter(t => t.isCompleted);
      case 'incomplete': return this.tasks.filter(t => !t.isCompleted);
      default: return this.tasks;
    }
  }

  // Add new task with date and unique ID
  addTask(): void {
    if (!this.taskTitle.trim()) return;

    const newTask: Task = {
      id: uuidv4(),
      title: this.taskTitle.trim(),
      createdAt: new Date(),
      isCompleted: false
    };

    this.tasks.unshift(newTask);
    this.taskTitle = '';
    this.updateLocalStorage();
  }

  // Toggle task status
  toggleComplete(task: Task): void {
    task.isCompleted = !task.isCompleted;
    this.updateLocalStorage();
  }

  // Remove a task by ID
  deleteTask(id: string): void {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.updateLocalStorage();
  }

  updateLocalStorage(): void {
    this.taskService.saveTasks(this.tasks);
  }
}
