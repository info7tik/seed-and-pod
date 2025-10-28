import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Task } from '../type/task.type';
import { ClockService } from './clock.service';

@Injectable({
  providedIn: 'root'
})
export class YearService {
  public readonly YEAR_KEY = 'selected-year';
  public readonly YEARS_KEY = 'years';

  constructor(private clockService: ClockService, private storageService: StorageService) { }

  getSelectedYear(): number {
    const savedYear = this.storageService.getData().selectedYear;
    if (savedYear === 0) {
      return this.clockService.now().getFullYear();
    }
    return savedYear;
  }

  saveSelectedYear(year: number): void {
    const data = this.storageService.getData();
    data.selectedYear = year;
    this.storageService.setData(data);
  }

  keepFutureTasks(tasks: Task[]): Task[] {
    return tasks.filter(task => this.clockService.isFuture(task.date));
  }

  getItem<T>(year: number, key: string, defaultValue: T): T {
    const data = this.storageService.getData();
    const yearData = data.years[year];
    if (yearData === undefined) {
      return defaultValue;
    }
    return yearData[key] || defaultValue;
  }

  setItem<T>(year: number, key: string, value: T): void {
    const data = this.storageService.getData();
    if (!(year in data.years)) {
      data.years[year] = {};
    }
    data.years[year][key] = value;
    this.storageService.setData(data);
  }
}
