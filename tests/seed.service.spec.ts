import test from '@playwright/test';
import { DataBuilderService } from '../src/app/mock/data-builder.service';
import { MockFactory } from '../src/app/mock/mock-factory';

const dataBuilderService = new DataBuilderService();

test('getStockSeeds()', () => {
  MockFactory.initializeMocks();
  const service = MockFactory.seedService;
  test.expect(service.getStockSeeds().length).toBe(0);
  MockFactory.storageService.setData({
    years: { [MockFactory.selectedYear]: { [service.STOCK_SEEDS_KEY]: dataBuilderService.buildStockTomatoSeeds() } },
    permanent: { [MockFactory.inventoryService.INVENTORY_SEEDS_KEY]: dataBuilderService.buildTomatoSeeds() },
    selectedYear: MockFactory.selectedYear
  });
  const seeds = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].name).toBe('Tomato');
  test.expect(seeds[0].family.name).toBe('A');
  test.expect(seeds[0].sowing).toEqual(dataBuilderService.tomatoSowingDate);
  test.expect(seeds[0].transplanting).toEqual(dataBuilderService.tomatoTransplantingDate);
  test.expect(seeds[0].daysBeforeHarvest).toBe(dataBuilderService.tomatoDaysBeforeHarvest);
  test.expect(seeds[0].exhausted).toBe(true);
});

test('addStockSeed()', () => {
  MockFactory.initializeMocks();
  const service = MockFactory.seedService;
  MockFactory.storageService.setData({
    years: { [MockFactory.selectedYear]: {} },
    permanent: { [MockFactory.inventoryService.INVENTORY_SEEDS_KEY]: dataBuilderService.buildTomatoSeeds() },
    selectedYear: MockFactory.selectedYear
  });
  test.expect(service.getStockSeeds().length).toBe(0);
  service.addStockSeed('1');
  const seeds = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].name).toBe('Tomato');
  test.expect(seeds[0].exhausted).toBe(false);
});

test('addStockSeed() - seed does not exist', () => {
  MockFactory.initializeMocks();
  const service = MockFactory.seedService;
  MockFactory.storageService.setData({
    years: { [MockFactory.selectedYear]: {} },
    permanent: { [MockFactory.inventoryService.INVENTORY_SEEDS_KEY]: dataBuilderService.buildTomatoSeeds() },
    selectedYear: MockFactory.selectedYear
  });
  test.expect(service.getStockSeeds().length).toBe(0);
  test.expect(() => service.addStockSeed('2')).toThrow();
  test.expect(service.getStockSeeds().length).toBe(0);
});

test('addStockSeed() - seed already exists', () => {
  MockFactory.initializeMocks();
  const service = MockFactory.seedService;
  MockFactory.storageService.setData({
    years: { [MockFactory.selectedYear]: { [service.STOCK_SEEDS_KEY]: dataBuilderService.buildStockTomatoSeeds() } },
    permanent: { [MockFactory.inventoryService.INVENTORY_SEEDS_KEY]: dataBuilderService.buildTomatoSeeds() },
    selectedYear: MockFactory.selectedYear
  });
  service.addStockSeed('1');
  const seeds = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].exhausted).toBe(true);
});

test('markAsExhausted()', () => {
  MockFactory.initializeMocks();
  const service = MockFactory.seedService;
  MockFactory.storageService.setData({
    years: {
      [MockFactory.selectedYear]: { [service.STOCK_SEEDS_KEY]: dataBuilderService.buildStockTomatoSeeds() }
    },
    permanent: { [MockFactory.inventoryService.INVENTORY_SEEDS_KEY]: dataBuilderService.buildTomatoSeeds() },
    selectedYear: MockFactory.selectedYear
  });
  service.markAsExhausted('1');
  const seeds = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].exhausted).toBe(true);
});

test('markAsResupplied()', () => {
  MockFactory.initializeMocks();
  const service = MockFactory.seedService;
  MockFactory.storageService.setData({
    years: {
      [MockFactory.selectedYear]: { [service.STOCK_SEEDS_KEY]: dataBuilderService.buildStockTomatoSeeds() }
    },
    permanent: { [MockFactory.inventoryService.INVENTORY_SEEDS_KEY]: dataBuilderService.buildTomatoSeeds() },
    selectedYear: MockFactory.selectedYear
  });
  service.markAsResupplied('1');
  const seeds = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].exhausted).toBe(false);
});

test('markAsResupplied() - seed does not exist', () => {
  MockFactory.initializeMocks();
  const service = MockFactory.seedService;
  MockFactory.storageService.setData({
    years: {
      [MockFactory.selectedYear]: { [service.STOCK_SEEDS_KEY]: dataBuilderService.buildStockTomatoSeeds() }
    },
    permanent: { [MockFactory.inventoryService.INVENTORY_SEEDS_KEY]: dataBuilderService.buildTomatoSeeds() },
    selectedYear: MockFactory.selectedYear
  });
  test.expect(() => service.markAsExhausted('2')).toThrow();
  const seeds = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].exhausted).toBe(true);
});
