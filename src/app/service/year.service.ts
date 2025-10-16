import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import ClockService from './clock.service';

@Injectable({
  providedIn: 'root'
})
export class YearService {
  public readonly YEAR_KEY = 'selected-year';

  constructor(private clockService: ClockService, private storageService: StorageService) { }

  getSelectedYear(): number | null {
    return this.storageService.getItem(this.YEAR_KEY, this.clockService.now().getFullYear());
  }

  saveSelectedYear(year: number): void {
    this.storageService.setItem(this.YEAR_KEY, year);
  }
}
