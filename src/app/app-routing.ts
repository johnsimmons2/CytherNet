import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { AuthGuard } from './common/guards/authguard';
import { LoginGuard } from './common/guards/loginguard';
import { HomeComponent } from './modules/home/home.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { RegisterComponent } from './modules/login/register/register.component';
import { AboutComponent } from './modules/about/about.component';
import { NotFoundComponent } from './modules/notfound/notfound.component';
import { ResetPasswordComponent } from './modules/login/reset-password/reset-password.component';


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
    // children: [
    //   {
    //     path: 'profile',
    //     component: ProfileComponent,
    //   },
    //   {
    //     path: 'journal',
    //     component: JournalComponent
    //   },
    //   {
    //     path: 'characters',
    //     component: CharactersComponent
    //   },
    //   {
    //     path: 'campaign',
    //     component: CampaignComponent
    //   },
    // ]
  },
  {
    path: '**',
    pathMatch: 'full',
    component: NotFoundComponent
  }
];
