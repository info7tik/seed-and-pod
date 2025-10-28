import { Routes } from '@angular/router';
import { Basket } from './basket/basket.component';
import { Cultivation } from './cultivation/cultivation.component';
import { Garden } from './garden/garden.component';
import { Stock } from './stock/stock.component';
import { Menu } from './menu/menu.component';
import { NewHarvestComponent } from './new-harvest/new-harvest.component';
import { InventoryComponent } from './inventory/inventory.component';

export const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  { path: 'menu', component: Menu },
  { path: 'inventory', component: InventoryComponent },
  { path: 'basket', component: Basket },
  { path: 'cultivation', component: Cultivation },
  { path: 'garden', component: Garden },
  { path: 'stock', component: Stock },
  { path: 'new-harvest', component: NewHarvestComponent }
];
