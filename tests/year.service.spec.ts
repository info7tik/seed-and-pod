import test from '@playwright/test';
import { MockStorageService } from '../src/app/mock/mock-storage.service';
import { YearService } from '../src/app/service/year.service';
import { DataBuilderService } from '../src/app/mock/data-builder.service';

const dataBuilderService = new DataBuilderService();

test('getScheduledTasks()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new YearService(mockStorageService);
});
