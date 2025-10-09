import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-header-menu',
  imports: [RouterLink, TranslocoDirective],
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.scss'
})
export class HeaderMenu {
  @Input({ required: true }) titleKey: string = "";
}
