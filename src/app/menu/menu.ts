import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu.html',
  styleUrls: ['./menu.scss']
})
export class Menu {
  constructor(private transloco: TranslocoService) { }

  get items() {
    return [
      {
        title: this.transloco.translate('menu.basket.title'),
        subtitle: this.transloco.translate('menu.basket.subtitle'),
        image: '/assets/menu/basket.png',
        route: '/basket'
      },
      {
        title: this.transloco.translate('menu.cultivation.title'),
        subtitle: this.transloco.translate('menu.cultivation.subtitle'),
        image: '/assets/menu/cultivation.png',
        route: '/cultivation'
      },
      {
        title: this.transloco.translate('menu.garden.title'),
        subtitle: this.transloco.translate('menu.garden.subtitle'),
        image: '/assets/menu/garden.png',
        route: '/garden'
      },
      {
        title: this.transloco.translate('menu.stock.title'),
        subtitle: this.transloco.translate('menu.stock.subtitle'),
        image: '/assets/menu/stock.png',
        route: '/stock'
      }
    ];
  }
}