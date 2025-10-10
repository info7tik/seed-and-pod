import { Injectable } from '@angular/core';
import { StorageService } from './service/storage.service';
import { Task, TaskId, TaskProperties } from './type/task.type';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  public readonly TASKS_KEY = 'tasks';

  constructor(private storageService: StorageService) { }

  getTasks(): Task[] {
    return this.storageService.getItem(this.TASKS_KEY, []).map((t: any) => ({ ...t, date: new Date(t.date) }));
  }

  addTask(task: TaskProperties): void {
    const tasks = this.getTasks();
    tasks.push({ ...task, id: getNextTaskId(tasks) });
    this.storageService.setItem(this.TASKS_KEY, tasks.map(t => ({ ...t, date: t.date.toISOString() })));


    function getNextTaskId(tasks: Task[]): TaskId {
      return (tasks.length + 1).toString();
    }
  }

  removeTask(taskId: TaskId): void {
    const tasks = this.getTasks().filter(t => t.id !== taskId);
    this.storageService.setItem(this.TASKS_KEY, tasks);
  }
}
