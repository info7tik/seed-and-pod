import test from '@playwright/test';
import { BasketService } from '../src/app/service/basket.service';
import { MockStorageService } from '../src/app/mock/mock-storage.service';
import { DataBuilderService } from '../src/app/mock/data-builder.service';

const dataBuilderService = new DataBuilderService();

test('getHarvests()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new BasketService(mockStorageService);
  test.expect(service.getHarvests().length).toBe(0);
  mockStorageService.setItem(service.HARVESTS_KEY, dataBuilderService.buildTomatoAndPeasHarvests());
  const harvests = service.getHarvests();
  test.expect(harvests.length).toBe(2);
  test.expect(harvests[0].seedId).toBe(dataBuilderService.peasSeedId);
  test.expect(harvests[0].seedName).toBe('Peas');
  test.expect(harvests[0].weightGrams).toBe(dataBuilderService.harvestPeasWeightGrams);
  test.expect(harvests[0].date).toEqual(dataBuilderService.harvestPeasDate);
  test.expect(harvests[1].seedId).toBe(dataBuilderService.tomatoSeedId);
  test.expect(harvests[1].seedName).toBe('Tomato');
  test.expect(harvests[1].weightGrams).toBe(dataBuilderService.harvestTomatoWeightGrams);
  test.expect(harvests[1].date).toEqual(dataBuilderService.harvestTomatoDate);
});

test('addHarvest()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new BasketService(mockStorageService);
  test.expect(service.getHarvests().length).toBe(0);
  const tomatoHarvest = dataBuilderService.buildHarvests(dataBuilderService.buildTomatoAndPeasHarvests());
  service.addHarvest(tomatoHarvest[0]);
  const harvests = service.getHarvests();
  test.expect(harvests.length).toBe(1);
  test.expect(harvests[0].seedId).toBe(tomatoHarvest[0].seedId);
  test.expect(harvests[0].seedName).toBe(tomatoHarvest[0].seedName);
  test.expect(harvests[0].weightGrams).toBe(tomatoHarvest[0].weightGrams);
  test.expect(harvests[0].date).toEqual(tomatoHarvest[0].date);
});

test('addHarvest() - can not add harvest for same seed with same date', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new BasketService(mockStorageService);
  test.expect(service.getHarvests().length).toBe(0);
  const existingHarvests = dataBuilderService.buildTomatoAndPeasHarvests();
  mockStorageService.setItem(service.HARVESTS_KEY, existingHarvests);
  const tomatoHarvest = dataBuilderService.buildHarvests(existingHarvests)[0];
  tomatoHarvest.weightGrams = 1000;
  test.expect(service.getHarvests().length).toBe(2);
  test.expect(() => service.addHarvest(tomatoHarvest)).toThrow(), "only one harvest per seed per day is allowed";
  test.expect(service.getHarvests().length).toBe(2);
});

test('addHarvest() - can not add harvest for same seed in the same day', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new BasketService(mockStorageService);
  test.expect(service.getHarvests().length).toBe(0);
  const existingHarvests = dataBuilderService.buildTomatoAndPeasHarvests();
  mockStorageService.setItem(service.HARVESTS_KEY, existingHarvests);
  const tomatoHarvest = dataBuilderService.buildHarvests(existingHarvests)[0];
  tomatoHarvest.date = new Date(tomatoHarvest.date.getTime() + 1000);
  test.expect(service.getHarvests().length).toBe(2);
  test.expect(() => service.addHarvest(tomatoHarvest)).toThrow(), "only one harvest per seed per day is allowed";
  test.expect(service.getHarvests().length).toBe(2);
});

test('removeHarvest()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new BasketService(mockStorageService);
  test.expect(service.getHarvests().length).toBe(0);
  const existingHarvests = dataBuilderService.buildTomatoAndPeasHarvests();
  mockStorageService.setItem(service.HARVESTS_KEY, existingHarvests);
  const tomatoHarvest = dataBuilderService.buildHarvests(existingHarvests)[0];
  test.expect(service.getHarvests().length).toBe(2);
  service.removeHarvest(tomatoHarvest);
  const harvests = service.getHarvests();
  test.expect(harvests.length).toBe(1);
  test.expect(harvests[0].seedId).toBe(dataBuilderService.peasSeedId);
});

test('removeHarvest() - multiple harvests of same seed', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new BasketService(mockStorageService);
  test.expect(service.getHarvests().length).toBe(0);
  const existingHarvests = dataBuilderService.buildTomatoMultipleHarvests();
  mockStorageService.setItem(service.HARVESTS_KEY, existingHarvests);
  test.expect(service.getHarvests().length).toBe(3);
  const harvestToRemove = dataBuilderService.buildHarvests(existingHarvests)[0];
  service.removeHarvest(harvestToRemove);
  const harvests = service.getHarvests();
  test.expect(harvests.length).toBe(2);
  test.expect(harvests.some(h => h.date.getTime() === harvestToRemove.date.getTime())).toBe(false);
});

test('aggregateHarvests()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new BasketService(mockStorageService);
  test.expect(service.getHarvests().length).toBe(0);
  const existingHarvests = dataBuilderService.buildTomatoMultipleHarvests();
  const firstWeightGrams = 1234;
  const secondWeightGrams = 456;
  const earlyDate = new Date(existingHarvests[1].date);
  const threeHoursLater = new Date(earlyDate.getTime() + 3 * 3600 * 1000);
  existingHarvests[1].date = earlyDate.toISOString();
  existingHarvests[1].weightGrams = firstWeightGrams;
  existingHarvests[0].date = threeHoursLater.toISOString();
  existingHarvests[0].weightGrams = secondWeightGrams;
  const notAggregatedHarvest = existingHarvests[2];
  notAggregatedHarvest.seedId = 'not-aggregated-seed-id';
  mockStorageService.setItem(service.HARVESTS_KEY, existingHarvests);
  const aggregatedHarvests = service.aggregateHarvests(service.getHarvests());
  test.expect(aggregatedHarvests.length).toBe(2);
  test.expect(aggregatedHarvests[0].weightGrams).toBe(firstWeightGrams + secondWeightGrams);
  test.expect(aggregatedHarvests[0].date).toEqual(earlyDate);
  test.expect(aggregatedHarvests[1].weightGrams).toBe(notAggregatedHarvest.weightGrams);
});