import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderMenu } from '../header-menu/header-menu.component';
import { SeedService } from '../service/seed.service';
import { StockSeedWithDetails } from '../type/stock-seed.type';
import { Bed } from '../type/bed.type';
import { BedService } from '../service/bed.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { TaskService } from '../service/task.service';
import { YearService } from '../service/year.service';
import { YearSelectorComponent } from '../year-selector/year-selector.component';

@Component({
  selector: 'app-garden',
  imports: [HeaderMenu, YearSelectorComponent, FormsModule, TranslocoPipe],
  templateUrl: './garden.component.html',
  styleUrl: './garden.component.scss'
})
export class Garden implements OnInit {
  reloadDataCallback = () => this.reloadData();
  numberOfBeds: number = 1;
  stockSeeds: StockSeedWithDetails[] = [];
  beds: Bed[] = [];

  constructor(
    private seedService: SeedService,
    private bedService: BedService,
    private taskService: TaskService,
    private yearService: YearService) { }

  ngOnInit(): void {
    this.reloadData();
  }

  reloadData(): void {
    this.beds = this.bedService.getBeds();
    this.numberOfBeds = this.beds.length;
    this.stockSeeds = this.seedService.getStockSeeds();
  }

  updateNumberOfBeds(): void {
    if (this.numberOfBeds < 1) {
      throw new Error('Number of beds must be at least 1');
    }
    if (this.hasAssignedSeeds) {
      throw new Error('Cannot modify the number of beds while seeds are assigned to beds.');
    }
    this.beds = this.bedService.createBeds(this.numberOfBeds);
  }

  get unassignedSeeds(): StockSeedWithDetails[] {
    return this.stockSeeds.filter(seed => !this.isSeedAssignedToBed(seed.id));
  }

  private isSeedAssignedToBed(seedId: string): boolean {
    return this.beds.some(bed => bed.seeds.includes(seedId));
  }

  get hasAssignedSeeds(): boolean {
    return this.beds.some(bed => bed.seeds.length > 0);
  }

  assignSeedToBed(seedId: string, event: Event): void {
    const target = event.target as HTMLSelectElement;
    const bedId = target.value;

    if (bedId) {
      this.bedService.removeSeedFromBeds(seedId);
      if (bedId === 'unassigned') {
        this.taskService.removeTasksBySeed(seedId);
      } else {
        this.bedService.assignSeedToBed(bedId, seedId);
        const seedTasks = this.taskService.computeTasks(this.getSeedById(seedId), this.yearService.getSelectedYear());
        seedTasks.forEach(task => this.taskService.updateTask(task));
      }
      this.beds = this.bedService.getBeds();
    }
  }

  getSeedById(seedId: string): StockSeedWithDetails {
    const seed = this.stockSeeds.find(seed => seed.id === seedId);
    if (!seed) {
      throw new Error(`seed with id ${seedId} does not exist`);
    }
    return seed;
  }
}
