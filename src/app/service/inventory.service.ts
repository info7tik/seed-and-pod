import { Injectable } from '@angular/core';
import { InventorySeed, InventorySeedProperties } from '../type/inventory-seed.type';
import { SeedId } from '../type/seed-id.type';
import { SeedHelper } from './seed-helper';
import { YearService } from './year.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryService extends SeedHelper {
  public readonly INVENTORY_SEEDS_KEY = 'inventory-seeds';

  constructor(private yearService: YearService) { super(); }

  /**
 * Get all inventory seeds as an array
 * @returns InventorySeed[] - All inventory seeds
 */
  getInventorySeeds(): InventorySeed[] {
    return this.getRawInventorySeeds() as InventorySeed[];
  }

  /**
   * Get an inventory seed by id
   * @param id - The id of the seed to get
   * @returns InventorySeed - The inventory seed
   * @throws Error if seed does not exist
   */
  getInventorySeedById(id: SeedId): InventorySeed {
    return this.getSeedById(this.getRawInventorySeeds(), id);
  }

  /**
   * Add a seed to inventory seeds
   * @param seed - The seed to add
   * @throws Error if seed with same name already exists
   */
  addInventorySeed(seed: InventorySeedProperties): void {
    const inventorySeeds = this.getRawInventorySeeds();
    if (seedNameExists(inventorySeeds, seed.name)) {
      throw new Error(`seed with name ${seed.name} already exists`);
    }
    inventorySeeds.push({ ...seed, id: getNextSeedId(inventorySeeds) });
    this.saveInventorySeeds(inventorySeeds);


    function seedNameExists(seeds: InventorySeed[], name: string): boolean {
      return seeds.some(s => s.name === name);
    }

    function getNextSeedId(seeds: InventorySeed[]): SeedId {
      return (seeds.length + 1).toString();
    }
  }

  /**
   * Remove an inventory seed
   * @param seedId - The id of the seed to remove
   * @throws Error if seed does not exist
   */
  removeInventorySeed(seedId: SeedId): void {
    const inventorySeeds = this.getRawInventorySeeds();
    if (!this.seedIdExists(inventorySeeds, seedId)) {
      throw new Error(`seed with id ${seedId} does not exist`);
    }
    this.saveInventorySeeds(inventorySeeds.filter(seed => seed.id !== seedId));
  }

  private saveInventorySeeds(inventorySeeds: InventorySeed[]) {
    this.yearService.setItemByYear(this.INVENTORY_SEEDS_KEY, inventorySeeds);
  }

  private getRawInventorySeeds(): InventorySeed[] {
    return this.yearService.getItemByYear(this.INVENTORY_SEEDS_KEY, []);
  }
}
