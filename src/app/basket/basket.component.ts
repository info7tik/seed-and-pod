import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HeaderMenu } from "../header-menu/header-menu.component";
import { BasketService } from '../service/basket.service';
import { Harvest } from '../type/harvest.type';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-basket',
  imports: [HeaderMenu, RouterLink, DatePipe, TranslocoPipe, FormsModule],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss'
})
export class Basket implements OnInit {
  harvests: Harvest[] = [];
  showAggregated: boolean = false;

  get aggregatedHarvests(): { seedId: string; seedName: string; totalWeightGrams: number; count: number }[] {
    const map = new Map<string, { seedId: string; seedName: string; totalWeightGrams: number; count: number }>();
    for (const h of this.harvests) {
      const key = h.seedId;
      const existing = map.get(key);
      if (existing) {
        existing.totalWeightGrams += h.weightGrams;
        existing.count += 1;
      } else {
        map.set(key, { seedId: h.seedId, seedName: h.seedName, totalWeightGrams: h.weightGrams, count: 1 });
      }
    }
    return Array.from(map.values()).sort((a, b) => a.seedName.localeCompare(b.seedName));
  }

  constructor(private basketService: BasketService) { }

  ngOnInit(): void {
    this.loadHarvests();
  }

  loadHarvests(): void {
    this.harvests = this.basketService.getHarvests();
  }

  removeHarvest(harvest: Harvest): void {
    try {
      this.basketService.removeHarvest(harvest);
      this.loadHarvests();
    } catch (error) {
      console.error('Error removing harvest:', error);
    }
  }

  formatWeight(weightGrams: number): string {
    if (weightGrams >= 1000) {
      return `${(weightGrams / 1000).toFixed(1)} kg`;
    }
    return `${weightGrams} g`;
  }
}
