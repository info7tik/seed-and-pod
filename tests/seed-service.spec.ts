import { SeedService } from '../src/app/seed-service';
import { MockStorageService } from '../src/app/mock/mock-storage-service';
import test from '@playwright/test';
import { InventorySeed } from '../src/app/type/inventory-seed.type';
import { StockSeed } from '../src/app/type/stock-seed.type';

test('getAvailableSeeds()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  test.expect(service.getAvailableSeeds().length).toBe(0);
  mockStorageService.setItem(service.AVAILABLE_SEEDS_KEY, fillWithTomatoSeeds());
  test.expect(service.getAvailableSeeds().length).toBe(1);
});

test('getAvailableSeedById()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  mockStorageService.setItem(service.AVAILABLE_SEEDS_KEY, fillWithTomatoAndPotatoSeeds());
  test.expect(service.getAvailableSeedById('2').name).toBe('Potato');
});

test('addAvailableSeed()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  service.addInventorySeed({ name: 'Tomato', variety: 'Cherry' });
  test.expect(service.getAvailableSeeds().length).toBe(1);
  test.expect(() => service.addInventorySeed({ name: 'Tomato', variety: 'Cherry' })).toThrow();
  test.expect(service.getAvailableSeeds().length).toBe(1);
});

test('getStockSeeds()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  test.expect(service.getStockSeeds().length).toBe(0);
  mockStorageService.setItem(service.AVAILABLE_SEEDS_KEY, fillWithTomatoSeeds());
  mockStorageService.setItem(service.STOCK_SEEDS_KEY, fillStockTomatoSeeds());
  const seeds = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].name).toBe('Tomato');
  test.expect(seeds[0].variety).toBe('Cherry');
  test.expect(seeds[0].exhausted).toBe(true);
});

test('addStockSeed()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  mockStorageService.setItem(service.AVAILABLE_SEEDS_KEY, fillWithTomatoSeeds());
  test.expect(service.getStockSeeds().length).toBe(0);
  service.addStockSeed('1');
  const seeds = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].name).toBe('Tomato');
  test.expect(seeds[0].exhausted).toBe(false);
});

test('addStockSeed() - seed does not exist', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  mockStorageService.setItem(service.AVAILABLE_SEEDS_KEY, fillWithTomatoSeeds());
  test.expect(service.getStockSeeds().length).toBe(0);
  test.expect(() => service.addStockSeed('2')).toThrow();
  test.expect(service.getStockSeeds().length).toBe(0);
});

test('addStockSeed() - seed already exists', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  mockStorageService.setItem(service.AVAILABLE_SEEDS_KEY, fillWithTomatoSeeds());
  mockStorageService.setItem(service.STOCK_SEEDS_KEY, fillStockTomatoSeeds());
  service.addStockSeed('1');
  const seeds = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].exhausted).toBe(true);
});

test('markAsExhausted()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  mockStorageService.setItem(service.AVAILABLE_SEEDS_KEY, fillWithTomatoSeeds());
  mockStorageService.setItem(service.STOCK_SEEDS_KEY, fillStockTomatoSeeds());
  service.markAsExhausted('1');
  const seeds = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].exhausted).toBe(true);
});

test('markAsResupplied()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  mockStorageService.setItem(service.AVAILABLE_SEEDS_KEY, fillWithTomatoSeeds());
  mockStorageService.setItem(service.STOCK_SEEDS_KEY, fillStockTomatoSeeds());
  service.markAsResupplied('1');
  const seeds = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].exhausted).toBe(false);
});

test('markAsResupplied() - seed does not exist', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  mockStorageService.setItem(service.AVAILABLE_SEEDS_KEY, fillWithTomatoSeeds());
  mockStorageService.setItem(service.STOCK_SEEDS_KEY, fillStockTomatoSeeds());
  test.expect(() => service.markAsExhausted('2')).toThrow();
  const seeds = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].exhausted).toBe(true);
});

function fillWithTomatoSeeds(): InventorySeed[] {
  return [{ id: '1', name: 'Tomato', variety: 'Cherry' }];
}
function fillWithTomatoAndPotatoSeeds(): InventorySeed[] {
  return [{ id: '1', name: 'Tomato', variety: 'Cherry' }, { id: '2', name: 'Potato', variety: 'Russet' }];
}

function fillStockTomatoSeeds(): StockSeed[] {
  return [{ id: '1', exhausted: true }];
}
