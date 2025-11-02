import { ApplicationConfig, importProvidersFrom, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './core/auth.interceptor';
import { HttpBackend, provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DateFnsConfigurationService } from 'ngx-date-fns';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { es } from 'date-fns/locale';
import { provideScReCaptchaSettings } from '@semantic-components/re-captcha';
import { environment } from '../environments/environment';
import localeEsExtra from '@angular/common/locales/extra/es';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
// Registra el locale español
registerLocaleData(localeEs, 'es',localeEsExtra);

// Configura date-fns en español
const datefnConfig = new DateFnsConfigurationService();
datefnConfig.setLocale(es);

export function HttpLoaderFactory(_httpBackend: HttpBackend) {
  return new MultiTranslateHttpLoader(_httpBackend, [
    '/assets/i18n/',
    // '/assets/i18n/zn4-confirm-password/',
    // '/assets/i18n/zn4-anonymization/',
    '/assets/i18n/zn4-core-forms/',
    '/assets/i18n/zn4-core-browser-2/',
    '/assets/i18n/zn4-core-dms/',
    '/assets/i18n/zn4-core-multiple-upload/',
    '/assets/i18n/zn4-core-table/',
  ]);
}

export const appConfig: ApplicationConfig = {
  providers: [
   /*  MessageService, */
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    provideAnimations(),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    importProvidersFrom(TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpBackend],
      },
      
  }),
NgxEchartsModule.forRoot({ echarts }) ),
      { provide: DateFnsConfigurationService, useValue: datefnConfig },
    // Configuración adicional para el locale
    { provide: LOCALE_ID, useValue: 'es' }, 
     { provide: 'TIMEZONE', useValue: 'America/Lima' },
  { provide: DateFnsConfigurationService, useValue: datefnConfig },
   provideScReCaptchaSettings({
      v2SiteKey: environment.siteKey, // Replace with your actual site key
      languageCode: 'es',
      v3SiteKey: 'environmentDefault.siteKey',
    }),
  ],
};

