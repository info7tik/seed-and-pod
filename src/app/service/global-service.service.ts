import { Injectable } from '@angular/core';
import { Month } from '../type/month.type';
import { Family } from '../type/vegetable-group.type';

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

  readonly allVegetableFamilies: Family[] = [
    { name: "alliaceae", color: "#2f4f4f" },//examples: onion, garlic, leek, shallot
    { name: "amaranthaceae", color: "#ff8c00" },//examples: spinach, beetroot, chard 
    { name: "apiaceae", color: "#7f0000" },//examples: carrot, celery, chervil, fennel, parsnip, parsley (also called Umbelliferae)
    { name: "asteraceae", color: "#008000" },//examples: artichoke, endives, lettuce
    { name: "brassicaceae", color: "#00008b" },//examples: cabbages, watercress, turnips, radishes
    { name: "caprifoliaceae", color: "#800000" },//examples: corn salad, valerian
    { name: "cucurbitaceae", color: "#ffff00" },//examples: cucumber, squash, pumpkin, melon, zucchini 
    { name: "fabaceae", color: "#00ff00" }, //examples: beans, lentils, peas (also called Papilionaceae)
    { name: "liliaceae", color: "#00ffff" },//examples: garlic, chives, shallot, onions, leeks
    { name: "lamiaceae", color: "#ff00ff" },//examples: basil, mint, rosemary, thyme, oregano
    { name: "poaceae", color: "#1e90ff" },//examples: corn, rice, wheat, barley, oats, rye
    { name: "polygonaceae", color: "#800080" },//examples: rhubarb, sorrel, nettle
    { name: "rosaceae", color: "#ffdead" },//examples: strawberries, cherries, raspberries, blackberries, pears, apples
    { name: "solanaceae", color: "#ff69b4" },//examples: eggplant, tomato, potato, pepper
  ];

  findVegetableFamily(name: string): Family {
    const family = this.allVegetableFamilies.find(family => family.name === name);
    if (!family) {
      throw new Error(`Vegetable family with name ${name} not found`);
    }
    return family;
  }
}
