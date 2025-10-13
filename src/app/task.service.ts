import { Injectable } from '@angular/core';
import { StorageService } from './service/storage.service';
import { Task, TaskId, TaskProperties } from './type/task.type';
import { SeedId } from './type/seed-id.type';
import { InventorySeed, SeedDate } from './type/inventory-seed.type';
import ClockService from './service/clock.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  public readonly TASKS_KEY = 'tasks';

  constructor(private storageService: StorageService) { }

  getTasks(): Task[] {
    return this.storageService.getItem(this.TASKS_KEY, []).map((t: any) => ({ ...t, date: new Date(t.date) }));
  }

  computeTasks(seed: InventorySeed, clock: ClockService = new ClockService()): TaskProperties[] {
    let result: TaskProperties[] = [];
    if (seed.sowing.enabled) {
      result.push({
        seedId: seed.id,
        name: seed.name,
        date: this.buildFutureDate(clock.now(), seed.sowing),
        status: 'scheduled'
      });
    }
    if (seed.transplanting.enabled) {
      result.push({
        seedId: seed.id,
        name: seed.name,
        date: this.buildFutureDate(clock.now(), seed.transplanting),
        status: 'scheduled'
      });
    }
    return result;
  }

  private buildFutureDate(now: Date, seedDate: SeedDate): Date {
    const date = new Date(now.getFullYear(), seedDate.month, seedDate.day);
    if (date < now) {
      date.setFullYear(now.getFullYear() + 1);
    }
    return date;
  }

  addTask(task: TaskProperties): void {
    const tasks = this.getTasks();
    tasks.push({ ...task, id: getNextTaskId(tasks) });
    this.storageService.setItem(this.TASKS_KEY, tasks.map(t => ({ ...t, date: t.date.toISOString() })));


    function getNextTaskId(tasks: Task[]): TaskId {
      return (tasks.length + 1).toString();
    }
  }

  removeTasks(seedId: SeedId): void {
    const tasks = this.getTasks().filter(t => t.seedId !== seedId);
    this.storageService.setItem(this.TASKS_KEY, tasks);
  }
}

