import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HeaderMenu } from '../header-menu/header-menu';
import { SeedService } from '../service/seed.service';

@Component({
  selector: 'app-new-seed',
  imports: [FormsModule, RouterLink, HeaderMenu],
  templateUrl: './new-seed.html',
  styleUrl: './new-seed.scss'
})
export class NewSeed {
  name = '';
  variety = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private seedService: SeedService) { }

  addSeed() {
    this.errorMessage = null;
    this.successMessage = null;

    const trimmedName = this.name.trim();
    const trimmedVariety = this.variety.trim();
    if (!trimmedName || !trimmedVariety) {
      this.errorMessage = 'Name and variety are required';
      return;
    }

    try {
      this.seedService.addInventorySeed({ name: trimmedName, variety: trimmedVariety });
      this.successMessage = 'Seed added successfully';
      this.name = '';
      this.variety = '';
    } catch (e: any) {
      this.errorMessage = e?.message ?? 'Failed to add seed';
    }
  }
}
