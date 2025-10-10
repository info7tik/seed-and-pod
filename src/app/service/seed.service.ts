import { Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { InventorySeed, InventorySeedProperties } from '../type/inventory-seed.type';
import { StockSeed, StockSeedWithDetails } from '../type/stock-seed.type';
import { SeedId } from '../type/seed-id.type';

@Injectable({
  providedIn: 'root'
})
export class SeedService {
  public readonly AVAILABLE_SEEDS_KEY = 'available-seeds';
  public readonly STOCK_SEEDS_KEY = 'stock-seeds';

  constructor(private storageService: StorageService) { }
  /**
 * Get all available seeds as an array
 * @returns Seed[] - All available seeds
 */
  getInventorySeeds(): InventorySeed[] {
    const availableSeeds: InventorySeed[] = this.getRawInventorySeeds();
    return availableSeeds;
  }

  /**
   * Get an available seed by id
   * @param id - The id of the seed to get
   * @returns AvailableSeed - The available seed
   * @throws Error if seed does not exist
   */
  getInventorySeedById(id: SeedId): InventorySeed {
    return this.getSeedById(this.getRawInventorySeeds(), id);
  }

  /**
   * Add a seed to available seeds
   * @param seed - The seed to add
   * @throws Error if seed with same name already exists
   */
  addInventorySeed(seed: InventorySeedProperties): void {
    const inventorySeeds = this.getRawInventorySeeds();
    if (seedNameExists(inventorySeeds, seed.name)) {
      throw new Error(`seed with name ${seed.name} already exists`);
    }
    inventorySeeds.push({ ...seed, id: getNextSeedId(inventorySeeds) });
    this.storageService.setItem(this.AVAILABLE_SEEDS_KEY, inventorySeeds);


    function seedNameExists(seeds: InventorySeed[], name: string): boolean {
      return seeds.some(s => s.name === name);
    }

    function getNextSeedId(seeds: InventorySeed[]): SeedId {
      return (seeds.length + 1).toString();
    }
  }

  /**
   * Get all stock seeds as an array
   * @returns StockSeed[] - All stock seeds with available seeds properties
   */
  getStockSeeds(): StockSeedWithDetails[] {
    const inventorySeeds: InventorySeed[] = this.getRawInventorySeeds();
    const stockSeeds: StockSeed[] = this.getRawStockSeeds();
    return stockSeeds.map((seed) => ({ ...seed, ...this.getSeedById(inventorySeeds, seed.id) }));
  }

  /**
   * Get a stock seed by id
   * @param id - The id of the stock seed to get
   * @returns StockSeed - The stock seed
   * @throws Error if stock seed does not exist
   */
  getStockSeedById(id: SeedId): StockSeed {
    const stockSeeds = this.getRawStockSeeds();
    return this.getSeedById(stockSeeds, id);
  }

  /**
  * Add a stock seed
  * @param seedId - The id of the seed to add
  * @throws Error if seed does not exist
  */
  addStockSeed(seedId: SeedId): void {
    let stockSeeds = this.getRawStockSeeds();
    if (this.seedIdExists(stockSeeds, seedId)) {
      return;
    }
    if (!this.seedIdExists(this.getRawInventorySeeds(), seedId)) {
      throw new Error(`seed with id ${seedId} does not exist as inventory seed`);
    }
    stockSeeds.push(this.buildStockSeedWithDefaultProperties(seedId));
    this.saveStockSeeds(stockSeeds);
  }

  private buildStockSeedWithDefaultProperties(seedId: SeedId): StockSeed {
    return { id: seedId, exhausted: false };
  }

  /**
   * Remove a stock seed
   * @param seedId - The id of the seed to remove
   * @throws Error if seed does not exist
   */
  removeStockSeed(seedId: SeedId): void {
    const stockSeeds = this.getRawStockSeeds();
    if (!this.seedIdExists(stockSeeds, seedId)) {
      throw new Error(`seed with id ${seedId} does not exist`);
    }
    this.saveStockSeeds(stockSeeds.filter(seed => seed.id !== seedId));
  }

  /**
   * Mark a seed as exhausted
   * @param seedId - The id of the seed to mark as exhausted
   * @throws Error if seed does not exist
   */
  markAsExhausted(seedId: SeedId): void {
    let stockSeeds = this.getRawStockSeeds();
    this.markAs(stockSeeds, seedId, true);
    this.saveStockSeeds(stockSeeds);
  }

  /**
   * Mark a seed as resupplied
   * @param seedId - The id of the seed to mark as resupplied
   * @throws Error if seed does not exist
   */
  markAsResupplied(seedId: SeedId): void {
    let stockSeeds = this.getRawStockSeeds();
    this.markAs(stockSeeds, seedId, false);
    this.saveStockSeeds(stockSeeds);
  }

  private markAs(stockSeeds: StockSeed[], seedId: SeedId, exhausted: boolean): void {
    let stockSeed = this.getSeedById(stockSeeds, seedId);
    if (!stockSeed) {
      throw new Error(`seed with id ${seedId} does not exist`);
    }
    stockSeed.exhausted = exhausted;
  }

  private getSeedById<SeedType extends InventorySeed | StockSeed>(availableSeeds: SeedType[], id: SeedId) {
    const seed = availableSeeds.find(s => s.id === id);
    if (!seed) {
      throw new Error(`seed with id ${id} does not exist`);
    }
    return seed;
  }

  private seedIdExists<SeedType extends InventorySeed | StockSeed>(seeds: SeedType[], id: SeedId): boolean {
    return seeds.some(s => s.id === id);
  }

  private saveStockSeeds(stockSeeds: StockSeed[]) {
    this.storageService.setItem(this.STOCK_SEEDS_KEY, stockSeeds);
  }

  private getRawInventorySeeds(): InventorySeed[] {
    return this.storageService.getItem(this.AVAILABLE_SEEDS_KEY, []);
  }

  private getRawStockSeeds(): StockSeed[] {
    return this.storageService.getItem(this.STOCK_SEEDS_KEY, []);
  }
}

