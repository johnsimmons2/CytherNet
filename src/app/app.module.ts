import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import {
  MatChipsModule
} from '@angular/material/chips';
import { MatBadgeModule} from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import {
  MatExpansionModule
} from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  MatFormFieldModule
} from '@angular/material/form-field';
import { ProfileComponent } from './profile/profile.component';
import { JournalComponent } from './journal/journal.component';
import { CharacterComponent } from './character/character.component';
import { CampaignComponent } from './campaign/campaign.component';
import { CreateCharacterComponent } from './create/create-character/create-character.component';
import { DiceComponent } from './shared/dice-component/dice.component';
import { SpellSlotComponent } from './shared/spell-slot/spell-slot.component';
import { StatsFormComponent } from './shared/stats-form-component/stats-form.component';
import { CreateComponent } from './create/create.component';
import { HeaderButtonComponent } from './shared/header-button/header-button.component';
import { HealthComponent } from './shared/health-component/health.component';
import { SubtleModalComponent } from './shared/subtle-modal/subtle-modal.component';
import { ModalComponent } from './shared/subtle-modal/modal/modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCommonModule } from '@angular/material/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ProfileComponent,
    JournalComponent,
    CharacterComponent,
    CreateCharacterComponent,
    CampaignComponent,
    DiceComponent,
    SpellSlotComponent,
    StatsFormComponent,
    CreateComponent,
    HeaderButtonComponent,
    HealthComponent,
    SubtleModalComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCommonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatProgressBarModule,
    MatSelectModule,
    MatChipsModule,
    MatBadgeModule,
    MatExpansionModule,
    MatGridListModule,
    MatDialogModule
  ],
  providers: [HttpClient, MatIconRegistry],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
