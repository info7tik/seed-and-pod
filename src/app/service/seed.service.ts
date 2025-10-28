import { Injectable } from '@angular/core';
import { InventorySeed } from '../type/inventory-seed.type';
import { StockSeed, StockSeedWithDetails } from '../type/stock-seed.type';
import { SeedId } from '../type/seed-id.type';
import { InventoryService } from './inventory.service';
import { SeedHelper } from './seed-helper';
import { YearService } from './year.service';

@Injectable({
  providedIn: 'root'
})
export class SeedService extends SeedHelper {
  public readonly STOCK_SEEDS_KEY = 'stock-seeds';

  constructor(private yearService: YearService, private inventoryService: InventoryService) { super(); }

  /**
   * Get all stock seeds as an array
   * @returns StockSeed[] - All stock seeds with available seeds properties
   */
  getStockSeeds(): StockSeedWithDetails[] {
    const inventorySeeds: InventorySeed[] = this.inventoryService.getInventorySeeds();
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
    if (!this.seedIdExists(this.inventoryService.getInventorySeeds(), seedId)) {
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

  private saveStockSeeds(stockSeeds: StockSeed[]) {
    this.yearService.setItemByYear(this.STOCK_SEEDS_KEY, stockSeeds);
  }

  private getRawStockSeeds(): StockSeed[] {
    return this.yearService.getItemByYear(this.STOCK_SEEDS_KEY, []);
  }
}

