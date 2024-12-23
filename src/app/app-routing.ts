import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { AuthGuard } from './common/guards/authguard';
import { LoginGuard } from './common/guards/loginguard';
import { HomeComponent } from './modules/home/home.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { RegisterComponent } from './modules/login/register/register.component';
import { AboutComponent } from './modules/about/about.component';
import { NotFoundComponent } from './modules/notfound/notfound.component';
import { LandingComponent } from './modules/landing/landing.component';
import { AdminComponent } from './modules/admin/admin.component';
import { RoleGuard } from './common/guards/roleguard';


export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./modules/login/login.component').then(m => m.LoginComponent),
    canActivate: [LoginGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./modules/login/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./modules/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: '',
    loadComponent: () => import('./modules/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
      },
      {
        path: 'profile',
        loadComponent: () => import('./modules/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'home',
        loadComponent: () => import('./modules/landing/landing.component').then(m => m.LandingComponent)
      },
      {
        path: 'admin',
        loadComponent: () => import('./modules/admin/admin.component').then(m => m.AdminComponent),
        canActivate: [ RoleGuard ],
        data: { roles: ['admin'] }
      }
      // {
      //   path: 'journal',
      //   component: JournalComponent
      // },
      // {
      //   path: 'characters',
      //   component: CharactersComponent
      // },
      // {
      //   path: 'campaign',
      //   component: CampaignComponent
      // },
    ]
  },
  {
    path: '**',
    pathMatch: 'full',
    component: NotFoundComponent
  }
];
