import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HeaderMenu } from '../header-menu/header-menu.component';
import { SeedService } from '../service/seed.service';

@Component({
  selector: 'app-new-seed',
  imports: [FormsModule, RouterLink, HeaderMenu],
  templateUrl: './new-seed.component.html',
  styleUrl: './new-seed.component.scss'
})
export class NewSeed {
  private readonly DEFAULT_DAYS_BEFORE_HARVEST = 30;
  name: string = '';
  family: string = '';
  sowingDay: number = 1;
  sowingMonth: number = 1;
  transplantingDay: number = 1;
  transplantingMonth: number = 1;
  daysBeforeHarvest: number = this.DEFAULT_DAYS_BEFORE_HARVEST;
  enableTransplanting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  readonly vegetableFamilies = [
    'Solanaceae (Tomato, Pepper, Eggplant)',
    'Brassicaceae (Cabbage, Broccoli, Cauliflower)',
    'Cucurbitaceae (Cucumber, Squash, Melon)',
    'Fabaceae (Beans, Peas)',
    'Asteraceae (Lettuce, Sunflower)',
    'Apiaceae (Carrot, Parsley, Celery)',
    'Alliaceae (Onion, Garlic, Leek)',
    'Chenopodiaceae (Spinach, Beet, Chard)',
    'Poaceae (Corn, Rice)',
    'Rosaceae (Strawberry)',
    'Other'
  ];

  readonly months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  readonly daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  constructor(private seedService: SeedService) { }

  addSeed() {
    this.errorMessage = null;
    this.successMessage = null;

    const trimmedName = this.name.trim();
    const trimmedFamily = this.family.trim();

    if (!trimmedName || !trimmedFamily) {
      this.errorMessage = 'Name and family are required';
      return;
    }

    try {
      this.seedService.addInventorySeed({
        name: trimmedName,
        family: trimmedFamily,
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
    this.family = '';
    this.sowingDay = 1;
    this.sowingMonth = 1;
    this.transplantingDay = 1;
    this.transplantingMonth = 1;
    this.daysBeforeHarvest = this.DEFAULT_DAYS_BEFORE_HARVEST;
    this.enableTransplanting = false;
  }
}
