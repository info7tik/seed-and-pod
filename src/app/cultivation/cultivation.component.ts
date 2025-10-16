import { Component } from '@angular/core';
import { HeaderMenu } from '../header-menu/header-menu.component';
import { TaskService } from '../service/task.service';
import { Task } from '../type/task.type';
import { CommonModule } from '@angular/common';
import { GlobalServiceService } from '../service/global-service.service';
import { TranslocoPipe } from '@jsverse/transloco';

type Month = number;

@Component({
  selector: 'app-cultivation',
  imports: [HeaderMenu, CommonModule, TranslocoPipe],
  templateUrl: './cultivation.component.html',
  styleUrl: './cultivation.component.scss'
})
export class Cultivation {
  scheduledTasks: Map<Month, Task[]> = new Map();
  doneTasks: Task[] = [];
  showDone = false;

  constructor(private taskService: TaskService, private globalService: GlobalServiceService) {
    this.refreshTasks();
  }

  getMonthKey(month: Month) {
    return this.globalService.months.find(m => m.id === month + 1)?.key ?? '';
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
    this.scheduledTasks = this.taskService.groupTasksByMonth(this.taskService.getScheduledTasks());
    this.doneTasks = this.taskService.getDoneTasks();
  }
}
