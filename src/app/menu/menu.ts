import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoService, TranslocoDirective } from '@jsverse/transloco';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, TranslocoDirective, LanguageSwitcher],
  templateUrl: './menu.html',
  styleUrls: ['./menu.scss']
})
export class Menu {
  items = [
    {
      title: 'menu.basket.title',
      subtitle: 'menu.basket.subtitle',
      image: '/assets/menu/basket.png',
      route: '/basket'
    },
    {
      title: 'menu.cultivation.title',
      subtitle: 'menu.cultivation.subtitle',
      image: '/assets/menu/cultivation.png',
      route: '/cultivation'
    },
    {
      title: 'menu.garden.title',
      subtitle: 'menu.garden.subtitle',
      image: '/assets/menu/garden.png',
      route: '/garden'
    },
    {
      title: 'menu.stock.title',
      subtitle: 'menu.stock.subtitle',
      image: '/assets/menu/stock.png',
      route: '/stock'
    }
  ];

  constructor(private transloco: TranslocoService) { }
}