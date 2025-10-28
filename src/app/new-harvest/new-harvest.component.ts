import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HeaderMenu } from '../header-menu/header-menu.component';
import { HarvestService } from '../service/harvest.service';
import { SeedService } from '../service/seed.service';
import { StockSeedWithDetails } from '../type/stock-seed.type';
import { Harvest } from '../type/harvest.type';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-new-harvest',
  imports: [FormsModule, RouterLink, HeaderMenu, TranslocoPipe],
  templateUrl: './new-harvest.component.html',
  styleUrl: './new-harvest.component.scss'
})
export class NewHarvestComponent implements OnInit {
  readonly DEFAULT_SEED_ID = '';
  stockSeeds: StockSeedWithDetails[] = [];
  selectedSeedId: string = this.DEFAULT_SEED_ID;
  weightGrams: number = 0;
  harvestDate: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private basketService: HarvestService,
    private seedService: SeedService
  ) { }

  ngOnInit(): void {
    this.loadStockSeeds();
    this.setDefaultDate();
  }

  loadStockSeeds(): void {
    this.stockSeeds = this.seedService.getStockSeeds();
  }

  setDefaultDate(): void {
    const today = new Date();
    this.harvestDate = today.toISOString().split('T')[0];
  }

  addHarvest(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (!this.selectedSeedId || this.selectedSeedId === this.DEFAULT_SEED_ID) {
      this.errorMessage = 'Please select a seed';
      return;
    }

    if (this.weightGrams <= 0) {
      this.errorMessage = 'Weight must be greater than 0';
      return;
    }

    if (!this.harvestDate) {
      this.errorMessage = 'Please select a harvest date';
      return;
    }

    try {
      const selectedSeed = this.stockSeeds.find(seed => seed.id === this.selectedSeedId);
      if (!selectedSeed) {
        throw new Error('Selected seed not found');
      }

      const harvest: Harvest = {
        seedId: selectedSeed.id,
        seedName: selectedSeed.name,
        weightGrams: this.weightGrams,
        date: new Date(this.harvestDate)
      };

      this.basketService.addHarvest(harvest);
      this.successMessage = 'Harvest added successfully!';
      this.resetForm();
    } catch (error: any) {
      this.errorMessage = error?.message ?? 'Failed to add harvest';
    }
  }

  private resetForm(): void {
    this.selectedSeedId = this.DEFAULT_SEED_ID;
    this.weightGrams = 0;
    this.setDefaultDate();
  }
}
