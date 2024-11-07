import { enableProdMode, importProvidersFrom, NgZone } from '@angular/core';
import { environment } from './environments/environment';
import { routes } from './app/app-routing';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideIonicAngular, IonicRouteStrategy } from '@ionic/angular/standalone';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpInterceptorImplementation } from './app/shared/http-interceptor/http-interceptor';
import { SpinnerService } from './app/shared/loading-spinner/spinner.service';
import { provideServiceWorker } from '@angular/service-worker';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorImplementation,
      multi: true,
      deps: [SpinnerService, NgZone]
    },
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    provideIonicAngular(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: true,
      registrationStrategy: 'registerWhenStable:30000'
    }),
    provideRouter(routes),
    importProvidersFrom(HttpClientModule)
  ],
})
