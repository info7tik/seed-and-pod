import test from '@playwright/test';
import { MockStorageService } from '../src/app/mock/mock-storage.service';
import { TaskService } from '../src/app/service/task.service';
import { DataBuilderService } from '../src/app/mock/data-builder.service';
import { Task } from '../src/app/type/task.type';

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
  test.expect(tasks[0].id).toBe(`${dataBuilderService.seedId}-sowing`);
  test.expect(tasks[0].seedName).toBe(dataBuilderService.taskName);
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
  test.expect(tasks[0].seedName).toBe('Task 1');
  test.expect(tasks[1].seedName).toBe('Task 2');
  test.expect(tasks[2].seedName).toBe('Task 3');
  test.expect(tasks[3].seedName).toBe('Task 4');
});

test('getDoneTasks()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new TaskService(mockStorageService);
  mockStorageService.setItem(service.TASKS_KEY, dataBuilderService.buildScheduledAndDoneTasks());
  const tasks = service.getDoneTasks();
  test.expect(tasks.length).toBe(1);
  test.expect(tasks[0].id).toBe(`${dataBuilderService.seedIdWithMultipleTasks}-transplanting`);
  test.expect(tasks[0].seedName).toBe("Task 2");
  test.expect(tasks[0].status).toBe("done");
});

test('markAsDone()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new TaskService(mockStorageService);
  mockStorageService.setItem(service.TASKS_KEY, dataBuilderService.buildUnorderedTasks('scheduled'));
  test.expect(service.getScheduledTasks().length).toBe(4);
  const markAsDoneTaskId = `${dataBuilderService.seedId}-sowing`;
  service.markAsDone(markAsDoneTaskId);
  test.expect(service.getScheduledTasks().length).toBe(3);
  test.expect(service.getDoneTasks().length).toBe(1);
  test.expect(service.getDoneTasks().some(t => t.id === markAsDoneTaskId)).toBe(true);
});

test('updateTask()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new TaskService(mockStorageService);
  test.expect(service.getScheduledTasks().length).toBe(0);
  service.updateTask({
    id: `${dataBuilderService.tomatoSeedId}-sowing`, seedId: dataBuilderService.tomatoSeedId,
    action: "sowing", seedName: dataBuilderService.taskName,
    date: new Date(dataBuilderService.taskDate), status: dataBuilderService.taskStatus
  });
  service.updateTask({
    id: `${dataBuilderService.seedId}-transplanting`, seedId: dataBuilderService.seedId,
    action: "transplanting", seedName: dataBuilderService.taskName,
    date: new Date(dataBuilderService.taskDate), status: "scheduled"
  });
  const tasks = service.getScheduledTasks();
  test.expect(tasks.length).toBe(2);
  test.expect(tasks[0].seedId).toBe(dataBuilderService.tomatoSeedId);
  test.expect(tasks[0].seedName).toBe(dataBuilderService.taskName);
  test.expect(tasks[0].action).toBe("sowing");
  test.expect(tasks[0].date).toEqual(new Date(dataBuilderService.taskDate));
  test.expect(tasks[0].status).toBe(dataBuilderService.taskStatus);
  test.expect(tasks[1].seedId).toBe(dataBuilderService.seedId);
  test.expect(tasks[1].seedName).toBe(dataBuilderService.taskName);
  test.expect(tasks[1].action).toBe("transplanting");
  test.expect(tasks[1].date).toEqual(new Date(dataBuilderService.taskDate));
});

test('updateTask() with existing tasks', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new TaskService(mockStorageService);
  mockStorageService.setItem(service.TASKS_KEY, dataBuilderService.buildSowingTomatoTask());
  test.expect(service.getScheduledTasks().length).toBe(1);
  service.updateTask({
    id: `${dataBuilderService.tomatoSeedId}-sowing`, seedId: dataBuilderService.tomatoSeedId,
    action: "sowing", seedName: dataBuilderService.taskName,
    date: new Date(dataBuilderService.taskDate), status: dataBuilderService.taskStatus
  });
  service.updateTask({
    id: `${dataBuilderService.tomatoSeedId}-transplanting`, seedId: dataBuilderService.tomatoSeedId,
    action: "transplanting", seedName: dataBuilderService.taskName,
    date: new Date(dataBuilderService.taskDate), status: "scheduled"
  });
  const tasks = service.getScheduledTasks();
  test.expect(tasks.length).toBe(2);
  test.expect(tasks[0].seedId).toBe(dataBuilderService.tomatoSeedId);
  test.expect(tasks[0].seedName).toBe(dataBuilderService.taskName);
  test.expect(tasks[0].action).toBe("sowing");
  test.expect(tasks[0].date).toEqual(new Date(dataBuilderService.taskDate));
  test.expect(tasks[0].status).toBe(dataBuilderService.taskStatus);
  test.expect(tasks[1].seedId).toBe(dataBuilderService.tomatoSeedId);
  test.expect(tasks[1].seedName).toBe(dataBuilderService.taskName);
  test.expect(tasks[1].action).toBe("transplanting");
  test.expect(tasks[1].date).toEqual(new Date(dataBuilderService.taskDate));
});

