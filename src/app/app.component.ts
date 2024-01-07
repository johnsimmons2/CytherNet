import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

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
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Cythernet';
  opened: boolean = false;

  constructor(
    private router: Router,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {
      this.matIconRegistry.addSvgIcon(
        "dice-4",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/dice-4.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "dice-6",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/dice-6.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "dice-8",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/dice-8.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "dice-10",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/dice-10.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "dice-12",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/dice-12.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "dice-20",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/dice-20.svg")
      );
  }

  toggleNav() {
    this.opened = !this.opened;
  }

  routeTo(route: string) {
    this.router.navigate([route]).then(() => {
        this.opened = false;
    });
  }
}
