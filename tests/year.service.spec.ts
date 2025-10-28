import test from '@playwright/test';
import { MockStorageService } from '../src/app/mock/mock-storage.service';
import { YearService } from '../src/app/service/year.service';
import { MockClockService } from '../src/app/mock/mock-clock.service';
import { DataBuilderService } from '../src/app/mock/data-builder.service';
import { MockFactory } from '../src/app/mock/mock-factory';

const dataBuilderService = new DataBuilderService();

test('getItem()', () => {
  MockFactory.initializeMocks(new Date(2022, 6, 21));
  const defaultValue = 'defaultValue';
  const testKey = 'testKey';
  const testValue = 'testValue';
  const service = new YearService(MockFactory.clockService, MockFactory.storageService);
  test.expect(service.getItem(testKey, defaultValue)).toBe(defaultValue);
  MockFactory.storageService.setData({ years: { [2022]: { testKey: testValue } }, selectedYear: 0 });
  test.expect(service.getItem(testKey, defaultValue)).toBe(testValue);
});

test('setItem()', () => {
  MockFactory.initializeMocks(new Date(2022, 6, 21));
  const testKey = 'testKey';
  const testValue = 'testValue';
  const selectedYear = 2022;
  const service = new YearService(MockFactory.clockService, MockFactory.storageService);
  service.setItem(testKey, testValue);
  test.expect(MockFactory.storageService.getData().years[selectedYear][testKey]).toBe(testValue);
  const updatedValue = 'updatedValue';
  service.setItem(testKey, updatedValue);
  test.expect(MockFactory.storageService.getData().years[selectedYear][testKey]).toBe(updatedValue);
});

test('getSelectedYear() without data', () => {
  MockFactory.initializeMocks(new Date(2022, 6, 21));
  const service = new YearService(MockFactory.clockService, MockFactory.storageService);
  test.expect(service.getSelectedYear()).toBe(2022);
  MockFactory.storageService.setData({ years: {}, selectedYear: 2025 });
  test.expect(service.getSelectedYear()).toBe(2025);
});

test('saveSelectedYear()', () => {
  MockFactory.initializeMocks(new Date(2022, 6, 21));
  const service = new YearService(MockFactory.clockService, MockFactory.storageService);
  service.saveSelectedYear(2025);
  test.expect(service.getSelectedYear()).toBe(2025);
});

test('getFutureTasks()', () => {
  MockFactory.initializeMocks(new Date(2025, 1, 22));//2025-02-22
  const service = new YearService(MockFactory.clockService, MockFactory.storageService);
  const tasks = dataBuilderService.buildTasks(dataBuilderService.buildUnorderedTasks('scheduled'));
  const futureTasks = service.keepFutureTasks(tasks);
  test.expect(futureTasks.length).toBe(2);
  test.expect(futureTasks[0]).toEqual(tasks[0]);
  test.expect(futureTasks[1]).toEqual(tasks[3]);
});