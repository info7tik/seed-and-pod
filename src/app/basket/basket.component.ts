import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HeaderMenu } from "../header-menu/header-menu.component";
import { HarvestService } from '../service/harvest.service';
import { AggregatedHarvest, Harvest } from '../type/harvest.type';
import { TranslocoPipe } from '@jsverse/transloco';
import { YearSelectorComponent } from '../year-selector/year-selector.component';

@Component({
  selector: 'app-basket',
  imports: [HeaderMenu, RouterLink, DatePipe, TranslocoPipe, FormsModule, YearSelectorComponent],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss'
})
export class Basket implements OnInit {
  reloadDataCallback = () => this.reloadData();
  harvests: Harvest[] = [];
  showAggregated: boolean = false;

  get aggregatedHarvests(): AggregatedHarvest[] {
    return this.basketService.aggregateHarvests(this.harvests);
  }

  constructor(private basketService: HarvestService) { }

  ngOnInit(): void {
    this.reloadData();
  }

  reloadData(): void {
    this.harvests = this.basketService.getHarvests();
  }

  removeHarvest(harvest: Harvest): void {
    try {
      this.basketService.removeHarvest(harvest);
      this.reloadData();
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
