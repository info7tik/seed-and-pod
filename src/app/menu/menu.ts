import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu.html',
  styleUrls: ['./menu.scss']
})
export class Menu {
  items = [
    { title: 'Stock', subtitle: 'View and update stock levels', image: '/menu/stock.png', route: '/stock' },
    { title: 'Garden', subtitle: 'Organize your garden layout', image: '/menu/garden.png', route: '/garden' },
    { title: 'Cultivation', subtitle: 'Plan and track cultivation', image: '/menu/cultivation.png', route: '/cultivation' },
    { title: 'Basket', subtitle: 'Manage your harvest basket', image: '/menu/basket.png', route: '/basket' }
  ];
}