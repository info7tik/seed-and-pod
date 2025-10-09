import { SeedService } from '../src/app/seed-service';
import { MockStorageService } from '../src/app/mock/mock-storage-service';
import test from '@playwright/test';
import { AvailableSeedStruct } from '../src/app/type/available-seed.type';
import { StockSeed, StockSeedStruct } from '../src/app/type/stock-seed.type';

test('getAvailableSeeds()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  const mockAvailableSeeds: AvailableSeedStruct = { 1: { name: 'Tomato', variety: 'Cherry' } }
  test.expect(service.getAvailableSeeds().length).toBe(0);
  mockStorageService.setItem(service.AVAILABLE_SEEDS_KEY, mockAvailableSeeds);
  test.expect(service.getAvailableSeeds().length).toBe(1);
});

test('addAvailableSeed()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  service.addAvailableSeed({ name: 'Tomato', variety: 'Cherry' });
  test.expect(service.getAvailableSeeds().length).toBe(1);
  test.expect(() => service.addAvailableSeed({ name: 'Tomato', variety: 'Cherry' })).toThrow();
  test.expect(service.getAvailableSeeds().length).toBe(1);
});

test('getStockSeeds()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  test.expect(service.getStockSeeds().length).toBe(0);
  const mockAvailableSeeds: AvailableSeedStruct = { 1: { name: 'Tomato', variety: 'Cherry' } }
  const mockStockSeeds: StockSeedStruct = { 1: { exhausted: false } }
  mockStorageService.setItem(service.AVAILABLE_SEEDS_KEY, mockAvailableSeeds);
  mockStorageService.setItem(service.STOCK_SEEDS_KEY, mockStockSeeds);
  const seeds: StockSeed[] = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].name).toBe('Tomato');
  test.expect(seeds[0].variety).toBe('Cherry');
  test.expect(seeds[0].exhausted).toBe(false);
});

test('addStockSeed()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  const mockAvailableSeeds: AvailableSeedStruct = { 1: { name: 'Tomato', variety: 'Cherry' } }
  mockStorageService.setItem(service.AVAILABLE_SEEDS_KEY, mockAvailableSeeds);
  test.expect(service.getStockSeeds().length).toBe(0);
  service.addStockSeed(1);
  const seeds: StockSeed[] = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].name).toBe('Tomato');
  test.expect(seeds[0].exhausted).toBe(false);
});

test('addStockSeed() - seed does not exist', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  const mockAvailableSeeds: AvailableSeedStruct = { 1: { name: 'Tomato', variety: 'Cherry' } }
  mockStorageService.setItem(service.AVAILABLE_SEEDS_KEY, mockAvailableSeeds);
  test.expect(service.getStockSeeds().length).toBe(0);
  test.expect(() => service.addStockSeed(2)).toThrow();
  test.expect(service.getStockSeeds().length).toBe(0);
});

test('addStockSeed() - seed already exists', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  const mockStockSeeds: StockSeedStruct = { 1: { exhausted: true } }
  mockStorageService.setItem(service.STOCK_SEEDS_KEY, mockStockSeeds);
  service.addStockSeed(1);
  const seeds: StockSeed[] = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].exhausted).toBe(true);
});

test('markAsExhausted()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  const mockStockSeeds: StockSeedStruct = { 1: { exhausted: false } }
  mockStorageService.setItem(service.STOCK_SEEDS_KEY, mockStockSeeds);
  service.markAsExhausted(1);
  const seeds: StockSeed[] = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].exhausted).toBe(true);
});

test('markAsExhausted() - seed does not exist', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  const mockStockSeeds: StockSeedStruct = { 1: { exhausted: false } }
  mockStorageService.setItem(service.STOCK_SEEDS_KEY, mockStockSeeds);
  test.expect(() => service.markAsExhausted(2)).toThrow();
  const seeds: StockSeed[] = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].exhausted).toBe(false);
});

test('markAsResupplied()', () => {
  const mockStorageService: MockStorageService = new MockStorageService();
  mockStorageService.clear();
  const service = new SeedService(mockStorageService);
  const mockStockSeeds: StockSeedStruct = { 1: { exhausted: true } }
  mockStorageService.setItem(service.STOCK_SEEDS_KEY, mockStockSeeds);
  service.markAsResupplied(1);
  const seeds: StockSeed[] = service.getStockSeeds();
  test.expect(seeds.length).toBe(1);
  test.expect(seeds[0].exhausted).toBe(false);
});