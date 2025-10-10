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
  sowingDate: string = '';
  transplantingDate: string = '';
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

  constructor(private seedService: SeedService) { }

  addSeed() {
    this.errorMessage = null;
    this.successMessage = null;

    const trimmedName = this.name.trim();
    const trimmedFamily = this.family.trim();
    const trimmedSowingDate = this.sowingDate.trim();
    const trimmedTransplantingDate = this.enableTransplanting ? this.transplantingDate.trim() : '';
    const trimmedDaysBeforeHarvest = this.daysBeforeHarvest.toString();

    if (!trimmedName || !trimmedFamily || !trimmedSowingDate || !trimmedDaysBeforeHarvest) {
      this.errorMessage = 'Name, family, sowing date, and days before harvest are required';
      return;
    }

    if (this.enableTransplanting && !trimmedTransplantingDate) {
      this.errorMessage = 'Transplanting date is required when transplanting is enabled';
      return;
    }

    try {
      this.seedService.addInventorySeed({
        name: trimmedName,
        variety: trimmedFamily
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
    this.sowingDate = '';
    this.transplantingDate = '';
    this.daysBeforeHarvest = this.DEFAULT_DAYS_BEFORE_HARVEST;
    this.enableTransplanting = false;
  }
}
