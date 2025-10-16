import { Component } from '@angular/core';
import { HeaderMenu } from '../header-menu/header-menu.component';
import { TaskService } from '../service/task.service';
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
  doneTasks: Task[] = [];
  showDone = false;

  constructor(private taskService: TaskService) {
    this.refreshTasks();
  }

  markAsDone(taskId: string) {
    this.taskService.markAsDone(taskId, new Date());
    this.refreshTasks();
  }

  delete(taskId: string) {
    this.taskService.removeTasks(taskId);
    this.refreshTasks();
  }

  toggleShowDone() {
    this.showDone = !this.showDone;
  }

  private refreshTasks() {
    this.tasks = this.taskService.getScheduledTasks();
    this.doneTasks = this.taskService.getDoneTasks();
  }
}
