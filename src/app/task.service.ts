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

  /**
   * Get scheduled tasks ordered by date
   * @returns The scheduled tasks
   */
  getScheduledTasks(): Task[] {
    return this.sortTasks(this.getTasks().filter(t => t.status === 'scheduled'));
  }

  /**
   * Get done tasks ordered by date
   * @returns The done tasks
   */
  getDoneTasks(): Task[] {
    return this.sortTasks(this.getTasks().filter(t => t.status === 'done'));
  }

  private sortTasks(tasks: Task[]): Task[] {
    return tasks.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  /**
   * Mark a task as done
   * @param taskId - The id of the task to mark as done
   */
  markAsDone(taskId: TaskId): void {
    const tasks: Task[] = this.getTasks().map(t => t.id === taskId ? { ...t, status: 'done' } : t);
    this.saveTasks(tasks);
  }

  /**
   * Compute tasks for a given seed
   * @param seed - The seed to compute tasks for
   * @param clock - The clock to use to compute the tasks
   * @returns The computed tasks
   */
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

  /**
   * Add a task
   * @param task - The task to add
   */
  addTask(task: TaskProperties): void {
    const tasks = this.getScheduledTasks();
    tasks.push({ ...task, id: getNextTaskId(tasks) });
    this.saveTasks(tasks);


    function getNextTaskId(tasks: Task[]): TaskId {
      return (tasks.length + 1).toString();
    }
  }

  /**
   * Remove all tasks
   */
  removeTasks(taskId: TaskId): void {
    const tasks = this.getTasks().filter(t => t.id !== taskId);
    this.saveTasks(tasks);
  }

  /**
   * Remove tasks for a given seed id
   * @param seedId - The id of the seed to remove tasks for
   */
  removeTasksBySeed(seedId: SeedId): void {
    const tasks = this.getTasks().filter(t => t.seedId !== seedId || t.status === 'done');
    this.saveTasks(tasks);
  }

  private getTasks(): Task[] {
    return this.storageService.getItem(this.TASKS_KEY, []).map((t: any) => ({ ...t, date: new Date(t.date) }));
  }

  private saveTasks(tasks: Task[]) {
    this.storageService.setItem(this.TASKS_KEY, tasks.map(t => ({ ...t, date: t.date.toISOString() })));
  }
}

