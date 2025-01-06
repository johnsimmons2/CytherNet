import { enableProdMode, importProvidersFrom, NgZone } from '@angular/core';
import { environment } from './environments/environment';
import { routes } from './app/app-routing';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideIonicAngular, IonicRouteStrategy } from '@ionic/angular/standalone';
import { provideRouter, RouteReuseStrategy, withComponentInputBinding } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { HttpInterceptorService } from './app/common/services/http-interceptor.service';
import { LoadingService } from './app/common/services/loading.service';
import { provideServiceWorker } from '@angular/service-worker';
import { UserService } from './app/common/services/user.service';


if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    provideIonicAngular({
      innerHTMLTemplatesEnabled: true
    }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: true,
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/ngsw-worker.js').then(
    (registration) => {
      console.log('Service Worker registered:', registration);
    },
    (error) => {
      console.error('Service Worker registration failed:', error);
    }
  );
} else {
  console.warn('Service Worker not supported in this browser.');
}
