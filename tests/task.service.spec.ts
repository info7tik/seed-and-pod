import test from '@playwright/test';
import { DataBuilderService } from '../src/app/mock/data-builder.service';
import { MockFactory } from '../src/app/mock/mock-factory';

const dataBuilderService = new DataBuilderService();

test('getScheduledTasks()', () => {
  MockFactory.initializeMocks();
  const service = MockFactory.taskService;
  MockFactory.storageService.setData({ years: { [2022]: { [service.TASKS_KEY]: [] } }, permanent: {}, selectedYear: 2022 });
  test.expect(service.getScheduledTasks().length).toBe(0);
  MockFactory.storageService.setData({ years: { [2022]: { [service.TASKS_KEY]: dataBuilderService.buildScheduledAndDoneTasks() } }, permanent: {}, selectedYear: 2022 });
  const tasks = service.getScheduledTasks();
  test.expect(tasks.length).toBe(1);
  test.expect(tasks[0].id).toBe(`${dataBuilderService.peasSeedId}-sowing`);
  test.expect(tasks[0].seedName).toBe(dataBuilderService.taskName);
  test.expect(tasks[0].date).toEqual(new Date(dataBuilderService.taskDate));
  test.expect(tasks[0].status).toBe(dataBuilderService.taskStatus);
});

test('getScheduledTasks() - check order', () => {
  MockFactory.initializeMocks();
  const service = MockFactory.taskService;
  MockFactory.storageService.setData({ years: { [2022]: { [service.TASKS_KEY]: dataBuilderService.buildUnorderedTasks('scheduled') } }, permanent: {}, selectedYear: 2022 });
  const tasks = service.getScheduledTasks();
  test.expect(tasks.length).toBe(4);
  test.expect(tasks[0].seedName).toBe('Task 1');
  test.expect(tasks[1].seedName).toBe('Task 2');
  test.expect(tasks[2].seedName).toBe('Task 3');
  test.expect(tasks[3].seedName).toBe('Task 4');
});

test('getDoneTasks()', () => {
  MockFactory.initializeMocks();
  const service = MockFactory.taskService;
  MockFactory.storageService.setData({ years: { [2022]: { [service.TASKS_KEY]: dataBuilderService.buildScheduledAndDoneTasks() } }, permanent: {}, selectedYear: 2022 });
  const tasks = service.getDoneTasks();
  test.expect(tasks.length).toBe(1);
  test.expect(tasks[0].id).toBe(`${dataBuilderService.seedIdWithMultipleTasks}-transplanting`);
  test.expect(tasks[0].seedName).toBe("Task 2");
  test.expect(tasks[0].status).toBe("done");
});

test('groupTasksByMonth()', () => {
  MockFactory.initializeMocks();
  const service = MockFactory.taskService;
  const tasks = dataBuilderService.buildTasks(dataBuilderService.buildUnorderedTasks('scheduled'));
  const tasksByMonth = service.groupTasksByMonth(tasks);
  test.expect(tasksByMonth.size).toBe(3);
  test.expect(Array.from(tasksByMonth.keys()).sort()).toEqual([0, 1, 5]);
  test.expect(tasksByMonth.get(0)?.length).toBe(1);
  test.expect(tasksByMonth.get(1)?.length).toBe(1);
  test.expect(tasksByMonth.get(5)?.length).toBe(2);
  const juneTaskNames = tasksByMonth.get(5)?.map(t => t.seedName).sort();
  test.expect(juneTaskNames).toEqual(['Task 1', 'Task 4']);
});

test('markAsDone()', () => {
  MockFactory.initializeMocks();
  const service = MockFactory.taskService;
  MockFactory.storageService.setData({ years: { [2022]: { [service.TASKS_KEY]: dataBuilderService.buildUnorderedTasks('scheduled') } }, permanent: {}, selectedYear: 2022 });
  test.expect(service.getScheduledTasks().length).toBe(4);
  const markAsDoneTaskId = `${dataBuilderService.peasSeedId}-sowing`;
  const completedDate = new Date(2022, 5, 21);
  service.markAsDone(markAsDoneTaskId, completedDate);
  test.expect(service.getScheduledTasks().length).toBe(3);
  test.expect(service.getDoneTasks().length).toBe(1);
  const doneTask = service.getDoneTasks()[0];
  test.expect(doneTask.id).toBe(markAsDoneTaskId);
  test.expect(doneTask.status).toBe("done");
  test.expect(doneTask.completed).toEqual(completedDate);
});

