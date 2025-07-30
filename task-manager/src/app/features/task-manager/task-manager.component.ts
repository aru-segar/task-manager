import { Component, OnInit } from '@angular/core';
import { Task } from '../../core/models/task.model'
import { TaskService } from '../../services/task.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.scss']
})
export class TaskManagerComponent implements OnInit {
  taskTitle = '';
  tasks: Task[] = [];
  filter: 'all' | 'completed' | 'incomplete' = 'all';

  constructor(private taskService: TaskService) { }

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

    this.tasks.unshift(newTask); // New Task at top
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
