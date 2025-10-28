import { Component, OnInit } from '@angular/core';
import { HeaderMenu } from '../header-menu/header-menu.component';
import { FormsModule } from '@angular/forms';
import { SeedService } from '../service/seed.service';
import { InventorySeed } from '../type/inventory-seed.type';
import { StockSeedWithDetails } from '../type/stock-seed.type';
import { SeedId } from '../type/seed-id.type';
import { TranslocoPipe } from '@jsverse/transloco';
import { InventoryService } from '../service/inventory.service';
import { YearSelectorComponent } from '../year-selector/year-selector.component';

@Component({
  selector: 'app-stock',
  imports: [HeaderMenu, YearSelectorComponent, FormsModule, TranslocoPipe],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss'
})
export class Stock implements OnInit {
  readonly DEFAULT_SEED_ID = '-1';
  inventorySeeds: InventorySeed[] = [];
  stockSeeds: StockSeedWithDetails[] = [];
  seedIdToAddInStock: SeedId = this.DEFAULT_SEED_ID;
  selectedSeeds: Set<SeedId> = new Set();
  reloadDataCallback = () => this.reloadData();

  constructor(private seedService: SeedService, private inventoryService: InventoryService) { }

  ngOnInit(): void {
    this.reloadData();
  }

  reloadData() {
    this.inventorySeeds = this.inventoryService.getInventorySeeds();
    this.stockSeeds = this.seedService.getStockSeeds();
  }

  get inventorySeedsNotInStock(): InventorySeed[] {
    const stockSeedIds = this.stockSeeds.map(seed => seed.id);
    return this.inventorySeeds.filter(seed => !stockSeedIds.includes(seed.id));
  }

  addSeedToStock() {
    try {
      if (this.seedIdToAddInStock !== this.DEFAULT_SEED_ID) {
        this.seedService.addStockSeed(this.seedIdToAddInStock);
        this.stockSeeds = this.seedService.getStockSeeds();
        this.seedIdToAddInStock = this.DEFAULT_SEED_ID;
        console.log('Seed added to stock:', this.seedIdToAddInStock);
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

  toggleSeedExhaustedState(seedId: SeedId) {
    try {
      const seed = this.stockSeeds.find(s => s.id === seedId);
      if (seed) {
        if (seed.exhausted) {
          this.seedService.markAsResupplied(seedId);
        } else {
          this.seedService.markAsExhausted(seedId);
        }
        this.stockSeeds = this.seedService.getStockSeeds();
      }
    } catch (error) {
      console.error('Error toggling seed exhausted state:', error);
    }
  }
}
