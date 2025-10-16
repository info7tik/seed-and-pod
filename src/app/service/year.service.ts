import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Task, TaskProperties } from '../type/task.type';
import { ClockService } from './clock.service';

@Injectable({
  providedIn: 'root'
})
export class YearService {
  public readonly YEAR_KEY = 'selected-year';

  constructor(private clockService: ClockService, private storageService: StorageService) { }

  getSelectedYear(): number {
    return this.storageService.getItem(this.YEAR_KEY, this.clockService.now().getFullYear());
  }

  saveSelectedYear(year: number): void {
    this.storageService.setItem(this.YEAR_KEY, year);
  }

  keepFutureTasks(tasks: TaskProperties[]): TaskProperties[] {
    return tasks.filter(task => this.clockService.isFuture(task.date));
  }
}
