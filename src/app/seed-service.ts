import { Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { availableSeeds } from './type/available-seeds.type';

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
  getAvailableSeeds(): Seed[] {
    const availableSeeds: availableSeeds = this.storageService.getItem(this.AVAILABLE_SEEDS_KEY, {});
    return Object.values(availableSeeds);
  }

  /**
   * Add a seed to available seeds
   * @param seed - The seed to add
   * @returns boolean - true if seed was added, false if it already exists
   */
  addAvailableSeed(seed: Seed): void {
    const availableSeeds: availableSeeds = this.getAvailableSeeds();
    if (seedExists(availableSeeds, seed.name)) {
      throw new Error(`seed with name ${seed.name} already exists`);
    }
    availableSeeds[getNextSeedId(availableSeeds)] = seed;
    this.storageService.setItem(this.AVAILABLE_SEEDS_KEY, availableSeeds);

    function seedExists(seeds: availableSeeds, name: string): boolean {
      return Object.values(seeds).some(s => s.name === name);
    }

    function getNextSeedId(seeds: availableSeeds): number {
      return Object.keys(seeds).length + 1;
    }
  }

  getStockSeeds(): Seed[] {
    const stockSeeds: availableSeeds = this.storageService.getItem(this.STOCK_SEEDS_KEY, {});
    return Object.values(stockSeeds);
  }
}
