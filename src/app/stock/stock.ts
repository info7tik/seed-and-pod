import { Component, OnInit, signal } from '@angular/core';
import { HeaderMenu } from '../header-menu/header-menu';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SeedService } from '../seed-service';
import { InventorySeed } from '../type/inventory-seed.type';
import { StockSeedWithDetails } from '../type/stock-seed.type';
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
  readonly DEFAULT_SEED_ID = '';
  availableSeeds: InventorySeed[] = [];
  stockSeeds: StockSeedWithDetails[] = [];
  seedIdToAddInStock: SeedId = this.DEFAULT_SEED_ID;
  selectedSeeds: Set<SeedId> = new Set();

  //TODO create a component to handle errors

  constructor(private seedService: SeedService) { }

  ngOnInit(): void {
    this.availableSeeds = this.seedService.getAvailableSeeds();
    this.stockSeeds = this.seedService.getStockSeeds();
  }

  get availableSeedsNotInStock(): InventorySeed[] {
    const stockSeedIds = this.stockSeeds.map(seed => seed.id);
    return this.availableSeeds.filter(seed => !stockSeedIds.includes(seed.id));
  }

  addSeedToStock() {
    try {
      if (this.seedIdToAddInStock !== this.DEFAULT_SEED_ID) {
        this.seedService.addStockSeed(this.seedIdToAddInStock);
        this.stockSeeds = this.seedService.getStockSeeds();
        this.seedIdToAddInStock = this.DEFAULT_SEED_ID;
      }
    } catch (error) {
      console.error('Error adding seed to stock:', error);
    }
  }

  get selectedSeedsCount() {
    return this.selectedSeeds.size;
  }

  isSeedSelected(seedId: SeedId): boolean {
    return this.selectedSeeds.has(seedId);
  }

  toggleSeedSelection(seedId: SeedId) {
    if (this.selectedSeeds.has(seedId)) {
      this.selectedSeeds.delete(seedId);
    } else {
      this.selectedSeeds.add(seedId);
    }
  }

  removeSelectedSeeds() {
    const selectedIds = Array.from(this.selectedSeeds);
    selectedIds.forEach(seedId => {
      try {
        this.seedService.removeStockSeed(seedId);
      } catch (error) {
        console.error('Error removing seed:', error);
      }
    });
    this.selectedSeeds.clear();
    this.stockSeeds = this.seedService.getStockSeeds();
  }

  markSelectedAsExhausted() {
    this.selectedSeeds.forEach(seedId => {
      try {
        this.seedService.markAsExhausted(seedId);
      } catch (error) {
        console.error('Error marking seed as exhausted:', error);
      }
    });
    this.selectedSeeds.clear();
    this.stockSeeds = this.seedService.getStockSeeds();
  }

  markSelectedAsResupplied(seedId: SeedId) {
    try {
      this.seedService.markAsResupplied(seedId);
      this.stockSeeds = this.seedService.getStockSeeds();
    } catch (error) {
      console.error('Error marking seed as resupplied:', error);
    }
  }
}
