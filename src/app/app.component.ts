import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from './common/services/user.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IonContent, IonHeader, IonMenu, IonToolbar, IonTitle, IonList, IonItemDivider, IonItem, IonAccordionGroup, IonAccordion, IonLabel, IonApp, IonRouterOutlet, IonFooter } from '@ionic/angular/standalone';
import { HeaderComponent} from './common/components/header/header.component';
import { FooterComponent } from './common/components/footer/footer.component';
import { environment } from 'src/environments/environment';
import { PlatformService } from './common/services/platform.service';
import { ApiService } from './common/services/api.service';

/**
 * Todo:
 *  - clean up a lot
 *  - unknown pages routing
 *  - registering should log you in
 *  - Service worker caching for offline use as a PWA
 *  - Error handling***
 *  - profile info editor****
 *  - character editor****
 *  - context explorer*
 *      - see the name of the thing in question and where to find more information about it
 *  - item / magic explorer****
 *      - see what magic items, spells, and cantrips are known by the entire party, that they choose to make public.
 *  - live session
 *      - see the map / fog of war
 *      - see the characters / health / stats / estimates / monsters*
 *      - see the chat and notes
 *      - allow players to move themselves according to speed, allow DM to move anything
 *      - measurement tools*
 *      - see the calendar / time*
 *      - fog of war
 * - DM Console***
 *      - See every player's details and whole party at a glance abilities / perks / feats / etc.
 *      - buttons to control health, inflict curses / buffs / debuffs / etc.
 *      - buttons to control time, weather, etc.
 *      - monster and npc character creation menus
 * - DM visual effects
 *      - pause the game, add fog, effects, etc.
 * - Player intent system
 *      - DM can initiate passive attribute checks accurately*
 *      - player can say "I want to do X" and the DM can approve it or not
 *      - player can click an item or action to queue up approval of intent.*
 *      - DM can approve or deny intent, simple intents (attack monster in front of me) are auto-approved and calculated.*
 */

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    ServiceWorkerModule,
    RouterModule,
    IonApp,
    IonRouterOutlet,
    IonHeader,
    IonContent,
    HeaderComponent,
    IonFooter,
    FooterComponent
    //LoadingSpinnerComponent
  ],
  providers: [Router]
})
export class AppComponent {
  title = 'Cyther.online';

  // Update on significant changes
  cytherVersion: string = '';
  opened: boolean = false;
  browserVersion: string = '';
  browser: string = '';
  ipAddress: string = '-.-.-.-';
  operatingSystem: string = '';
  apiVersion: string = '';
  platform: string = '';

  get showSpinner() {
    //return this.spinnerService.spinnerVisible;
    return false;
  }

  get isAdmin() {
    return this.userService.hasRoleLevel(0);
  }

  get username() {
    return localStorage.getItem('username');
  }

  get selectedCampaign() {
    const campaign = localStorage.getItem('campaign');
    if (campaign) {
      return campaign;
    }
    return '';
  }

  get toolbarTitle(): string {
    const campaign = localStorage.getItem('campaign');
    if (campaign) {
      return campaign;
    }

    return this.title;
  }

  constructor(
    private router: Router,
    private userService: UserService,
    private platformService: PlatformService,
    private apiService: ApiService) {
      this.cytherVersion = environment.version;
      this.browser = this.platformService.browser;
      this.browserVersion = this.platformService.browserVersion;
      this.operatingSystem = this.platformService.operatingSystem;
      this.platformService.getIpAddress().subscribe((ip) => {
        this.ipAddress = ip;
      });
      this.apiService.healthCheck().subscribe((res) => {
        this.apiVersion = res.data;
      });
      this.platform = this.platformService.platform;
  }


  toggleNav(value: boolean) {
    this.opened = value;
  }

  routeTo(route: string) {
    this.router.navigate([route]).then(() => {
        this.opened = false;
    });
  }
}
