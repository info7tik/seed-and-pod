import { Component, signal } from '@angular/core';
import { HeaderMenu } from '../header-menu/header-menu';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
export class Stock {
  // Mock data for available seeds to add
  availableSeeds = signal<Seed[]>([
    { id: '1', name: 'Tomato', variety: 'Cherry', exhausted: false, selected: false },
    { id: '2', name: 'Lettuce', variety: 'Romaine', exhausted: false, selected: false },
    { id: '3', name: 'Carrot', variety: 'Nantes', exhausted: false, selected: false },
    { id: '4', name: 'Pepper', variety: 'Bell', exhausted: false, selected: false }
  ]);

  // Mock data for seeds currently in stock
  stockSeeds = signal<Seed[]>([
    { id: '1', name: 'Tomato', variety: 'Cherry', exhausted: false, selected: false },
    { id: '2', name: 'Lettuce', variety: 'Romaine', exhausted: false, selected: false },
    { id: '3', name: 'Carrot', variety: 'Nantes', exhausted: false, selected: false }
  ]);

  selectedSeedToAdd = signal<string>('');

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
