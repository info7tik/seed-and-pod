import { Component } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  template: `
    <div class="language-switcher">
      <button (click)="switchLanguage('en')" [class.active]="currentLang === 'en'">English</button>
      <button (click)="switchLanguage('fr')" [class.active]="currentLang === 'fr'">Français</button>
    </div>
  `,
  styles: [`
    .language-switcher {
      display: flex;
      gap: 0.5rem;
      padding: 1rem;
    }
    
    button {
      padding: 0.5rem 1rem;
      border: 1px solid #ccc;
      background: white;
      cursor: pointer;
      border-radius: 4px;
    }
    
    button.active {
      background: #007bff;
      color: white;
    }
  `]
})
export class LanguageSwitcher {
  currentLang = 'en';

  constructor(private transloco: TranslocoService) {
    this.currentLang = this.transloco.getActiveLang();
  }

  switchLanguage(lang: string) {
    this.transloco.setActiveLang(lang);
    this.currentLang = lang;
  }
}
