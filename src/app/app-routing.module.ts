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
import { CreateCharacterComponent } from './dmaster/create/create-character/create-character.component';
import { DungeonMasterComponent } from './dmaster/dmaster.component';
import { ManageUsersComponent } from './dmaster/manage/manage-users/manage-users.component';
import { ManageCharactersComponent } from './dmaster/manage/manage-characters/manage-characters.component';
import { RegisterComponent } from './login/register/register.component';
import { ManageClassesComponent } from './dmaster/manage/manage-classes/manage-classes.component';
import { ManageRacesComponent } from './dmaster/manage/manage-races/manage-races.component';
import { ManageSpellsComponent } from './dmaster/manage/manage-spells/manage-spells.component';
import { CreateRaceComponent } from './dmaster/create/create-race/create-race.component';
import { ManageFeatComponent } from './dmaster/manage/manage-feat/manage-feat.component';
import { CreateFeatComponent } from './dmaster/create/create-feat/create-feat.component';
import { AboutComponent } from './about/about.component';
import { CreateClassComponent } from './dmaster/create/create-class/create-class.component';
import { CreateSpellComponent } from './dmaster/create/create-spell/create-spell.component';
import { NotFoundComponent } from './notfound/notfound.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { CharacterFormComponent } from './dmaster/character/character-form/character-form.component';
import { CharacterViewComponent } from './dmaster/character/character-view/character-view.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'about',
    component: AboutComponent
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
        component: CharacterFormComponent
      },
      {
        path: 'dmaster/characters/:id',
        component: CharacterFormComponent
      },
      {
        path: 'dmaster/characters',
        component: CharacterViewComponent
      },
      {
        path: 'dmaster/users',
        component: ManageUsersComponent
      },
      {
        path: 'dmaster/races',
        component: ManageRacesComponent
      },
      {
        path: 'dmaster/races/create',
        component: CreateRaceComponent
      },
      {
        path: 'dmaster/classes',
        component: ManageClassesComponent
      },
      {
        path: 'dmaster/spells',
        component: ManageSpellsComponent
      },
      {
        path: 'dmaster/spells/create',
        component: CreateSpellComponent
      },
      {
        path: 'dmaster/spells/create/:id',
        component: CreateSpellComponent
      },
      {
        path: 'dmaster/feats',
        component: ManageFeatComponent
      },
      {
        path: 'dmaster/feats/create',
        component: CreateFeatComponent,
      },
      {
        path: 'dmaster/classes',
        component: ManageClassesComponent
      },
      {
        path: 'dmaster/classes/create',
        component: CreateClassComponent
      }
    ]
  },
  {
    path: '**',
    pathMatch: 'full',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