test('updateTask() with existing tasks and different date', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new TaskService(mockStorageService);
  mockStorageService.setItem(service.TASKS_KEY, dataBuilderService.buildTransplantingTomatoTask());
  test.expect(service.getScheduledTasks().length).toBe(1);
  service.updateTask({
    id: `${dataBuilderService.tomatoSeedId}-sowing`, seedId: dataBuilderService.tomatoSeedId,
    action: "sowing", seedName: dataBuilderService.taskName,
    date: new Date(dataBuilderService.taskDate), status: dataBuilderService.taskStatus
  });
  service.updateTask({
    id: `${dataBuilderService.tomatoSeedId}-transplanting`, seedId: dataBuilderService.tomatoSeedId,
    action: "transplanting", seedName: dataBuilderService.taskName,
    date: new Date(dataBuilderService.taskDate), status: "scheduled"
  });
  const tasks = service.getScheduledTasks();
  test.expect(tasks.length).toBe(2);
  test.expect(tasks[0].seedId).toBe(dataBuilderService.tomatoSeedId);
  test.expect(tasks[0].seedName).toBe(dataBuilderService.taskName);
  test.expect(tasks[0].action).toBe("sowing");
  test.expect(tasks[0].date).toEqual(new Date(dataBuilderService.taskDate));
  test.expect(tasks[0].status).toBe(dataBuilderService.taskStatus);
  test.expect(tasks[1].seedId).toBe(dataBuilderService.tomatoSeedId);
  test.expect(tasks[1].seedName).toBe(dataBuilderService.taskName);
  test.expect(tasks[1].action).toBe("transplanting");
  test.expect(tasks[1].date).toEqual(new Date(dataBuilderService.taskDate));
});

test('updateTask() with existing done tasks and different date', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new TaskService(mockStorageService);
  const doneTomatoTask = dataBuilderService.buildTransplantingTomatoTask()
  doneTomatoTask[0].status = 'done';
  mockStorageService.setItem(service.TASKS_KEY, doneTomatoTask);
  test.expect(service.getScheduledTasks().length).toBe(0);
  service.updateTask({
    id: `${dataBuilderService.tomatoSeedId}-sowing`, seedId: dataBuilderService.tomatoSeedId,
    action: "sowing", seedName: dataBuilderService.taskName,
    date: new Date(dataBuilderService.taskDate), status: dataBuilderService.taskStatus
  });
  service.updateTask({
    id: `${dataBuilderService.tomatoSeedId}-transplanting`, seedId: dataBuilderService.tomatoSeedId,
    action: "transplanting", seedName: dataBuilderService.taskName,
    date: new Date(dataBuilderService.taskDate), status: "scheduled"
  });
  const tasks = service.getScheduledTasks();
  test.expect(tasks.length).toBe(1);
  test.expect(tasks[0].seedId).toBe(dataBuilderService.tomatoSeedId);
  test.expect(tasks[0].seedName).toBe(dataBuilderService.taskName);
  test.expect(tasks[0].action).toBe("sowing");
  const done = service.getDoneTasks();
  test.expect(done[0].date.getTime()).not.toEqual(new Date(dataBuilderService.taskDate).getTime()), "Done task date should not be updated";
});

test('removeTasks()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new TaskService(mockStorageService);
  mockStorageService.setItem(service.TASKS_KEY, dataBuilderService.buildUnorderedTasks('scheduled'));
  test.expect(service.getScheduledTasks().length).toBe(4);
  const taskToRemoveId = `${dataBuilderService.seedId}-sowing`;
  service.removeTasks(taskToRemoveId);
  test.expect(service.getScheduledTasks().length).toBe(3);
  test.expect(service.getScheduledTasks().some(t => t.id === taskToRemoveId)).toBe(false);
});

test('removeTasksBySeed()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new TaskService(mockStorageService);
  mockStorageService.setItem(service.TASKS_KEY, dataBuilderService.buildUnorderedTasks('scheduled'));
  const tasks = service.getScheduledTasks();
  test.expect(tasks.length).toBe(4);
  service.removeTasksBySeed(dataBuilderService.seedIdWithMultipleTasks);
  const remainingTasks = service.getScheduledTasks();
  test.expect(remainingTasks.length).toBe(2);
  test.expect(remainingTasks.some(t => t.id === dataBuilderService.seedIdWithMultipleTasks)).toBe(false);
});

test('removeTasksBySeed() - do not remove done tasks', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new TaskService(mockStorageService);
  mockStorageService.setItem(service.TASKS_KEY, dataBuilderService.buildScheduledAndDoneTasks());
  test.expect(service.getScheduledTasks().length).toBe(1);
  test.expect(service.getDoneTasks().length).toBe(1);
  service.removeTasksBySeed(dataBuilderService.seedIdWithMultipleTasks);
  test.expect(service.getScheduledTasks().length).toBe(1);
  test.expect(service.getDoneTasks().length).toBe(1);
});

test('computeTasks()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new TaskService(mockStorageService);
  const tasks = service.computeTasks(dataBuilderService.buildTomatoSeeds()[0], 2021);
  test.expect(tasks.length).toBe(2);
  test.expect(tasks[0].date.getDate()).toBe(dataBuilderService.tomatoSowingDate.day)
  test.expect(tasks[0].date.getMonth()).toBe(dataBuilderService.tomatoSowingDate.month)
  test.expect(tasks[0].date.getFullYear()).toBe(2021)
  test.expect(tasks[1].date.getDate()).toBe(dataBuilderService.tomatoTransplantingDate.day)
  test.expect(tasks[1].date.getMonth()).toBe(dataBuilderService.tomatoTransplantingDate.month)
  test.expect(tasks[1].date.getFullYear()).toBe(2021)
});
