import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Bed, BedId } from '../type/bed.type';
import { SeedId } from '../type/seed-id.type';

@Injectable({
  providedIn: 'root'
})
export class BedService {
  public readonly BEDS_KEY = 'beds';

  constructor(private storageService: StorageService) { }

  createBeds(numberOfBeds: number): void {
    const beds: Bed[] = [];
    for (let i = 0; i < numberOfBeds; i++) {
      beds.push({ id: i.toString(), seeds: [] });
    }
    this.saveBeds(beds);
  }

  getBeds(): Bed[] {
    return this.storageService.getItem(this.BEDS_KEY, []);
  }

  getBedFromId(bedId: BedId): Bed {
    const beds: Bed[] = this.getBeds();
    const bed = beds.find(b => b.id === bedId);
    if (!bed) {
      throw new Error(`bed with id ${bedId} does not exist`);
    }
    return bed;
  }

  assignSeedToBed(bedId: BedId, seedId: SeedId): void {
    const bed = this.getBedFromId(bedId);
    if (bed) {
      bed.seeds.push(seedId);
      this.saveBeds(this.getBeds());
    }
  }

  removeSeedFromBed(bedId: BedId, seedId: SeedId): void {
    const bed = this.getBedFromId(bedId);
    if (bed.seeds.includes(seedId)) {
      bed.seeds = bed.seeds.filter(s => s !== seedId);
      this.saveBeds(this.getBeds());
    } else {
      throw new Error(`seed with id ${seedId} does not exist in bed with id ${bedId}`);
    }
  }

  getNotAssignedSeeds(existingSeeds: SeedId[]): SeedId[] {
    const assignedSeeds = this.getBeds().flatMap(b => b.seeds);
    return existingSeeds.filter(s => !assignedSeeds.includes(s));
  }

  saveBeds(beds: Bed[]): void {
    this.storageService.setItem(this.BEDS_KEY, beds);
  }
}
