import { MockStorageService } from '../src/app/mock/mock-storage.service';
import test from '@playwright/test';
import { DataBuilderService } from '../src/app/mock/data-builder.service';
import { InventoryService } from '../src/app/service/inventory.service';

const dataBuilderService = new DataBuilderService();

test('getInventorySeeds()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new InventoryService(mockStorageService);
  test.expect(service.getInventorySeeds().length).toBe(0);
  mockStorageService.setItem(service.INVENTORY_SEEDS_KEY, dataBuilderService.buildTomatoSeeds());
  test.expect(service.getInventorySeeds().length).toBe(1);
});

test('getInventorySeedById()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new InventoryService(mockStorageService);
  mockStorageService.setItem(service.INVENTORY_SEEDS_KEY, dataBuilderService.buildTomatoAndPotatoSeeds());
  test.expect(service.getInventorySeedById('2').name).toBe('Potato');
});

test('addInventorySeed()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new InventoryService(mockStorageService);
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
