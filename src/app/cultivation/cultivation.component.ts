import { Component } from '@angular/core';
import { HeaderMenu } from '../header-menu/header-menu.component';
import { TaskService } from '../service/task.service';
import { Task } from '../type/task.type';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../service/global-service.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { YearSelectorComponent } from '../year-selector/year-selector.component';

type Month = number;

@Component({
  selector: 'app-cultivation',
  imports: [HeaderMenu, YearSelectorComponent, CommonModule, TranslocoPipe],
  templateUrl: './cultivation.component.html',
  styleUrl: './cultivation.component.scss'
})
export class Cultivation {
  reloadDataCallback = () => this.reloadData();
  scheduledTasks: Map<Month, Task[]> = new Map();
  doneTasks: Task[] = [];
  showDone = false;

  constructor(private taskService: TaskService, private globalService: GlobalService) {
    this.reloadData();
  }

  getMonthKey(month: Month) {
    return this.globalService.months.find(m => m.id === month + 1)?.key ?? '';
  }

  markAsDone(taskId: string) {
    this.taskService.markAsDone(taskId, new Date());
    this.reloadData();
  }

  cancelDone(taskId: string) {
    this.taskService.markAsScheduled(taskId);
    this.reloadData();
  }

  delete(taskId: string) {
    this.taskService.removeTasks(taskId);
    this.reloadData();
  }

  toggleShowDone() {
    this.showDone = !this.showDone;
  }

  reloadData(): void {
    this.scheduledTasks = this.taskService.groupTasksByMonth(this.taskService.getScheduledTasks());
    this.doneTasks = this.taskService.getDoneTasks();
  }
}
