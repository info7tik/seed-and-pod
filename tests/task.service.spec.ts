import test from '@playwright/test';
import { MockStorageService } from '../src/app/mock/mock-storage.service';
import { TaskService } from '../src/app/task.service';
import { DataBuilderService } from '../src/app/mock/data-builder.service';

const dataBuilderService = new DataBuilderService();

test('getTasks()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new TaskService(mockStorageService);
  mockStorageService.setItem(service.TASKS_KEY, []);
  test.expect(service.getTasks().length).toBe(0);
  mockStorageService.setItem(service.TASKS_KEY, dataBuilderService.buildOneTask());
  const tasks = service.getTasks();
  test.expect(tasks.length).toBe(1);
  test.expect(tasks[0].id).toBe('1');
  test.expect(tasks[0].name).toBe(dataBuilderService.taskName);
  test.expect(tasks[0].date).toEqual(new Date(dataBuilderService.taskDate));
  test.expect(tasks[0].status).toBe(dataBuilderService.taskStatus);
});

test('addTask()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new TaskService(mockStorageService);
  test.expect(service.getTasks().length).toBe(0);
  service.addTask({ seedId: dataBuilderService.seedId, name: dataBuilderService.taskName, date: new Date(dataBuilderService.taskDate), status: dataBuilderService.taskStatus });
  service.addTask({ seedId: dataBuilderService.seedId, name: dataBuilderService.taskName, date: new Date(dataBuilderService.taskDate), status: "ignored" });
  const tasks = service.getTasks();
  test.expect(tasks.length).toBe(2);
  test.expect(tasks[0].seedId).toBe(dataBuilderService.seedId);
  test.expect(tasks[0].name).toBe(dataBuilderService.taskName);
  test.expect(tasks[0].date).toEqual(new Date(dataBuilderService.taskDate));
  test.expect(tasks[0].status).toBe(dataBuilderService.taskStatus);
  test.expect(tasks[1].seedId).toBe(dataBuilderService.seedId);
  test.expect(tasks[1].name).toBe(dataBuilderService.taskName);
  test.expect(tasks[1].date).toEqual(new Date(dataBuilderService.taskDate));
  test.expect(tasks[1].status).toBe("ignored");
});

test('removeTask()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new TaskService(mockStorageService);
  mockStorageService.setItem(service.TASKS_KEY, dataBuilderService.buildTwoTasks());
  const tasks = service.getTasks();
  test.expect(service.getTasks().length).toBe(2);
  const removedTaskId = tasks[0].seedId;
  service.removeTasks(removedTaskId);
  const remainingTasks = service.getTasks();
  test.expect(remainingTasks.length).toBe(1);
  test.expect(remainingTasks[0].id).not.toBe(removedTaskId);
});

test('computeTasks()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new TaskService(mockStorageService);
  const tasks = service.computeTasks(dataBuilderService.buildTomatoSeeds()[0]);
  test.expect(tasks.length).toBe(2);
});
