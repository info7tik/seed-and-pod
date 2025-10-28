import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { AggregatedHarvest, Harvest, HarvestWithStringDate } from '../type/harvest.type';

@Injectable({
  providedIn: 'root'
})
export class HarvestService {
  public readonly HARVESTS_KEY = 'harvests';

  constructor(private storageService: StorageService) { }

  getHarvests(): Harvest[] {
    return this.sortHarvests(this.storageService.getItem(this.HARVESTS_KEY, []).map((h: HarvestWithStringDate) => ({ ...h, date: new Date(h.date) })));
  }

  private sortHarvests<H extends Harvest | AggregatedHarvest>(harvests: H[]): H[] {
    return harvests.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  addHarvest(harvest: Harvest): void {
    const harvests = this.getHarvests();
    const existingHarvest = this.findHarvest(harvests, harvest);
    if (existingHarvest) {
      throw new Error(`harvest with date ${harvest.date.toISOString()} and seed id ${harvest.seedId} already exists`);
    }
    harvests.push(harvest);
    this.saveHarvests(harvests);
  }

  removeHarvest(harvest: Harvest): void {
    const harvests = this.getHarvests();
    const toRemoveHarvest = this.findHarvest(harvests, harvest);
    if (toRemoveHarvest) {
      const filteredHarvests = harvests.filter(h => h !== toRemoveHarvest);
      this.saveHarvests(filteredHarvests);
    } else {
      throw new Error(`harvest with date ${harvest.date.toISOString()} and seed id ${harvest.seedId} does not exist`);
    }
  }

  private findHarvest(harvests: Harvest[], harvest: Harvest): Harvest | undefined {
    return harvests.find(h =>
      h.date.getFullYear() === harvest.date.getFullYear() &&
      h.date.getMonth() === harvest.date.getMonth() &&
      h.date.getDate() === harvest.date.getDate() &&
      h.seedId === harvest.seedId);
  }

  private saveHarvests(harvests: Harvest[]): void {
    const serializedHarvests = harvests.map((h: Harvest) => ({ ...h, date: h.date.toISOString() }));
    this.storageService.setItem(this.HARVESTS_KEY, serializedHarvests);
  }

  aggregateHarvests(harvests: Harvest[]): AggregatedHarvest[] {
    const aggregatedHarvests = harvests.reduce<AggregatedHarvest[]>((aggregated, current) => {
      const existingHarvest = aggregated.find(h => h.seedId === current.seedId);
      if (existingHarvest) {
        existingHarvest.weightGrams += current.weightGrams;
        existingHarvest.count++;
      } else {
        aggregated.push({ ...current, count: 1 });
      }
      return aggregated;
    }, [])
    return this.sortHarvests(aggregatedHarvests);
  }
}
