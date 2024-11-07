import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './login/authguard';
import { LoginGuard } from './login/loginguard';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { JournalComponent } from './journal/journal.component';
import { CharactersComponent } from './characters/characters.component';
import { CampaignComponent } from './campaign/campaign.component';
import { RegisterComponent } from './login/register/register.component';
import { AboutComponent } from './about/about.component';
import { NotFoundComponent } from './notfound/notfound.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';


export const routes: Routes = [
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
    ]
  },
  {
    path: '**',
    pathMatch: 'full',
    component: NotFoundComponent
  }
];
