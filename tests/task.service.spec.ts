import test from '@playwright/test';
import { MockClockService } from '../src/app/mock/mock-clock.service'
import { MockStorageService } from '../src/app/mock/mock-storage.service';
import { TaskService } from '../src/app/task.service';
import { DataBuilderService } from '../src/app/mock/data-builder.service';

const dataBuilderService = new DataBuilderService();

test('getScheduledTasks()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new TaskService(mockStorageService);
  mockStorageService.setItem(service.TASKS_KEY, []);
  test.expect(service.getScheduledTasks().length).toBe(0);
  mockStorageService.setItem(service.TASKS_KEY, dataBuilderService.buildScheduledAndDoneTasks());
  const tasks = service.getScheduledTasks();
  test.expect(tasks.length).toBe(1);
  test.expect(tasks[0].id).toBe('1');
  test.expect(tasks[0].name).toBe(dataBuilderService.taskName);
  test.expect(tasks[0].date).toEqual(new Date(dataBuilderService.taskDate));
  test.expect(tasks[0].status).toBe(dataBuilderService.taskStatus);
});

test('getScheduledTasks() - check order', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new TaskService(mockStorageService);
  mockStorageService.setItem(service.TASKS_KEY, dataBuilderService.buildUnorderedTasks('scheduled'));
  const tasks = service.getScheduledTasks();
  test.expect(tasks.length).toBe(4);
  test.expect(tasks[0].id).toBe('1');
  test.expect(tasks[1].id).toBe('2');
  test.expect(tasks[2].id).toBe('3');
  test.expect(tasks[3].id).toBe('4');
});

test('getDoneTasks()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new TaskService(mockStorageService);
  mockStorageService.setItem(service.TASKS_KEY, dataBuilderService.buildScheduledAndDoneTasks());
  const tasks = service.getDoneTasks();
  test.expect(tasks.length).toBe(1);
  test.expect(tasks[0].id).toBe('2');
  test.expect(tasks[0].name).toBe("Task 2");
  test.expect(tasks[0].status).toBe("done");
});

test('addTask()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new TaskService(mockStorageService);
  test.expect(service.getScheduledTasks().length).toBe(0);
  service.addTask({ seedId: dataBuilderService.seedId, name: dataBuilderService.taskName, date: new Date(dataBuilderService.taskDate), status: dataBuilderService.taskStatus });
  service.addTask({ seedId: dataBuilderService.seedId, name: dataBuilderService.taskName, date: new Date(dataBuilderService.taskDate), status: "ignored" });
  const tasks = service.getScheduledTasks();
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
  mockStorageService.setItem(service.TASKS_KEY, dataBuilderService.buildUnorderedTasks('scheduled'));
  const tasks = service.getScheduledTasks();
  test.expect(tasks.length).toBe(4);
  service.removeTasks(dataBuilderService.seedIdWithMultipleTasks);
  const remainingTasks = service.getScheduledTasks();
  test.expect(remainingTasks.length).toBe(1);
  test.expect(remainingTasks.some(t => t.id === dataBuilderService.seedIdWithMultipleTasks)).toBe(false);
});

test('computeTasks() in the same year', () => {
  const now = new Date(2021, 2, 23);
  const clock = new MockClockService(now);
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new TaskService(mockStorageService);
  const tasks = service.computeTasks(dataBuilderService.buildTomatoSeeds()[0], clock);
  test.expect(tasks.length).toBe(2);
  test.expect(tasks[0].date.getDate()).toBe(dataBuilderService.tomatoSowingDate.day)
  test.expect(tasks[0].date.getMonth()).toBe(dataBuilderService.tomatoSowingDate.month)
  test.expect(tasks[0].date.getFullYear()).toBe(2021)
  test.expect(tasks[1].date.getDate()).toBe(dataBuilderService.tomatoTransplantingDate.day)
  test.expect(tasks[1].date.getMonth()).toBe(dataBuilderService.tomatoTransplantingDate.month)
  test.expect(tasks[1].date.getFullYear()).toBe(2021)
});

test('computeTasks() in the next year', () => {
  const now = new Date(2021, 11, 23);
  const clock = new MockClockService(now);
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new TaskService(mockStorageService);
  const tasks = service.computeTasks(dataBuilderService.buildTomatoSeeds()[0], clock);
  test.expect(tasks.length).toBe(2);
  test.expect(tasks[0].date.getDate()).toBe(dataBuilderService.tomatoSowingDate.day)
  test.expect(tasks[0].date.getMonth()).toBe(dataBuilderService.tomatoSowingDate.month)
  test.expect(tasks[0].date.getFullYear()).toBe(2022)
  test.expect(tasks[1].date.getDate()).toBe(dataBuilderService.tomatoTransplantingDate.day)
  test.expect(tasks[1].date.getMonth()).toBe(dataBuilderService.tomatoTransplantingDate.month)
  test.expect(tasks[1].date.getFullYear()).toBe(2022)
});
