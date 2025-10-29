import test from '@playwright/test';
import { DataBuilderService } from '../src/app/mock/data-builder.service';
import { InventoryService } from '../src/app/service/inventory.service';
import { MockFactory } from '../src/app/mock/mock-factory';
import { PermanentStorageService } from '../src/app/service/permanent-storage.service';

const dataBuilderService = new DataBuilderService();

test('getInventorySeeds()', () => {
  MockFactory.initializeMocks(new Date(2022, 6, 21));
  const service = new InventoryService(new PermanentStorageService(MockFactory.storageService));
  test.expect(service.getInventorySeeds().length).toBe(0);
  MockFactory.storageService.setData({ years: {}, selectedYear: 0, permanent: { [service.INVENTORY_SEEDS_KEY]: dataBuilderService.buildTomatoSeeds() } });
  test.expect(service.getInventorySeeds().length).toBe(1);
});

test('getInventorySeedById()', () => {
  MockFactory.initializeMocks();
  const service = new InventoryService(new PermanentStorageService(MockFactory.storageService));
  MockFactory.storageService.setData({ years: {}, selectedYear: 0, permanent: { [service.INVENTORY_SEEDS_KEY]: dataBuilderService.buildTomatoAndPotatoSeeds() } });
  test.expect(service.getInventorySeedById('2').name).toBe('Potato');
});

test('addInventorySeed()', () => {
  MockFactory.initializeMocks();
  const service = new InventoryService(new PermanentStorageService(MockFactory.storageService));
  const seedDescription = { name: 'Tomato', group: { name: 'A', color: '#ffd700' }, sowing: dataBuilderService.tomatoSowingDate, transplanting: dataBuilderService.tomatoTransplantingDate, daysBeforeHarvest: dataBuilderService.tomatoDaysBeforeHarvest };
  service.addInventorySeed(seedDescription);
  test.expect(service.getInventorySeeds().length).toBe(1);
  const seed = service.getInventorySeedById('1');
  test.expect(seed.name).toBe('Tomato');
  test.expect(seed.group.name).toBe('A');
  test.expect(seed.sowing).toEqual(dataBuilderService.tomatoSowingDate);
  test.expect(seed.transplanting).toEqual(dataBuilderService.tomatoTransplantingDate);
  test.expect(seed.daysBeforeHarvest).toBe(dataBuilderService.tomatoDaysBeforeHarvest);
  test.expect(() => service.addInventorySeed(seedDescription)).toThrow();
  test.expect(service.getInventorySeeds().length).toBe(1);
});
