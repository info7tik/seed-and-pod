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

  clearStorage() {
    this.storageService.removeItem(this.BEDS_KEY);
  }

  createBeds(numberOfBeds: number): void {
    const beds: Bed[] = [];
    for (let i = 0; i < numberOfBeds; i++) {
      beds.push({ id: i.toString(), seeds: [] });
    }
    this.saveBeds(beds);
  }

  getBeds(): Bed[] {
    const beds = this.storageService.getItem(this.BEDS_KEY, []);
    if (beds.length === 0) {
      this.createBeds(1);
      return this.getBeds();
    }
    return beds;
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
    let beds = this.getBeds();
    const bed = getBedFromId(beds, bedId);
    if (bed) {
      bed.seeds.push(seedId);
      this.saveBeds(beds);
    }

    function getBedFromId(beds: Bed[], bedId: BedId): Bed {
      const bed = beds.find(b => b.id === bedId);
      if (!bed) {
        throw new Error(`bed with id ${bedId} does not exist`);
      }
      return bed;
    }
  }

  removeSeedFromBeds(seedId: SeedId): void {
    let beds = this.getBeds();
    beds.forEach(bed => {
      bed.seeds = bed.seeds.filter(s => s !== seedId);
    });
    this.saveBeds(beds);
  }

  saveBeds(beds: Bed[]): void {
    this.storageService.setItem(this.BEDS_KEY, beds);
  }
}
