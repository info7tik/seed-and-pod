import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LanguageSwitcher } from './language-switcher/language-switcher';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LanguageSwitcher],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('seed-and-pod');
}
