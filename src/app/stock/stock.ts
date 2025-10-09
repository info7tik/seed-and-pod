import { Component, OnInit, signal } from '@angular/core';
import { HeaderMenu } from '../header-menu/header-menu';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SeedService } from '../seed-service';
import { AvailableSeedProperties, AvailableSeed } from '../type/available-seed.type';
import { StockSeed, StockSeedWithDetails } from '../type/stock-seed.type';
import { SeedId } from '../type/seed-id.type';

export interface Seed {
  id: string;
  name: string;
  variety: string;
  exhausted: boolean;
  selected: boolean;
}

@Component({
  selector: 'app-stock',
  imports: [HeaderMenu, RouterLink, FormsModule],
  templateUrl: './stock.html',
  styleUrl: './stock.scss'
})
export class Stock implements OnInit {
  availableSeeds = signal<AvailableSeed[]>([]);
  stockSeeds = signal<StockSeedWithDetails[]>([]);
  selectedSeedToAdd = signal<SeedId | null>(null);
  selectedSeeds = signal<Set<SeedId>>(new Set());

  constructor(private seedService: SeedService) { }

  ngOnInit(): void {
    localStorage.clear();
    this.fakeDataForTesting();
    this.availableSeeds.set(this.seedService.getAvailableSeeds());
    this.stockSeeds.set(this.seedService.getStockSeeds());
  }

  private fakeDataForTesting() {
    this.seedService.addAvailableSeed({ name: 'Tomato', variety: 'Cherry' });
    this.seedService.addAvailableSeed({ name: 'Potato', variety: 'Russet' });
    this.seedService.addAvailableSeed({ name: 'Carrot', variety: 'Imperator' });
    this.seedService.addAvailableSeed({ name: 'Lettuce', variety: 'Romaine' });
    this.seedService.addAvailableSeed({ name: 'Onion', variety: 'Red' });
    this.seedService.addAvailableSeed({ name: 'Garlic', variety: 'White' });
    this.seedService.addAvailableSeed({ name: 'Cucumber', variety: 'English' });
  }

  get availableSeedsNotInStock(): AvailableSeed[] {
    const allAvailableSeeds = this.availableSeeds();
    const stockSeedIds = this.stockSeeds().map(seed => seed.id);
    return allAvailableSeeds.filter(seed => !stockSeedIds.includes(seed.id));
  }

  addSeedToStock() {
    const selectedSeedId = this.selectedSeedToAdd();
    if (selectedSeedId) {
      try {
        this.seedService.addStockSeed(selectedSeedId);
        this.stockSeeds.set(this.seedService.getStockSeeds());
        this.selectedSeedToAdd.set(null);
      } catch (error) {
        console.error('Error adding seed to stock:', error);
      }
    }
  }

  get selectedSeedsCount() {
    return this.selectedSeeds().size;
  }

  isSeedSelected(seedId: SeedId): boolean {
    return this.selectedSeeds().has(seedId);
  }

  toggleSeedSelection(seedId: SeedId) {
    const currentSelected = this.selectedSeeds();
    const newSelected = new Set(currentSelected);

    if (newSelected.has(seedId)) {
      newSelected.delete(seedId);
    } else {
      newSelected.add(seedId);
    }

    this.selectedSeeds.set(newSelected);
  }

  removeSelectedSeeds() {
    const selectedIds = Array.from(this.selectedSeeds());
    selectedIds.forEach(seedId => {
      try {
        // Note: The current SeedService doesn't have a removeStockSeed method
        // This would need to be implemented in the service
        console.log('Removing seed:', seedId);
      } catch (error) {
        console.error('Error removing seed:', error);
      }
    });

    // Clear selection after removal
    this.selectedSeeds.set(new Set());
    // Refresh stock seeds
    this.stockSeeds.set(this.seedService.getStockSeeds());
  }

  markSelectedAsExhausted() {
    const selectedIds = Array.from(this.selectedSeeds());
    selectedIds.forEach(seedId => {
      try {
        this.seedService.markAsExhausted(seedId);
      } catch (error) {
        console.error('Error marking seed as exhausted:', error);
      }
    });

    // Clear selection after marking
    this.selectedSeeds.set(new Set());
    // Refresh stock seeds
    this.stockSeeds.set(this.seedService.getStockSeeds());
  }
}
