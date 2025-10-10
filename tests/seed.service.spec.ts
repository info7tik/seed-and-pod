import { SeedService } from '../src/app/service/seed.service';
import { MockStorageService } from '../src/app/mock/mock-storage-service';
import test from '@playwright/test';
import { InventorySeed } from '../src/app/type/inventory-seed.type';
import { StockSeed } from '../src/app/type/stock-seed.type';

const tomatoSowingDate = { enabled: true, day: 3, month: 3 };
const tomatoTransplantingDate = { enabled: true, day: 12, month: 7 };
const tomatoDaysBeforeHarvest = 30;

test('getInventorySeeds()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  test.expect(service.getInventorySeeds().length).toBe(0);
  mockStorageService.setItem(service.AVAILABLE_SEEDS_KEY, fillWithTomatoSeeds());
  test.expect(service.getInventorySeeds().length).toBe(1);
});

test('getInventorySeedById()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  mockStorageService.setItem(service.AVAILABLE_SEEDS_KEY, fillWithTomatoAndPotatoSeeds());
  test.expect(service.getInventorySeedById('2').name).toBe('Potato');
});

test('addInventorySeed()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  const seedDescription = { name: 'Tomato', family: 'Cherry', sowing: tomatoSowingDate, transplanting: tomatoTransplantingDate, daysBeforeHarvest: tomatoDaysBeforeHarvest };
  service.addInventorySeed(seedDescription);
  test.expect(service.getInventorySeeds().length).toBe(1);
  const seed = service.getInventorySeedById('1');
  test.expect(seed.name).toBe('Tomato');
  test.expect(seed.family).toBe('Cherry');
  test.expect(seed.sowing).toEqual(tomatoSowingDate);
  test.expect(seed.transplanting).toEqual(tomatoTransplantingDate);
  test.expect(seed.daysBeforeHarvest).toBe(tomatoDaysBeforeHarvest);
  test.expect(() => service.addInventorySeed(seedDescription)).toThrow();
  test.expect(service.getInventorySeeds().length).toBe(1);
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
  test.expect(seeds[0].family).toBe('Cherry');
  test.expect(seeds[0].sowing).toEqual(tomatoSowingDate);
  test.expect(seeds[0].transplanting).toEqual(tomatoTransplantingDate);
  test.expect(seeds[0].daysBeforeHarvest).toBe(tomatoDaysBeforeHarvest);
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
  return [{ id: '1', name: 'Tomato', family: 'Cherry', sowing: tomatoSowingDate, transplanting: tomatoTransplantingDate, daysBeforeHarvest: tomatoDaysBeforeHarvest }];
}
function fillWithTomatoAndPotatoSeeds(): InventorySeed[] {
  return [
    { id: '1', name: 'Tomato', family: 'Cherry', sowing: tomatoSowingDate, transplanting: tomatoTransplantingDate, daysBeforeHarvest: tomatoDaysBeforeHarvest },
    { id: '2', name: 'Potato', family: 'Russet', sowing: tomatoSowingDate, transplanting: tomatoTransplantingDate, daysBeforeHarvest: tomatoDaysBeforeHarvest }
  ];
}

function fillStockTomatoSeeds(): StockSeed[] {
  return [{ id: '1', exhausted: true }];
}
