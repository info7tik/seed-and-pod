import { SeedService } from '../src/app/service/seed.service';
import { MockStorageService } from '../src/app/mock/mock-storage.service';
import test from '@playwright/test';
import { DataBuilderService } from '../src/app/mock/data-builder.service';
import { InventoryService } from '../src/app/service/inventory.service';
import { MockFactory } from '../src/app/mock/mock-factory';
import { YearService } from '../src/app/service/year.service';

const dataBuilderService = new DataBuilderService();

test('getStockSeeds()', () => {
  MockFactory.initializeMocks();
  const inventoryService = new InventoryService(new YearService(MockFactory.clockService, MockFactory.storageService));
  const service = new SeedService(new YearService(MockFactory.clockService, MockFactory.storageService), inventoryService);
  test.expect(service.getStockSeeds().length).toBe(0);
  MockFactory.storageService.setData({
    years: {
      2022: {
        [inventoryService.INVENTORY_SEEDS_KEY]: dataBuilderService.buildTomatoSeeds(),
        [service.STOCK_SEEDS_KEY]: dataBuilderService.buildStockTomatoSeeds()
      }
    }, selectedYear: 2022
  });
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
  MockFactory.initializeMocks();
  const inventoryService = new InventoryService(new YearService(MockFactory.clockService, MockFactory.storageService));
  const service = new SeedService(new YearService(MockFactory.clockService, MockFactory.storageService), inventoryService);
  MockFactory.storageService.setData({ years: { [2022]: { [inventoryService.INVENTORY_SEEDS_KEY]: dataBuilderService.buildTomatoSeeds() } }, selectedYear: 2022 });
  test.expect(service.getStockSeeds().length).toBe(0);
  service.addStockSeed('1');
  const seeds = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].name).toBe('Tomato');
  test.expect(seeds[0].exhausted).toBe(false);
});

test('addStockSeed() - seed does not exist', () => {
  MockFactory.initializeMocks();
  const inventoryService = new InventoryService(new YearService(MockFactory.clockService, MockFactory.storageService));
  const service = new SeedService(new YearService(MockFactory.clockService, MockFactory.storageService), inventoryService);
  MockFactory.storageService.setData({ years: { [2022]: { [inventoryService.INVENTORY_SEEDS_KEY]: dataBuilderService.buildTomatoSeeds() } }, selectedYear: 2022 });
  test.expect(service.getStockSeeds().length).toBe(0);
  test.expect(() => service.addStockSeed('2')).toThrow();
  test.expect(service.getStockSeeds().length).toBe(0);
});

test('addStockSeed() - seed already exists', () => {
  MockFactory.initializeMocks();
  const inventoryService = new InventoryService(new YearService(MockFactory.clockService, MockFactory.storageService));
  const service = new SeedService(new YearService(MockFactory.clockService, MockFactory.storageService), inventoryService);
  MockFactory.storageService.setData({
    years: {
      [2022]: {
        [inventoryService.INVENTORY_SEEDS_KEY]: dataBuilderService.buildTomatoSeeds(),
        [service.STOCK_SEEDS_KEY]: dataBuilderService.buildStockTomatoSeeds()
      }
    }, selectedYear: 2022
  });
  service.addStockSeed('1');
  const seeds = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].exhausted).toBe(true);
});

test('markAsExhausted()', () => {
  MockFactory.initializeMocks();
  const inventoryService = new InventoryService(new YearService(MockFactory.clockService, MockFactory.storageService));
  const service = new SeedService(new YearService(MockFactory.clockService, MockFactory.storageService), inventoryService);
  MockFactory.storageService.setData({
    years: {
      [2022]: {
        [inventoryService.INVENTORY_SEEDS_KEY]: dataBuilderService.buildTomatoSeeds(),
        [service.STOCK_SEEDS_KEY]: dataBuilderService.buildStockTomatoSeeds()
      }
    }, selectedYear: 2022
  });
  service.markAsExhausted('1');
  const seeds = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].exhausted).toBe(true);
});

test('markAsResupplied()', () => {
  MockFactory.initializeMocks();
  const inventoryService = new InventoryService(new YearService(MockFactory.clockService, MockFactory.storageService));
  const service = new SeedService(new YearService(MockFactory.clockService, MockFactory.storageService), inventoryService);
  MockFactory.storageService.setData({
    years: {
      [2022]: {
        [inventoryService.INVENTORY_SEEDS_KEY]: dataBuilderService.buildTomatoSeeds(),
        [service.STOCK_SEEDS_KEY]: dataBuilderService.buildStockTomatoSeeds()
      }
    }, selectedYear: 2022
  });
  service.markAsResupplied('1');
  const seeds = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].exhausted).toBe(false);
});

test('markAsResupplied() - seed does not exist', () => {
  MockFactory.initializeMocks();
  const inventoryService = new InventoryService(new YearService(MockFactory.clockService, MockFactory.storageService));
  const service = new SeedService(new YearService(MockFactory.clockService, MockFactory.storageService), inventoryService);
  MockFactory.storageService.setData({
    years: {
      [2022]: {
        [inventoryService.INVENTORY_SEEDS_KEY]: dataBuilderService.buildTomatoSeeds(),
        [service.STOCK_SEEDS_KEY]: dataBuilderService.buildStockTomatoSeeds()
      }
    }, selectedYear: 2022
  });
  test.expect(() => service.markAsExhausted('2')).toThrow();
  const seeds = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].exhausted).toBe(true);
});
