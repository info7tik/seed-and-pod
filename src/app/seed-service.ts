import { Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { AvailableSeed, AvailableSeedProperties } from './type/available-seed.type';
import { StockSeed, StockSeedWithDetails } from './type/stock-seed.type';
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
    const availableSeeds: AvailableSeed[] = this.getRawAvailableSeeds();
    return Object.values(availableSeeds);
  }

  getAvailableSeedById(id: SeedId): AvailableSeed {
    return this.getSeedById(this.getRawAvailableSeeds(), id);
  }

  /**
   * Add a seed to available seeds
   * @param seed - The seed to add
   * @throws Error if seed with same name already exists
   */
  addAvailableSeed(seed: AvailableSeedProperties): void {
    const availableSeeds: AvailableSeed[] = this.getRawAvailableSeeds();
    if (seedNameExists(availableSeeds, seed.name)) {
      throw new Error(`seed with name ${seed.name} already exists`);
    }
    availableSeeds.push({ ...seed, id: getNextSeedId(availableSeeds) });
    this.storageService.setItem(this.AVAILABLE_SEEDS_KEY, availableSeeds);

    function seedNameExists(seeds: AvailableSeed[], name: string): boolean {
      return Object.values(seeds).some(s => s.name === name);
    }

    function getNextSeedId(seeds: AvailableSeed[]): number {
      return seeds.length + 1;
    }
  }

  /**
   * Get all stock seeds as an array
   * @returns StockSeed[] - All stock seeds with available seeds properties
   */
  getStockSeeds(): StockSeedWithDetails[] {
    const availableSeeds: AvailableSeed[] = this.getRawAvailableSeeds();
    const stockSeeds: StockSeed[] = this.getRawStockSeeds();
    return stockSeeds.map((seed) => ({ ...seed, ...this.getSeedById(availableSeeds, seed.id) }));
  }

  /**
   * Get a stock seed by id
   * @param id - The id of the stock seed to get
   * @returns StockSeed - The stock seed
   * @throws Error if stock seed does not exist
   */
  getStockSeedById(id: SeedId): StockSeed {
    const stockSeeds: StockSeed[] = this.getRawStockSeeds();
    return this.getSeedById(stockSeeds, id);
  }

  /**
  * Add a stock seed
  * @param seedId - The id of the seed to add
  * @throws Error if seed does not exist
  */
  addStockSeed(seedId: SeedId): void {
    let stockSeeds: StockSeed[] = this.getRawStockSeeds();
    if (this.seedIdExists(stockSeeds, seedId)) {
      return;
    }
    if (!this.seedIdExists(this.getRawAvailableSeeds(), seedId)) {
      throw new Error(`seed with id ${seedId} does not exist as available seed`);
    }
    stockSeeds.push(this.buildStockSeedWithDefaultProperties(seedId));
    this.saveStockSeeds(stockSeeds);
  }

  private buildStockSeedWithDefaultProperties(seedId: SeedId): StockSeed {
    return { id: seedId, exhausted: false };
  }

  /**
   * Mark a seed as exhausted
   * @param seedId - The id of the seed to mark as exhausted
   * @throws Error if seed does not exist
   */
  markAsExhausted(seedId: SeedId): void {
    let stockSeeds: StockSeed[] = this.getRawStockSeeds();
    this.markAs(stockSeeds, seedId, true);
    this.saveStockSeeds(stockSeeds);
  }

  /**
   * Mark a seed as resupplied
   * @param seedId - The id of the seed to mark as resupplied
   * @throws Error if seed does not exist
   */
  markAsResupplied(seedId: SeedId): void {
    let stockSeeds: StockSeed[] = this.getRawStockSeeds();
    this.markAs(stockSeeds, seedId, false);
    this.saveStockSeeds(stockSeeds);
  }

  private markAs(stockSeeds: StockSeed[], seedId: number, exhausted: boolean): void {
    let stockSeed = this.getSeedById(stockSeeds, seedId);
    if (!stockSeed) {
      throw new Error(`seed with id ${seedId} does not exist`);
    }
    stockSeed.exhausted = exhausted;
  }

  private getSeedById<SeedType extends AvailableSeed | StockSeed>(availableSeeds: SeedType[], id: number) {
    const seed = availableSeeds.find(s => s.id === id);
    if (!seed) {
      throw new Error(`seed with id ${id} does not exist`);
    }
    return seed;
  }

  private seedIdExists<SeedType extends AvailableSeed | StockSeed>(seeds: SeedType[], id: number): boolean {
    return seeds.some(s => s.id === id);
  }

  private saveStockSeeds(stockSeeds: StockSeed[]) {
    this.storageService.setItem(this.STOCK_SEEDS_KEY, stockSeeds);
  }

  private getRawAvailableSeeds(): AvailableSeed[] {
    return this.storageService.getItem(this.AVAILABLE_SEEDS_KEY, []);
  }

  private getRawStockSeeds(): StockSeed[] {
    return this.storageService.getItem(this.STOCK_SEEDS_KEY, []);
  }
}

