import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HeaderMenu } from '../header-menu/header-menu.component';
import { SeedService } from '../service/seed.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { VegetableFamily } from '../type/vegetable-family';
import { GlobalServiceService } from '../service/global-service.service';

@Component({
  selector: 'app-new-seed',
  imports: [FormsModule, RouterLink, HeaderMenu, TranslocoPipe],
  templateUrl: './new-seed.component.html',
  styleUrl: './new-seed.component.scss'
})
export class NewSeed {
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


  constructor(private seedService: SeedService, private globalService: GlobalServiceService) { }

  get months() {
    return this.globalService.months;
  }

  get vegetableFamilies() {
    return this.globalService.vegetableFamilies;
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
      this.seedService.addInventorySeed({
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
    } catch (e: any) {
      this.errorMessage = e?.message ?? 'Failed to add seed';
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