test('markAsDone() - task not found', () => {
  MockFactory.initializeMocks();
  const service = MockFactory.taskService;
  test.expect(() => service.markAsDone('not-found', new Date())).toThrow();
});

test('markAsScheduled()', () => {
  MockFactory.initializeMocks();
  const service = MockFactory.taskService;
  MockFactory.storageService.setData({ years: { [2022]: { [service.TASKS_KEY]: dataBuilderService.buildScheduledAndDoneTasks() } }, permanent: {}, selectedYear: 2022 });
  test.expect(service.getScheduledTasks().length).toBe(1);
  test.expect(service.getDoneTasks().length).toBe(1);
  const markAsScheduledTaskId = `${dataBuilderService.seedIdWithMultipleTasks}-transplanting`;
  service.markAsScheduled(markAsScheduledTaskId);
  test.expect(service.getScheduledTasks().length).toBe(2);
  test.expect(service.getDoneTasks().length).toBe(0);
});

test('updateTask()', () => {
  MockFactory.initializeMocks();
  const service = MockFactory.taskService;
  test.expect(service.getScheduledTasks().length).toBe(0);
  service.updateTask({
    id: `${dataBuilderService.tomatoSeedId}-sowing`, seedId: dataBuilderService.tomatoSeedId,
    action: "sowing", seedName: dataBuilderService.taskName,
    date: new Date(dataBuilderService.taskDate), status: dataBuilderService.taskStatus, completed: new Date()
  });
  service.updateTask({
    id: `${dataBuilderService.peasSeedId}-transplanting`, seedId: dataBuilderService.peasSeedId,
    action: "transplanting", seedName: dataBuilderService.taskName,
    date: new Date(dataBuilderService.taskDate), status: "scheduled", completed: new Date()
  });
  const tasks = service.getScheduledTasks();
  test.expect(tasks.length).toBe(2);
  test.expect(tasks[0].seedId).toBe(dataBuilderService.tomatoSeedId);
  test.expect(tasks[0].seedName).toBe(dataBuilderService.taskName);
  test.expect(tasks[0].action).toBe("sowing");
  test.expect(tasks[0].date).toEqual(new Date(dataBuilderService.taskDate));
  test.expect(tasks[0].status).toBe(dataBuilderService.taskStatus);
  test.expect(tasks[1].seedId).toBe(dataBuilderService.peasSeedId);
  test.expect(tasks[1].seedName).toBe(dataBuilderService.taskName);
  test.expect(tasks[1].action).toBe("transplanting");
  test.expect(tasks[1].date).toEqual(new Date(dataBuilderService.taskDate));
});

