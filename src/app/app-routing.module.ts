import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './login/authguard';
import { LoginGuard } from './login/loginguard';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { JournalComponent } from './journal/journal.component';
import { CharacterComponent } from './character/character.component';
import { CampaignComponent } from './campaign/campaign.component';
import { CreateCharacterComponent } from './dmaster/create-character/create-character.component';
import { DungeonMasterComponent } from './dmaster/dmaster.component';
import { ManageUsersComponent } from './dmaster/manage-users/manage-users.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
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
        path: 'character',
        component: CharacterComponent
      },
      {
        path: 'campaign',
        component: CampaignComponent
      },
      {
        path: 'dmaster',
        component: DungeonMasterComponent
      },
      {
        path: 'dmaster/character',
        component: CreateCharacterComponent
      },
      {
        path: 'dmaster/users',
        component: ManageUsersComponent
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
