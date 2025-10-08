import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-basket',
  imports: [RouterLink, TranslocoDirective],
  templateUrl: './basket.html',
  styleUrl: './basket.scss'
})
export class Basket {

}
