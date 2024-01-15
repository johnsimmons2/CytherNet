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
import { DungeonMasterComponent } from './dmaster/dmaster.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCommonModule } from '@angular/material/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ManageUsersComponent } from './dmaster/manage-users/manage-users.component';
import { ManageCharactersComponent } from './dmaster/manage-characters/manage-characters.component';
import { RegisterComponent } from './login/register/register.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from './shared/shared.module';
import { AppMaterialsModule } from './app-materials.module';


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
    DungeonMasterComponent,
    ManageUsersComponent,
    ManageCharactersComponent,
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
    SharedModule
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }