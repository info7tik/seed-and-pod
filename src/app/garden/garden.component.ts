import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderMenu } from '../header-menu/header-menu.component';
import { SeedService } from '../service/seed.service';
import { StockSeedWithDetails } from '../type/stock-seed.type';
import { Bed } from '../type/bed.type';

@Component({
  selector: 'app-garden',
  imports: [HeaderMenu, FormsModule],
  templateUrl: './garden.component.html',
  styleUrl: './garden.component.scss'
})
export class Garden implements OnInit {
  numberOfBeds: number = 1;
  stockSeeds: StockSeedWithDetails[] = [];
  beds: Bed[] = [];
  private readonly BEDS_KEY = 'garden-number-of-beds';

  constructor(private seedService: SeedService) { }

  ngOnInit(): void {
    const savedBeds = localStorage.getItem(this.BEDS_KEY);
    if (savedBeds) {
      this.numberOfBeds = parseInt(savedBeds, 10) || 1;
    }

    this.loadStockSeeds();
    this.initializeBeds();
  }

  updateNumberOfBeds(): void {
    // Ensure minimum of 1 bed
    if (this.numberOfBeds < 1) {
      this.numberOfBeds = 1;
    }

    // Save to localStorage
    localStorage.setItem(this.BEDS_KEY, this.numberOfBeds.toString());
    this.initializeBeds();
  }

  private loadStockSeeds(): void {
    this.stockSeeds = this.seedService.getStockSeeds();
  }

  private initializeBeds(): void {
    this.beds = [];
    for (let i = 1; i <= this.numberOfBeds; i++) {
      this.beds.push({ id: i.toString(), seeds: [] });
    }

    // Assign seeds to beds (for now, just distribute evenly)
    this.distributeSeedsToBeds();
  }

  private distributeSeedsToBeds(): void {
    // Reset all beds
    this.beds.forEach(bed => bed.seeds = []);

    // For now, just show unassigned seeds
    // In a real implementation, you'd load bed assignments from storage
  }

  get unassignedSeeds(): StockSeedWithDetails[] {
    return this.stockSeeds.filter(seed => !this.isSeedAssignedToBed(seed.id));
  }

  private isSeedAssignedToBed(seedId: string): boolean {
    return this.beds.some(bed => bed.seeds.includes(seedId));
  }

  getSeedById(seedId: string): StockSeedWithDetails | undefined {
    return this.stockSeeds.find(seed => seed.id === seedId);
  }

  assignSeedToBed(seedId: string, event: Event): void {
    const target = event.target as HTMLSelectElement;
    const bedId = target.value;

    if (bedId) {
      // Remove seed from all beds first
      this.beds.forEach(bed => {
        bed.seeds = bed.seeds.filter(id => id !== seedId);
      });

      // Add seed to selected bed
      const selectedBed = this.beds.find(bed => bed.id === bedId);
      if (selectedBed) {
        selectedBed.seeds.push(seedId);
      }

      // Reset the select
      target.value = '';
    }
  }

  moveSeedToBed(seedId: string, event: Event, currentBedId: string): void {
    const target = event.target as HTMLSelectElement;
    const destination = target.value;

    if (destination) {
      // Remove seed from current bed
      const currentBed = this.beds.find(bed => bed.id === currentBedId);
      if (currentBed) {
        currentBed.seeds = currentBed.seeds.filter(id => id !== seedId);
      }

      if (destination === 'unassigned') {
        // Seed becomes unassigned - no action needed
      } else {
        // Add seed to destination bed
        const destinationBed = this.beds.find(bed => bed.id === destination);
        if (destinationBed) {
          destinationBed.seeds.push(seedId);
        }
      }

      // Reset the select
      target.value = '';
    }
  }
}
