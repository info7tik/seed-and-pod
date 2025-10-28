import { MockStorageService } from '../src/app/mock/mock-storage.service';
import test from '@playwright/test';
import { DataBuilderService } from '../src/app/mock/data-builder.service';
import { InventoryService } from '../src/app/service/inventory.service';
import { MockClockService } from '../src/app/mock/mock-clock.service';
import { YearService } from '../src/app/service/year.service';
import { MockFactory } from '../src/app/mock/mock-factory';

const dataBuilderService = new DataBuilderService();

test('getInventorySeeds()', () => {
  MockFactory.initializeMocks(new Date(2022, 6, 21));
  const service = new InventoryService(new YearService(MockFactory.clockService, MockFactory.storageService));
  test.expect(service.getInventorySeeds().length).toBe(0);
  MockFactory.storageService.setData({ years: { [2022]: { [service.INVENTORY_SEEDS_KEY]: dataBuilderService.buildTomatoSeeds() } }, selectedYear: 2022 });
  test.expect(service.getInventorySeeds().length).toBe(1);
});

test('getInventorySeedById()', () => {
  MockFactory.initializeMocks();
  const service = new InventoryService(new YearService(MockFactory.clockService, MockFactory.storageService));
  MockFactory.storageService.setData({ years: { [2022]: { [service.INVENTORY_SEEDS_KEY]: dataBuilderService.buildTomatoAndPotatoSeeds() } }, selectedYear: 2022 });
  test.expect(service.getInventorySeedById('2').name).toBe('Potato');
});

test('addInventorySeed()', () => {
  MockFactory.initializeMocks();
  const service = new InventoryService(new YearService(MockFactory.clockService, MockFactory.storageService));
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
