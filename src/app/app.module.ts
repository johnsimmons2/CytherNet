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
import {
  MatChipsModule
} from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
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
import { CharactersComponent } from './characters/characters.component';
import { CampaignComponent } from './campaign/campaign.component';
import { CreateCharacterComponent } from './dmaster/create-character/create-character.component';
import { DiceComponent } from './shared/dice-component/dice.component';
import { SpellSlotComponent } from './shared/spell-slot/spell-slot.component';
import { StatsFormComponent } from './shared/stats-form-component/stats-form.component';
import { DungeonMasterComponent } from './dmaster/dmaster.component';
import { HeaderButtonComponent } from './shared/toolbar/header-button/header-button.component';
import { HealthComponent } from './shared/health-component/health.component';
import { SubtleModalComponent } from './shared/subtle-modal/subtle-modal.component';
import { ModalComponent } from './shared/subtle-modal/modal/modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCommonModule } from '@angular/material/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ManageUsersComponent } from './dmaster/manage-users/manage-users.component';
import { ConfirmationModal } from './shared/confirmation-modal/confirmation-modal.component';
import { ManageCharactersComponent } from './dmaster/manage-characters/manage-characters.component';
import { CharacterTableComponent } from './shared/character-table/character-table.component';
import { RegisterComponent } from './login/register/register.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ToolbarComponent } from './shared/toolbar/toolbar.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ProfileComponent,
    JournalComponent,
    CharactersComponent,
    CreateCharacterComponent,
    CampaignComponent,
    DiceComponent,
    SpellSlotComponent,
    StatsFormComponent,
    DungeonMasterComponent,
    ToolbarComponent,
    HealthComponent,
    SubtleModalComponent,
    ModalComponent,
    ManageUsersComponent,
    ConfirmationModal,
    ManageCharactersComponent,
    CharacterTableComponent,
    RegisterComponent,
    HeaderButtonComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    AppRoutingModule,
    MatTableModule,
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
    MatDialogModule,
    FlexLayoutModule,
  ],
  providers: [HttpClient, MatIconRegistry],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
