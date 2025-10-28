import { SeedService } from '../src/app/service/seed.service';
import { MockStorageService } from '../src/app/mock/mock-storage.service';
import test from '@playwright/test';
import { DataBuilderService } from '../src/app/mock/data-builder.service';
import { InventoryService } from '../src/app/service/inventory.service';

const dataBuilderService = new DataBuilderService();

test('getStockSeeds()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const inventoryService = new InventoryService(mockStorageService);
  const service = new SeedService(mockStorageService, inventoryService);
  test.expect(service.getStockSeeds().length).toBe(0);
  mockStorageService.setItem(inventoryService.INVENTORY_SEEDS_KEY, dataBuilderService.buildTomatoSeeds());
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
  const inventoryService = new InventoryService(mockStorageService);
  const service = new SeedService(mockStorageService, inventoryService);
  mockStorageService.setItem(inventoryService.INVENTORY_SEEDS_KEY, dataBuilderService.buildTomatoSeeds());
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
  const inventoryService = new InventoryService(mockStorageService);
  const service = new SeedService(mockStorageService, inventoryService);
  mockStorageService.setItem(inventoryService.INVENTORY_SEEDS_KEY, dataBuilderService.buildTomatoSeeds());
  test.expect(service.getStockSeeds().length).toBe(0);
  test.expect(() => service.addStockSeed('2')).toThrow();
  test.expect(service.getStockSeeds().length).toBe(0);
});

test('addStockSeed() - seed already exists', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const inventoryService = new InventoryService(mockStorageService);
  const service = new SeedService(mockStorageService, inventoryService);
  mockStorageService.setItem(inventoryService.INVENTORY_SEEDS_KEY, dataBuilderService.buildTomatoSeeds());
  mockStorageService.setItem(service.STOCK_SEEDS_KEY, dataBuilderService.buildStockTomatoSeeds());
  service.addStockSeed('1');
  const seeds = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].exhausted).toBe(true);
});

test('markAsExhausted()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const inventoryService = new InventoryService(mockStorageService);
  const service = new SeedService(mockStorageService, inventoryService);
  mockStorageService.setItem(inventoryService.INVENTORY_SEEDS_KEY, dataBuilderService.buildTomatoSeeds());
  mockStorageService.setItem(service.STOCK_SEEDS_KEY, dataBuilderService.buildStockTomatoSeeds());
  service.markAsExhausted('1');
  const seeds = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].exhausted).toBe(true);
});

test('markAsResupplied()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const inventoryService = new InventoryService(mockStorageService);
  const service = new SeedService(mockStorageService, inventoryService);
  mockStorageService.setItem(inventoryService.INVENTORY_SEEDS_KEY, dataBuilderService.buildTomatoSeeds());
  mockStorageService.setItem(service.STOCK_SEEDS_KEY, dataBuilderService.buildStockTomatoSeeds());
  service.markAsResupplied('1');
  const seeds = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].exhausted).toBe(false);
});

test('markAsResupplied() - seed does not exist', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const inventoryService = new InventoryService(mockStorageService);
  const service = new SeedService(mockStorageService, inventoryService);
  mockStorageService.setItem(inventoryService.INVENTORY_SEEDS_KEY, dataBuilderService.buildTomatoSeeds());
  mockStorageService.setItem(service.STOCK_SEEDS_KEY, dataBuilderService.buildStockTomatoSeeds());
  test.expect(() => service.markAsExhausted('2')).toThrow();
  const seeds = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].exhausted).toBe(true);
});
