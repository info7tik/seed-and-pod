import test from '@playwright/test';
import { MockStorageService } from '../src/app/mock/mock-storage.service';
import { YearService } from '../src/app/service/year.service';
import { MockClockService } from '../src/app/mock/mock-clock.service';
import { DataBuilderService } from '../src/app/mock/data-builder.service';

const dataBuilderService = new DataBuilderService();

test('getSelectedYear() without data', () => {
  const mockClockService: MockClockService = new MockClockService(new Date(2022, 6, 21));
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new YearService(mockClockService, mockStorageService);
  test.expect(service.getSelectedYear()).toBe(2022);
  mockStorageService.setItem(service.YEAR_KEY, 2025);
  test.expect(service.getSelectedYear()).toBe(2025);
});

test('saveSelectedYear()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new YearService(new MockClockService(new Date(2022, 6, 21)), mockStorageService);
  service.saveSelectedYear(2025);
  test.expect(service.getSelectedYear()).toBe(2025);
});

test('getFutureTasks()', () => {
  const mockClockService: MockClockService = new MockClockService(new Date(2025, 1, 22));//2025-02-22
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new YearService(mockClockService, mockStorageService);
  const tasks = dataBuilderService.buildTasks(dataBuilderService.buildUnorderedTasks('scheduled'));
  const futureTasks = service.keepFutureTasks(tasks);
  test.expect(futureTasks.length).toBe(2);
  test.expect(futureTasks[0]).toEqual(tasks[0]);
  test.expect(futureTasks[1]).toEqual(tasks[3]);
});