import { Component } from '@angular/core';
import { HeaderMenu } from '../header-menu/header-menu.component';
import { TaskService } from '../task.service';
import { Task } from '../type/task.type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cultivation',
  imports: [HeaderMenu, CommonModule],
  templateUrl: './cultivation.component.html',
  styleUrl: './cultivation.component.scss'
})
export class Cultivation {
  tasks: Task[] = [];

  constructor(private taskService: TaskService) {
    this.tasks = this.taskService.getScheduledTasks();
  }

  markDone(taskId: string) {
    this.updateTaskStatus(taskId, 'done');
  }

  delete(taskId: string) {
    this.updateTaskStatus(taskId, 'ignored');
  }

  private updateTaskStatus(taskId: string, status: 'done' | 'ignored') {
    this.tasks = this.tasks.map(t => t.id === taskId ? { ...t, status } : t);
    // Persist back to storage
    // Note: TaskService currently doesn't expose update; reuse storage key
    (this.taskService as any).storageService.setItem(this.taskService.TASKS_KEY, this.tasks);
  }
}
