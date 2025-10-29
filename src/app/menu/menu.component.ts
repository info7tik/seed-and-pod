import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, TranslocoDirective, LanguageSwitcher],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class Menu {
  items = [
    {
      title: 'menu.inventory.title',
      subtitle: 'menu.inventory.subtitle',
      image: '/assets/menu/book.png',
      route: '/inventory'
    },
    {
      title: 'menu.stock.title',
      subtitle: 'menu.stock.subtitle',
      image: '/assets/menu/list.png',
      route: '/stock'
    },
    {
      title: 'menu.garden.title',
      subtitle: 'menu.garden.subtitle',
      image: '/assets/menu/open-file.png',
      route: '/garden'
    },
    {
      title: 'menu.cultivation.title',
      subtitle: 'menu.cultivation.subtitle',
      image: '/assets/menu/android-logo.png',
      route: '/cultivation'
    },
    {
      title: 'menu.basket.title',
      subtitle: 'menu.basket.subtitle',
      image: '/assets/menu/corkscrew.png',
      route: '/basket'
    }
  ];

  constructor() { }
}