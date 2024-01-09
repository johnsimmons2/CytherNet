import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './login/authguard';
import { LoginGuard } from './login/loginguard';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { JournalComponent } from './journal/journal.component';
import { CharactersComponent } from './characters/characters.component';
import { CampaignComponent } from './campaign/campaign.component';
import { CreateCharacterComponent } from './dmaster/create-character/create-character.component';
import { DungeonMasterComponent } from './dmaster/dmaster.component';
import { ManageUsersComponent } from './dmaster/manage-users/manage-users.component';
import { ManageCharactersComponent } from './dmaster/manage-characters/manage-characters.component';
import { RegisterComponent } from './login/register/register.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'journal',
        component: JournalComponent
      },
      {
        path: 'characters',
        component: CharactersComponent
      },
      {
        path: 'campaign',
        component: CampaignComponent
      },
      // DUNGEON MASTER TABS
      {
        path: 'dmaster',
        component: DungeonMasterComponent,
      },
      {
        path: 'dmaster/characters/create',
        component: CreateCharacterComponent
      },
      {
        path: 'dmaster/users',
        component: ManageUsersComponent
      },
      {
        path: 'dmaster/users/:id/characters',
        component: ManageCharactersComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
