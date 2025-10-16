import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { cartReducer } from './state/cart/cart.reducer';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { addTokenInterceptor } from './core/interceptors/add-token-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration : 'top'
      })
    ),
    provideStore({
      cart: cartReducer
    })
    provideRouter(routes),
    provideHttpClient(withInterceptors([addTokenInterceptor]))
  ]
};
