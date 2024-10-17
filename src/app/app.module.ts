import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NgZone, isDevMode  } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ProfileComponent } from './profile/profile.component';
import { JournalComponent } from './journal/journal.component';
import { CharactersComponent } from './characters/characters.component';
import { CampaignComponent } from './campaign/campaign.component';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './login/register/register.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from './shared/shared.module';
import { HttpInterceptorImplementation } from './shared/http-interceptor/http-interceptor';
import { SpinnerService } from './shared/loading-spinner/spinner.service';
import { AboutComponent } from './about/about.component';
import { NotFoundComponent } from './notfound/notfound.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IonicModule } from '@ionic/angular';


@NgModule({ declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        ResetPasswordComponent,
        ProfileComponent,
        // JournalComponent,
        CharactersComponent,
        // CampaignComponent,
        RegisterComponent,
        AboutComponent,
        NotFoundComponent
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        FlexLayoutModule,
        AppRoutingModule,
        // Other modules
        //SharedModule,
        // DmasterModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: true,
          // Register the ServiceWorker as soon as the application is stable
          // or after 30 seconds (whichever comes first).
          registrationStrategy: 'registerWhenStable:30000'
        }),
        IonicModule.forRoot({})], providers: [
        HttpClient,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpInterceptorImplementation,
            multi: true,
            deps: [SpinnerService, NgZone]
        },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule { }
