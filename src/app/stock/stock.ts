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
  selectedSeedToAdd = signal<SeedId>(0);

  constructor(private seedService: SeedService) { }

  ngOnInit(): void {
    this.availableSeeds.set(this.seedService.getAvailableSeeds());
    this.stockSeeds.set(this.seedService.getStockSeeds());
  }


  get selectedSeedsCount() {
    return this.stockSeeds().filter(s => s.selected).length;
  }

  get availableSeedsNotInStock() {
    const stockSeedIds = this.stockSeeds().map(s => s.id);
    return this.availableSeeds().filter(seed => !stockSeedIds.includes(seed.id));
  }

  addSeedToStock() {
    const seedId = this.selectedSeedToAdd();
    if (!seedId) return;

    const availableSeed = this.availableSeeds().find(s => s.id === seedId);
    if (availableSeed) {
      const existingSeed = this.stockSeeds().find(s => s.id === seedId);
      // Only add if the seed doesn't already exist in stock
      if (!existingSeed) {
        this.stockSeeds.update(seeds => [...seeds, { ...availableSeed }]);
      }
    }
    this.selectedSeedToAdd.set('');
  }

  toggleSeedSelection(seedId: string) {
    this.stockSeeds.update(seeds =>
      seeds.map(seed =>
        seed.id === seedId ? { ...seed, selected: !seed.selected } : seed
      )
    );
  }

  removeSelectedSeeds() {
    this.stockSeeds.update(seeds =>
      seeds.filter(seed => !seed.selected)
    );
  }

  markSelectedAsExhausted() {
    this.stockSeeds.update(seeds =>
      seeds.map(seed =>
        seed.selected ? { ...seed, exhausted: !seed.exhausted, selected: false } : seed
      )
    );
  }
}
