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
    { title: 'Basket', subtitle: 'Manage your harvest basket', image: 'assets/menu/basket.png', route: '/basket' },
    { title: 'Cultivation', subtitle: 'Plan and track cultivation', image: 'assets/menu/cultivation.png', route: '/cultivation' },
    { title: 'Garden', subtitle: 'Organize your garden layout', image: 'assets/menu/garden.png', route: '/garden' },
    { title: 'Stock', subtitle: 'View and update stock levels', image: 'assets/menu/stock.png', route: '/stock' }
  ];
}