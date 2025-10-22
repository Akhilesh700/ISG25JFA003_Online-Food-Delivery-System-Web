import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';
import { routes } from './app.routes';
import { provideState, provideStore } from '@ngrx/store';
import { cartReducer } from './state/cart/cart.reducer';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { addTokenInterceptor } from './core/interceptors/add-token-interceptor';
import { localStorageSync } from './state/metaReducer';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';

export function playerFactory() {
  return player;
}

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
    },
    {
      metaReducers: [localStorageSync]
    }
  ),
    provideState({name: 'cart', reducer: cartReducer}),
    provideHttpClient(
      withInterceptors([addTokenInterceptor]),
      withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    provideLottieOptions({
      player: playerFactory
    })
  ]
};
