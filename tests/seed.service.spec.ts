import { SeedService } from '../src/app/service/seed.service';
import { MockStorageService } from '../src/app/mock/mock-storage.service';
import test from '@playwright/test';
import { DataBuilderService } from '../src/app/mock/data-builder.service';

const dataBuilderService = new DataBuilderService();

test('getInventorySeeds()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  test.expect(service.getInventorySeeds().length).toBe(0);
  mockStorageService.setItem(service.AVAILABLE_SEEDS_KEY, dataBuilderService.buildTomatoSeeds());
  test.expect(service.getInventorySeeds().length).toBe(1);
});

test('getInventorySeedById()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  mockStorageService.setItem(service.AVAILABLE_SEEDS_KEY, dataBuilderService.buildTomatoAndPotatoSeeds());
  test.expect(service.getInventorySeedById('2').name).toBe('Potato');
});

test('addInventorySeed()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  const seedDescription = { name: 'Tomato', family: { id: 1, key: 'Cherry' }, sowing: dataBuilderService.tomatoSowingDate, transplanting: dataBuilderService.tomatoTransplantingDate, daysBeforeHarvest: dataBuilderService.tomatoDaysBeforeHarvest };
  service.addInventorySeed(seedDescription);
  test.expect(service.getInventorySeeds().length).toBe(1);
  const seed = service.getInventorySeedById('1');
  test.expect(seed.name).toBe('Tomato');
  test.expect(seed.family.key).toBe('Cherry');
  test.expect(seed.sowing).toEqual(dataBuilderService.tomatoSowingDate);
  test.expect(seed.transplanting).toEqual(dataBuilderService.tomatoTransplantingDate);
  test.expect(seed.daysBeforeHarvest).toBe(dataBuilderService.tomatoDaysBeforeHarvest);
  test.expect(() => service.addInventorySeed(seedDescription)).toThrow();
  test.expect(service.getInventorySeeds().length).toBe(1);
});

test('getStockSeeds()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  test.expect(service.getStockSeeds().length).toBe(0);
  mockStorageService.setItem(service.AVAILABLE_SEEDS_KEY, dataBuilderService.buildTomatoSeeds());
  mockStorageService.setItem(service.STOCK_SEEDS_KEY, dataBuilderService.buildStockTomatoSeeds());
  const seeds = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].name).toBe('Tomato');
  test.expect(seeds[0].family.key).toBe('Cherry');
  test.expect(seeds[0].sowing).toEqual(dataBuilderService.tomatoSowingDate);
  test.expect(seeds[0].transplanting).toEqual(dataBuilderService.tomatoTransplantingDate);
  test.expect(seeds[0].daysBeforeHarvest).toBe(dataBuilderService.tomatoDaysBeforeHarvest);
  test.expect(seeds[0].exhausted).toBe(true);
});

test('addStockSeed()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  mockStorageService.setItem(service.AVAILABLE_SEEDS_KEY, dataBuilderService.buildTomatoSeeds());
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
  mockStorageService.setItem(service.AVAILABLE_SEEDS_KEY, dataBuilderService.buildTomatoSeeds());
  test.expect(service.getStockSeeds().length).toBe(0);
  test.expect(() => service.addStockSeed('2')).toThrow();
  test.expect(service.getStockSeeds().length).toBe(0);
});

test('addStockSeed() - seed already exists', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  mockStorageService.setItem(service.AVAILABLE_SEEDS_KEY, dataBuilderService.buildTomatoSeeds());
  mockStorageService.setItem(service.STOCK_SEEDS_KEY, dataBuilderService.buildStockTomatoSeeds());
  service.addStockSeed('1');
  const seeds = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].exhausted).toBe(true);
});

test('markAsExhausted()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  mockStorageService.setItem(service.AVAILABLE_SEEDS_KEY, dataBuilderService.buildTomatoSeeds());
  mockStorageService.setItem(service.STOCK_SEEDS_KEY, dataBuilderService.buildStockTomatoSeeds());
  service.markAsExhausted('1');
  const seeds = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].exhausted).toBe(true);
});

test('markAsResupplied()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  mockStorageService.setItem(service.AVAILABLE_SEEDS_KEY, dataBuilderService.buildTomatoSeeds());
  mockStorageService.setItem(service.STOCK_SEEDS_KEY, dataBuilderService.buildStockTomatoSeeds());
  service.markAsResupplied('1');
  const seeds = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].exhausted).toBe(false);
});

test('markAsResupplied() - seed does not exist', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  mockStorageService.setItem(service.AVAILABLE_SEEDS_KEY, dataBuilderService.buildTomatoSeeds());
  mockStorageService.setItem(service.STOCK_SEEDS_KEY, dataBuilderService.buildStockTomatoSeeds());
  test.expect(() => service.markAsExhausted('2')).toThrow();
  const seeds = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].exhausted).toBe(true);
});
