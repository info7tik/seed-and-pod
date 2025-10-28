import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderMenu } from '../header-menu/header-menu.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { GlobalService } from '../service/global-service.service';
import { InventorySeed } from '../type/inventory-seed.type';
import { InventoryService } from '../service/inventory.service';
import { SeedId } from '../type/seed-id.type';

@Component({
  selector: 'app-inventory',
  imports: [FormsModule, HeaderMenu, TranslocoPipe],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit {
  readonly DEFAULT_DAYS_BEFORE_HARVEST = 30;
  readonly DEFAULT_FAMILY_INDEX = -1;
  readonly daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  name: string = '';
  familyIndex: number = this.DEFAULT_FAMILY_INDEX;
  sowingDay: number = 1;
  sowingMonth: number = 1;
  transplantingDay: number = 1;
  transplantingMonth: number = 1;
  daysBeforeHarvest: number = this.DEFAULT_DAYS_BEFORE_HARVEST;
  enableTransplanting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  inventorySeeds: InventorySeed[] = [];

  constructor(private inventoryService: InventoryService, private globalService: GlobalService) { }

  ngOnInit(): void {
    this.loadInventorySeeds();
  }

  get months() {
    return this.globalService.months;
  }

  get vegetableFamilies() {
    return this.globalService.vegetableFamilies;
  }

  loadInventorySeeds(): void {
    this.inventorySeeds = this.inventoryService.getInventorySeeds();
  }

  addSeed() {
    this.errorMessage = null;
    this.successMessage = null;

    const trimmedName = this.name.trim();

    if (!trimmedName || this.familyIndex === this.DEFAULT_FAMILY_INDEX) {
      this.errorMessage = 'Name and family are required';
      return;
    }
    try {
      this.inventoryService.addInventorySeed({
        name: trimmedName,
        family: this.vegetableFamilies[this.familyIndex],
        sowing: {
          enabled: true,
          day: this.sowingDay,
          month: this.sowingMonth
        },
        transplanting: {
          enabled: this.enableTransplanting,
          day: this.transplantingDay,
          month: this.transplantingMonth
        },
        daysBeforeHarvest: this.daysBeforeHarvest
      });
      this.successMessage = 'Seed added successfully';
      this.resetForm();
      this.loadInventorySeeds();
    } catch (e: any) {
      this.errorMessage = e?.message ?? 'Failed to add seed';
    }
  }

  removeSeed(seedId: SeedId): void {
    try {
      this.inventoryService.removeInventorySeed(seedId);
      this.loadInventorySeeds();
    } catch (error) {
      console.error('Error removing seed:', error);
    }
  }

  private resetForm() {
    this.name = '';
    this.familyIndex = this.DEFAULT_FAMILY_INDEX;
    this.sowingDay = 1;
    this.sowingMonth = 1;
    this.transplantingDay = 1;
    this.transplantingMonth = 1;
    this.daysBeforeHarvest = this.DEFAULT_DAYS_BEFORE_HARVEST;
    this.enableTransplanting = false;
  }
}
