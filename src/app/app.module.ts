import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NgZone  } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './profile/profile.component';
import { JournalComponent } from './journal/journal.component';
import { CharactersComponent } from './characters/characters.component';
import { CampaignComponent } from './campaign/campaign.component';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './login/register/register.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from './shared/shared.module';
import { AppMaterialsModule } from './app-materials.module';
import { DmasterModule } from './dmaster/dmaster.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpInterceptorImplementation } from './shared/http-interceptor/http-interceptor';
import { SpinnerService } from './shared/loading-spinner/spinner.service';
import { AboutComponent } from './about/about.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ProfileComponent,
    JournalComponent,
    CharactersComponent,
    CampaignComponent,
    RegisterComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    AppRoutingModule,

    // Only import ONCE
    HttpClientModule,

    // Other modules
    AppMaterialsModule,
    SharedModule,
    DmasterModule
  ],
  providers: [
    HttpClient,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorImplementation,
      multi: true,
      deps: [SpinnerService, MatSnackBar, NgZone]
    },
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }