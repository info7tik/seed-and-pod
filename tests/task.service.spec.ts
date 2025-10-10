import test from '@playwright/test';
import { MockStorageService } from '../src/app/mock/mock-storage-service';
import { TaskService } from '../src/app/task.service';

const taskDate = '2025-01-21';
const taskName = 'Task 1';
const taskStatus = 'scheduled';

test('getTasks()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new TaskService(mockStorageService);
  mockStorageService.setItem(service.TASKS_KEY, []);
  test.expect(service.getTasks().length).toBe(0);
  mockStorageService.setItem(service.TASKS_KEY, fillWithOneTask());
  const tasks = service.getTasks();
  test.expect(tasks.length).toBe(1);
  test.expect(tasks[0].id).toBe('1');
  test.expect(tasks[0].name).toBe(taskName);
  test.expect(tasks[0].date).toEqual(new Date(taskDate));
  test.expect(tasks[0].status).toBe(taskStatus);
});

test('addTask()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new TaskService(mockStorageService);
  test.expect(service.getTasks().length).toBe(0);
  service.addTask({ name: taskName, date: new Date(taskDate), status: taskStatus });
  service.addTask({ name: taskName, date: new Date(taskDate), status: taskStatus });
  test.expect(service.getTasks().length).toBe(2);
});

test('removeTask()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new TaskService(mockStorageService);
  mockStorageService.setItem(service.TASKS_KEY, fillWithTwoTasks());
  const tasks = service.getTasks();
  test.expect(service.getTasks().length).toBe(2);
  const removedTaskId = tasks[0].id;
  service.removeTask(removedTaskId);
  const remainingTasks = service.getTasks();
  test.expect(remainingTasks.length).toBe(1);
  test.expect(remainingTasks[0].id).not.toBe(removedTaskId);
});

function fillWithOneTask(): any[] {
  return [{ id: '1', name: taskName, date: taskDate, status: taskStatus }];
}

function fillWithTwoTasks(): any[] {
  return [{ id: '1', name: taskName, date: taskDate, status: taskStatus }, { id: '2', name: "Task 2", date: "2025-01-22", status: "done" }];
}