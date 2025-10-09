import { Seed, SeedService } from '../src/app/seed-service';
import { MockStorageService } from '../src/app/mock/mock-storage-service';
import test from '@playwright/test';
import { availableSeeds } from '../src/app/type/available-seeds.type';

test('getAvailableSeeds()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  const mockAvailableSeeds: availableSeeds = { 1: { name: 'Tomato', variety: 'Cherry', exhausted: false, selected: false } }
  const emptySeeds: Seed[] = service.getAvailableSeeds();
  test.expect(emptySeeds.length).toBe(0);
  mockStorageService.setItem(service.AVAILABLE_SEEDS_KEY, mockAvailableSeeds);
  const seeds: Seed[] = service.getAvailableSeeds();
  test.expect(seeds.length).toBe(1);
});

test('addAvailableSeed()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  service.addAvailableSeed({ name: 'Tomato', variety: 'Cherry', exhausted: false, selected: false });
  const seeds: Seed[] = service.getAvailableSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(() => service.addAvailableSeed({ name: 'Tomato', variety: 'Cherry', exhausted: false, selected: false })).toThrow();
  test.expect(seeds.length).toBe(1);
});

test('getStockSeeds()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  const mockStockSeeds: availableSeeds = { 1: { name: 'Tomato', variety: 'Cherry', exhausted: false, selected: false } }
  const emptySeeds: Seed[] = service.getStockSeeds();
  test.expect(emptySeeds.length).toBe(0);
  mockStorageService.setItem(service.STOCK_SEEDS_KEY, mockStockSeeds);
  const seeds: Seed[] = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
});
