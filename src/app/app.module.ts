import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { HttpClient } from '@angular/common/http';
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
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    FlexLayoutModule,
    AppRoutingModule,

    // Other modules
    AppMaterialsModule,
    SharedModule,
    DmasterModule
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }