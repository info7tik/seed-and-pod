import { Injectable } from '@angular/core';
import { VegetableFamily } from '../type/vegetable-family';
import { Month } from '../type/month.type';

@Injectable({
  providedIn: 'root'
})
export class GlobalServiceService {
  readonly vegetableFamilies: VegetableFamily[] = [
    { id: 1, key: 'vegetableFamilies.Solanaceae' },
    { id: 2, key: 'vegetableFamilies.Brassicaceae' },
    { id: 3, key: 'vegetableFamilies.Cucurbitaceae' },
    { id: 4, key: 'vegetableFamilies.Fabaceae' },
    { id: 5, key: 'vegetableFamilies.Asteraceae' },
    { id: 6, key: 'vegetableFamilies.Apiaceae' },
    { id: 7, key: 'vegetableFamilies.Alliaceae' },
    { id: 8, key: 'vegetableFamilies.Chenopodiaceae' },
    { id: 9, key: 'vegetableFamilies.Poaceae' },
    { id: 10, key: 'vegetableFamilies.Rosaceae' },
    { id: 11, key: 'vegetableFamilies.Other' }
  ];
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
}
