import { Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { AvailableSeed, AvailableSeedStruct } from './type/available-seed.type';
import { StockSeed, StockSeedProperties, StockSeedStruct } from './type/stock-seed.type';
import { SeedId } from './type/seed-id.type';

export interface Seed {
  name: string;
  variety: string;
  exhausted: boolean;
  selected: boolean;
}

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
  getAvailableSeeds(): AvailableSeed[] {
    const availableSeeds: AvailableSeedStruct = this.getRawAvailableSeeds();
    return Object.values(availableSeeds);
  }

  /**
   * Add a seed to available seeds
   * @param seed - The seed to add
   * @throws Error if seed already exists
   */
  addAvailableSeed(seed: AvailableSeed): void {
    const availableSeeds: AvailableSeedStruct = this.getAvailableSeeds();
    if (seedExists(availableSeeds, seed.name)) {
      throw new Error(`seed with name ${seed.name} already exists`);
    }
    availableSeeds[getNextSeedId(availableSeeds)] = seed;
    this.storageService.setItem(this.AVAILABLE_SEEDS_KEY, availableSeeds);

    function seedExists(seeds: AvailableSeedStruct, name: string): boolean {
      return Object.values(seeds).some(s => s.name === name);
    }

    function getNextSeedId(seeds: AvailableSeedStruct): number {
      return Object.keys(seeds).length + 1;
    }
  }

  /**
   * Get all stock seeds as an array
   * @returns StockSeed[] - All stock seeds with available seeds properties
   */
  getStockSeeds(): StockSeed[] {
    const availableSeeds: AvailableSeedStruct = this.getRawAvailableSeeds();
    const stockSeeds: StockSeedStruct = this.getRawStockSeeds();
    return Object.entries(stockSeeds).map(([id, properties]) => ({ ...properties, ...availableSeeds[parseInt(id)] }));
  }

  /**
  * Add a stock seed
  * @param seedId - The id of the seed to add
  * @throws Error if seed does not exist
  */
  addStockSeed(seedId: SeedId): void {
    const availableSeeds: AvailableSeedStruct = this.getRawAvailableSeeds();
    const stockSeeds: StockSeedStruct = this.getRawStockSeeds();
    if (stockSeeds[seedId]) {
      return;
    }
    if (!availableSeeds[seedId]) {
      throw new Error(`seed with id ${seedId} does not exist`);
    }
    stockSeeds[seedId] = { exhausted: false };
    this.saveStockSeeds(stockSeeds);
  }

  /**
   * Mark a seed as exhausted
   * @param seedId - The id of the seed to mark as exhausted
   * @throws Error if seed does not exist
   */
  markAsExhausted(seedId: SeedId): void {
    let stockSeeds: StockSeedStruct = this.getRawStockSeeds();
    this.markAs(stockSeeds, seedId, true);
    this.saveStockSeeds(stockSeeds);
  }

  markAsResupplied(seedId: SeedId): void {
    let stockSeeds: StockSeedStruct = this.getRawStockSeeds();
    this.markAs(stockSeeds, seedId, false);
    this.saveStockSeeds(stockSeeds);
  }

  private markAs(stockSeeds: StockSeedStruct, seedId: number, exhausted: boolean) {
    if (!stockSeeds[seedId]) {
      throw new Error(`seed with id ${seedId} does not exist`);
    }
    stockSeeds[seedId] = { exhausted: exhausted };
    return stockSeeds;
  }

  private saveStockSeeds(stockSeeds: StockSeedStruct) {
    this.storageService.setItem(this.STOCK_SEEDS_KEY, stockSeeds);
  }

  private getRawAvailableSeeds(): AvailableSeedStruct {
    return this.storageService.getItem(this.AVAILABLE_SEEDS_KEY, {});
  }

  private getRawStockSeeds(): StockSeedStruct {
    return this.storageService.getItem(this.STOCK_SEEDS_KEY, {});
  }
}
