import { Injectable } from '@angular/core';
import { Task } from '../core/models/task.model';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private readonly STORAGE_KEY = 'task_list';  // Defined key

    // Retrieves all tasks from browser's localStorage and returns an array of Task 
    getTasks(): Task[] {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    // Saves all tasks to localStorage under a defined key
    saveTasks(tasks: Task[]): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    }
}
