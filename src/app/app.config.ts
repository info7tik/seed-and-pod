import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTransloco } from '@jsverse/transloco';
import { provideTranslocoLocale } from '@jsverse/transloco-locale';

import { routes } from './app.routes';
import config from './language-switcher/transloco-global-config';
import { TranslocoHttpLoader } from './language-switcher/transloco-http-loader';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: config.langs,
        defaultLang: config.defaultLang,
        fallbackLang: config.defaultLang,
        reRenderOnLangChange: true,
        prodMode: false
      },
      loader: TranslocoHttpLoader
    }),
    provideTranslocoLocale({
      langToLocaleMapping: {
        en: 'en-US',
        fr: 'fr-FR'
      }
    })
  ]
};
