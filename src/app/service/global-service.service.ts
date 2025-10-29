import { Injectable } from '@angular/core';
import { Month } from '../type/month.type';
import { VegetableGroup } from '../type/vegetable-group.type';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  readonly months: Month[] = [
    { id: 1, key: 'months.January' },
    { id: 2, key: 'months.February' },
    { id: 3, key: 'months.March' },
    { id: 4, key: 'months.April' },
    { id: 5, key: 'months.May' },
    { id: 6, key: 'months.June' },
    { id: 7, key: 'months.July' },
    { id: 8, key: 'months.August' },
    { id: 9, key: 'months.September' },
    { id: 10, key: 'months.October' },
    { id: 11, key: 'months.November' },
    { id: 12, key: 'months.December' }
  ];

  readonly allVegetableGroups: VegetableGroup[] = [
    { name: "A", color: "#b0d0d3" },
    { name: "B", color: "#c08497" },
    { name: "C", color: "#f7af9d" },
    { name: "D", color: "#f7e3af" }
  ];

  findVegetableGroup(name: string): VegetableGroup {
    const group = this.allVegetableGroups.find(group => group.name === name);
    if (!group) {
      throw new Error(`Vegetable group with name ${name} not found`);
    }
    return group;
  }
}
