import { Injectable } from '@angular/core';
import { StorageService } from './service/storage.service';
import { Task, TaskId, TaskProperties } from './type/task.type';
import { SeedId } from './type/seed-id.type';
import { InventorySeed } from './type/inventory-seed.type';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  public readonly TASKS_KEY = 'tasks';

  constructor(private storageService: StorageService) { }

  getTasks(): Task[] {
    return this.storageService.getItem(this.TASKS_KEY, []).map((t: any) => ({ ...t, date: new Date(t.date) }));
  }

  computeTasks(seed: InventorySeed): Task[] {
    let result: Task[] = [];
    const currentYear = new Date().getFullYear();
    if (seed.sowing.enabled) {
      this.addTask({
        seedId: seed.id,
        name: seed.name,
        date: new Date(seed.sowing.month, seed.sowing.day),
        status: 'scheduled'
      });
    }
    if (seed.transplanting.enabled) {
      this.addTask({
        seedId: seed.id,
        name: seed.name,
        date: new Date(seed.transplanting.month, seed.transplanting.day),
        status: 'scheduled'
      });
    }
    return result;
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
