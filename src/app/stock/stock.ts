import { Component, OnInit, signal } from '@angular/core';
import { HeaderMenu } from '../header-menu/header-menu';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SeedService } from '../seed-service';
import { AvailableSeed } from '../type/available-seed.type';
import { StockSeed } from '../type/stock-seed.type';
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
  stockSeeds = signal<StockSeed[]>([]);
  selectedSeedToAdd = signal<SeedId[]>([]);

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

  addSeedToStock() {
  }

  get selectedSeedsCount() {
    return 0;
  }

  get availableSeedsNotInStock(): AvailableSeed[] {
    return this.availableSeeds();
  }


  toggleSeedSelection(seedId: string) {
  }

  removeSelectedSeeds() {
  }

  markSelectedAsExhausted() {
  }
}
