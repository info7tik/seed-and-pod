import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { ClockService } from './clock.service';
import { range } from './library';

@Injectable({
  providedIn: 'root'
})
export class YearService {
  public readonly YEAR_KEY = 'selected-year';
  public readonly YEARS_KEY = 'years';

  constructor(private clockService: ClockService, private storageService: StorageService) { }


  getYears(): number[] {
    const data = this.storageService.getData();
    const possibleYears: number[] = Object.keys(data.years).map(year => parseInt(year));
    const currentYear = this.clockService.now().getFullYear();
    possibleYears.push(currentYear - 1);
    possibleYears.push(currentYear);
    possibleYears.push(currentYear + 1);
    return range(Math.min(...possibleYears), Math.max(...possibleYears));
  }

  getSelectedYear(): number {
    const savedYear = this.storageService.getData().selectedYear;
    if (savedYear === 0) {
      return this.clockService.now().getFullYear();
    }
    // Force the type to be a number
    return parseInt(savedYear as any);
  }

  saveSelectedYear(year: number): void {
    const data = this.storageService.getData();
    data.selectedYear = year;
    this.storageService.setData(data);
  }

  getItemByYear<T>(key: string, defaultValue: T): T {
    const data = this.storageService.getData();
    const yearData = data.years[this.getSelectedYear()];
    if (yearData === undefined) {
      return defaultValue;
    }
    return yearData[key] || defaultValue;
  }

  setItemByYear<T>(key: string, value: T): void {
    const data = this.storageService.getData();
    if (!(this.getSelectedYear() in data.years)) {
      data.years[this.getSelectedYear()] = {};
    }
    data.years[this.getSelectedYear()][key] = value;
    this.storageService.setData(data);
  }
}