test('updateTask() with existing tasks', () => {
  MockFactory.initializeMocks();
  const service = MockFactory.taskService;
  MockFactory.storageService.setData({ years: { [2022]: { [service.TASKS_KEY]: dataBuilderService.buildSowingTomatoTask() } }, permanent: {}, selectedYear: 2022 });
  test.expect(service.getScheduledTasks().length).toBe(1);
  service.updateTask({
    id: `${dataBuilderService.tomatoSeedId}-sowing`, seedId: dataBuilderService.tomatoSeedId,
    action: "sowing", seedName: dataBuilderService.taskName,
    date: new Date(dataBuilderService.taskDate), status: dataBuilderService.taskStatus, completed: new Date()
  });
  service.updateTask({
    id: `${dataBuilderService.tomatoSeedId}-transplanting`, seedId: dataBuilderService.tomatoSeedId,
    action: "transplanting", seedName: dataBuilderService.taskName,
    date: new Date(dataBuilderService.taskDate), status: "scheduled", completed: new Date()
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
  MockFactory.initializeMocks();
  const service = MockFactory.taskService;
  MockFactory.storageService.setData({ years: { [2022]: { [service.TASKS_KEY]: dataBuilderService.buildTransplantingTomatoTask() } }, permanent: {}, selectedYear: 2022 });
  test.expect(service.getScheduledTasks().length).toBe(1);
  service.updateTask({
    id: `${dataBuilderService.tomatoSeedId}-sowing`, seedId: dataBuilderService.tomatoSeedId,
    action: "sowing", seedName: dataBuilderService.taskName,
    date: new Date(dataBuilderService.taskDate), status: dataBuilderService.taskStatus, completed: new Date()
  });
  service.updateTask({
    id: `${dataBuilderService.tomatoSeedId}-transplanting`, seedId: dataBuilderService.tomatoSeedId,
    action: "transplanting", seedName: dataBuilderService.taskName,
    date: new Date(dataBuilderService.taskDate), status: "scheduled", completed: new Date()
  });
  const tasks = service.getScheduledTasks();
  test.expect(tasks.length).toBe(2);
  const sowingTask = tasks.find(t => t.action === "sowing");
  test.expect(sowingTask).toBeDefined();
  test.expect(sowingTask?.seedId).toBe(dataBuilderService.tomatoSeedId);
  test.expect(sowingTask?.seedName).toBe(dataBuilderService.taskName);
  test.expect(sowingTask?.action).toBe("sowing");
  test.expect(sowingTask?.date).toEqual(new Date(dataBuilderService.taskDate));
  test.expect(sowingTask?.status).toBe(dataBuilderService.taskStatus);
  const transplantingTask = tasks.find(t => t.action === "transplanting");
  test.expect(transplantingTask).toBeDefined();
  test.expect(transplantingTask?.seedId).toBe(dataBuilderService.tomatoSeedId);
  test.expect(transplantingTask?.seedName).toBe(dataBuilderService.taskName);
  test.expect(transplantingTask?.action).toBe("transplanting");
  test.expect(transplantingTask?.date).toEqual(new Date(dataBuilderService.taskDate));
});

test('updateTask() with existing done tasks and different date', () => {
  MockFactory.initializeMocks();
  const service = MockFactory.taskService;
  const doneTomatoTask = dataBuilderService.buildTransplantingTomatoTask()
  doneTomatoTask[0].status = 'done';
  MockFactory.storageService.setData({ years: { [2022]: { [service.TASKS_KEY]: doneTomatoTask } }, permanent: {}, selectedYear: 2022 });
  test.expect(service.getScheduledTasks().length).toBe(0);
  service.updateTask({
    id: `${dataBuilderService.tomatoSeedId}-sowing`, seedId: dataBuilderService.tomatoSeedId,
    action: "sowing", seedName: dataBuilderService.taskName,
    date: new Date(dataBuilderService.taskDate), status: dataBuilderService.taskStatus, completed: new Date()
  });
  service.updateTask({
    id: `${dataBuilderService.tomatoSeedId}-transplanting`, seedId: dataBuilderService.tomatoSeedId,
    action: "transplanting", seedName: dataBuilderService.taskName,
    date: new Date(dataBuilderService.taskDate), status: "scheduled", completed: new Date()
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
  MockFactory.initializeMocks();
  const service = MockFactory.taskService;
  MockFactory.storageService.setData({ years: { [2022]: { [service.TASKS_KEY]: dataBuilderService.buildUnorderedTasks('scheduled') } }, permanent: {}, selectedYear: 2022 });
  test.expect(service.getScheduledTasks().length).toBe(4);
  const taskToRemoveId = `${dataBuilderService.peasSeedId}-sowing`;
  service.removeTasks(taskToRemoveId);
  test.expect(service.getScheduledTasks().length).toBe(3);
  test.expect(service.getScheduledTasks().some(t => t.id === taskToRemoveId)).toBe(false);
});

test('removeTasksBySeed()', () => {
  MockFactory.initializeMocks();
  const service = MockFactory.taskService;
  MockFactory.storageService.setData({ years: { [2022]: { [service.TASKS_KEY]: dataBuilderService.buildUnorderedTasks('scheduled') } }, permanent: {}, selectedYear: 2022 });
  const tasks = service.getScheduledTasks();
  test.expect(tasks.length).toBe(4);
  service.removeTasksBySeed(dataBuilderService.seedIdWithMultipleTasks);
  const remainingTasks = service.getScheduledTasks();
  test.expect(remainingTasks.length).toBe(2);
  test.expect(remainingTasks.some(t => t.id === dataBuilderService.seedIdWithMultipleTasks)).toBe(false);
});

test('removeTasksBySeed() - do not remove done tasks', () => {
  MockFactory.initializeMocks();
  const service = MockFactory.taskService;
  MockFactory.storageService.setData({ years: { [2022]: { [service.TASKS_KEY]: dataBuilderService.buildScheduledAndDoneTasks() } }, permanent: {}, selectedYear: 2022 });
  test.expect(service.getScheduledTasks().length).toBe(1);
  test.expect(service.getDoneTasks().length).toBe(1);
  service.removeTasksBySeed(dataBuilderService.seedIdWithMultipleTasks);
  test.expect(service.getScheduledTasks().length).toBe(1);
  test.expect(service.getDoneTasks().length).toBe(1);
});

test('computeTasks()', () => {
  MockFactory.initializeMocks();
  const service = MockFactory.taskService;
  const tasks = service.computeTasks(dataBuilderService.buildTomatoSeeds()[0], 2021);
  test.expect(tasks.length).toBe(2);
  test.expect(tasks[0].date.getDate()).toBe(dataBuilderService.tomatoSowingDate.day)
  test.expect(tasks[0].date.getMonth() + 1).toBe(dataBuilderService.tomatoSowingDate.month)
  test.expect(tasks[0].date.getFullYear()).toBe(2021)
  test.expect(tasks[1].date.getDate()).toBe(dataBuilderService.tomatoTransplantingDate.day)
  test.expect(tasks[1].date.getMonth() + 1).toBe(dataBuilderService.tomatoTransplantingDate.month)
  test.expect(tasks[1].date.getFullYear()).toBe(2021)
});

test('computeHarvestTask() without transplanting date', () => {
  MockFactory.initializeMocks();
  const june = 5;
  const june21st = new Date(2021, june, 21);
  const taskAction = 'sowing';
  const tomatoSeed = dataBuilderService.buildTomatoSeeds()[0];
  tomatoSeed.transplanting.enabled = false;
  const service = MockFactory.taskService;
  const harvestTasks = service.computeHarvestTask(taskAction, tomatoSeed, june21st);
  test.expect(harvestTasks.length).toBe(1);
  test.expect(harvestTasks[0].date.getDate()).toBe(21);
  test.expect(harvestTasks[0].date.getMonth()).toBe(june + 1);
});

test('computeHarvestTask() with date at the end of the year', () => {
  MockFactory.initializeMocks();
  const december = 11;
  const january = 0;
  const december21st = new Date(2021, december, 21);
  const taskAction = 'sowing';
  const tomatoSeed = dataBuilderService.buildTomatoSeeds()[0];
  tomatoSeed.transplanting.enabled = false;
  const service = MockFactory.taskService;
  const harvestTasks = service.computeHarvestTask(taskAction, tomatoSeed, december21st);
  test.expect(harvestTasks.length).toBe(1);
  test.expect(harvestTasks[0].date.getDate()).toBe(20);
  test.expect(harvestTasks[0].date.getMonth()).toBe(january);
});

test('computeHarvestTask() with transplanting date and sowing done', () => {
  MockFactory.initializeMocks();
  const june = 5;
  const june21st = new Date(2021, june, 21);
  const taskAction = 'sowing';
  const tomatoSeed = dataBuilderService.buildTomatoSeeds()[0];
  const service = MockFactory.taskService;
  const harvestTasks = service.computeHarvestTask(taskAction, tomatoSeed, june21st);
  test.expect(harvestTasks.length).toBe(0);
});

test('computeHarvestTask() with transplanting date and transplanting done', () => {
  MockFactory.initializeMocks();
  const june = 5;
  const june21st = new Date(2021, june, 21);
  const taskAction = 'transplanting';
  const tomatoSeed = dataBuilderService.buildTomatoSeeds()[0];
  const service = MockFactory.taskService;
  const harvestTasks = service.computeHarvestTask(taskAction, tomatoSeed, june21st);
  test.expect(harvestTasks.length).toBe(1);
  test.expect(harvestTasks[0].date.getDate()).toBe(21);
  test.expect(harvestTasks[0].date.getMonth()).toBe(june + 1);
});
