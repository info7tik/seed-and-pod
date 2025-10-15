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
        seedName: seed.name,
        action: 'sowing',
        date: this.buildFutureDate(clock.now(), seed.sowing),
        status: 'scheduled'
      });
    }
    if (seed.transplanting.enabled) {
      result.push({
        seedId: seed.id,
        seedName: seed.name,
        action: 'transplanting',
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
   * Update a task or add a task if it doesn't exist
   * @param task - The task to add or update
   */
  updateTask(task: TaskProperties): void {
    const tasks = this.getScheduledTasks();
    const sameTask = tasks.find((t) => t.seedId === task.seedId && t.action === task.action);
    if (sameTask) {
      if (sameTask.date.getTime() !== task.date.getTime()) {
        sameTask.date = task.date;
        this.saveTasks(tasks);
      }
      return;
    } else {
      tasks.push({ ...task, id: getNextTaskId(tasks) });
      this.saveTasks(tasks);
    }

    //TODO FIX the task id generation is wrong when tasks are removed
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

