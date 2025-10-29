import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Task, TaskAction, TaskId, TaskWithStringDate } from '../type/task.type';
import { SeedId } from '../type/seed-id.type';
import { InventorySeed, SeedDate } from '../type/inventory-seed.type';
import { YearService } from './year.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  public readonly TASKS_KEY = 'tasks';

  constructor(private yearService: YearService) { }

  /**
   * Get scheduled tasks ordered by date
   * @returns The scheduled tasks
   */
  getScheduledTasks(): Task[] {
    return this.sortScheduledTasks(this.getTasks().filter(t => t.status === 'scheduled'));
  }

  private sortScheduledTasks(tasks: Task[]): Task[] {
    return tasks.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  /**
   * Group tasks by month
   * @param tasks - The tasks to group
   * @returns A map of month to tasks
   */
  groupTasksByMonth(tasks: Task[]): Map<number, Task[]> {
    const tasksByMonth = new Map<number, Task[]>();
    for (const task of tasks) {
      const month = task.date.getMonth();
      if (!tasksByMonth.has(month)) {
        tasksByMonth.set(month, []);
      }
      tasksByMonth.get(month)!.push(task);
    }
    return tasksByMonth;
  }

  /**
   * Get done tasks ordered by date
   * @returns The done tasks
   */
  getDoneTasks(): Task[] {
    return this.sortDoneTasks(this.getTasks().filter(t => t.status === 'done'));
  }

  private sortDoneTasks(tasks: Task[]): Task[] {
    return tasks.sort((a, b) => a.completed.getTime() - b.completed.getTime());
  }

  /**
   * Mark a task as done
   * @param taskId - The id of the task to mark as done
   */
  markAsDone(taskId: TaskId, completedDate: Date): void {
    const tasks: Task[] = this.getTasks().map(t => t.id === taskId ? { ...t, status: 'done', completed: completedDate } : t);
    this.saveTasks(tasks);
  }

  /**
   * Compute tasks for a given seed
   * @param seed - The seed to compute tasks for
   * @param year - The year used to build the new tasks
   * @returns The future tasks associated to the seed
   */
  computeTasks(seed: InventorySeed, year: number): Task[] {
    let result: Task[] = [];
    if (seed.sowing.enabled) {
      result.push({
        id: this.buildTaskId(seed.id, 'sowing'),
        seedId: seed.id,
        seedName: seed.name,
        action: 'sowing',
        date: this.buildTaskDate(year, seed.sowing),
        status: 'scheduled',
        completed: new Date()
      });
    }
    if (seed.transplanting.enabled) {
      result.push({
        id: this.buildTaskId(seed.id, 'transplanting'),
        seedId: seed.id,
        seedName: seed.name,
        action: 'transplanting',
        date: this.buildTaskDate(year, seed.transplanting),
        status: 'scheduled',
        completed: new Date()
      });
    }
    return result;
  }

  private buildTaskDate(year: number, seedDate: SeedDate): Date {
    return new Date(year, seedDate.month - 1, seedDate.day);
  }

  private buildTaskId(seedId: SeedId, action: TaskAction): TaskId {
    return `${seedId}-${action}`;
  }

  /**
   * Update a task or add a task if it doesn't exist
   * @param task - The task to add or update
   */
  updateTask(task: Task): void {
    const tasks = this.getTasks();
    const taskToUpdate = tasks.find(t => t.id === task.id);
    if (taskToUpdate) {
      if (taskToUpdate.status === 'scheduled' && taskToUpdate.date.getTime() !== task.date.getTime()) {
        taskToUpdate.date = task.date;
        this.saveTasks(tasks);
      }
    } else {
      tasks.push(task);
      this.saveTasks(tasks);
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
    return this.yearService.getItemByYear(this.TASKS_KEY, []).map((t: TaskWithStringDate) => ({ ...t, date: new Date(t.date), completed: new Date(t.completed) }));
  }

  private saveTasks(tasks: Task[]) {
    this.yearService.setItemByYear(this.TASKS_KEY, tasks.map(t => ({ ...t, date: t.date.toISOString(), completed: t.completed.toISOString() })));
  }
}

