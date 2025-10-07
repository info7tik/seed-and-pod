import { Routes } from '@angular/router';
import { Basket } from './basket/basket';
import { Cultivation } from './cultivation/cultivation';
import { Garden } from './garden/garden';
import { Stock } from './stock/stock';

export const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  { path: 'basket', component: Basket },
  { path: 'cultivation', component: Cultivation },
  { path: 'garden', component: Garden },
  { path: 'stock', component: Stock }
];
