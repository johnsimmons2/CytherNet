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
    path: 'reset-password',
    loadComponent: () => import('./modules/login/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
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
        path: 'journal',
        canActivate: [ RoleGuard ],
        data: { roles: ['player', 'admin'] },
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () => import('./modules/journal/journal.component').then(m => m.JournalComponent)
          },
          {
            path: ':id/edit',
            loadComponent: () => import('./modules/journal/note-page/note-page.component').then(m => m.NotePageComponent)
          },
          {
            path: ':id/view',
            loadComponent: () => import('./modules/journal/note-page/note-page.component').then(m => m.NotePageComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./modules/journal/note-page/note-page.component').then(m => m.NotePageComponent)
          }
        ]
      },
      {
        path: 'shop',
        loadComponent: () => import('./modules/shop/shop.component').then(m => m.ShopComponent)
      },
      {
        path: 'characters',
        canActivate: [ RoleGuard ],
        data: { roles: ['player', 'admin'] },
        children: [
          {
            path: '',
            loadComponent: () => import('./modules/characters/characters.component').then(m => m.CharactersComponent)
          }
        ]
      },
      {
        path: 'admin',
        canActivate: [ RoleGuard ],
        data: { roles: ['admin'] },
        children: [
          {
            path: '',
            loadComponent: () => import('./modules/admin/admin.component').then(m => m.AdminComponent),
          },
          {
            path: 'users',
            loadComponent: () => import('./modules/admin/users/users.component').then(m => m.UsersComponent),
          },
          {
            path: 'campaigns',
            loadComponent: () => import('./modules/admin/campaigns/campaigns.component').then(m => m.CampaignsComponent),
          },
          {
            path: 'spells',
            loadComponent: () => import('./modules/admin/spells/spells.component').then(m => m.SpellsComponent),
          },
          {
            path: 'items',
            loadComponent: () => import('./modules/admin/items/items.component').then(m => m.ItemsComponent),
          },
          {
            path: 'races',
            loadComponent: () => import('./modules/admin/races/races.component').then(m => m.RacesComponent),
          },
          {
            path: 'classes',
            loadComponent: () => import('./modules/admin/classes/classes.component').then(m => m.ClassesComponent),
          },
          {
            path: 'items',
            loadComponent: () => import('./modules/admin/items/items.component').then(m => m.ItemsComponent),
          },
          {
            path: 'notes',
            loadComponent: () => import('./modules/admin/notes/notes.component').then(m => m.NotesComponent),
          },
          {
            path: 'characters',
            children: [
              {
                path: '',
                loadComponent: () => import('./modules/admin/characters/characters.component').then(m => m.CharactersComponent),
              },
              {
                path: ':id',
                loadComponent: () => import('./modules/admin/characters/character-detail/characters-detail.component').then(m => m.CharactersDetailComponent)
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '**',
    pathMatch: 'full',
    component: NotFoundComponent
  }
];
