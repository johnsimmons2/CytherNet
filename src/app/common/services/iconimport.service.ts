import { Injectable } from '@angular/core';
import { addIcons } from 'ionicons';
import * as IonIcons from 'ionicons/icons';
import { checkmarkDoneOutline, chevronUpOutline, add, addOutline, remove, removeOutline, arrowForwardOutline, chevronForwardOutline } from 'ionicons/icons';

@Injectable({
  providedIn: 'root'
})
export class IconImportService {
  private readonly appIcons: any[] = [
    IonIcons.helpCircleOutline,
    IonIcons.warningOutline,
    IonIcons.createOutline,
    IonIcons.chevronDownCircleOutline,
    IonIcons.chevronBack,
    IonIcons.chevronForward,
    IonIcons.chevronUp,
    IonIcons.chevronDown,
    IonIcons.cartOutline,
    IonIcons.trashOutline,
    IonIcons.eyeOutline,
    IonIcons.eyeOffOutline,
    IonIcons.arrowBackCircleOutline,
    IonIcons.shareOutline,
    IonIcons.pricetagOutline,
    IonIcons.globeOutline,
    IonIcons.checkboxOutline,
    IonIcons.closeCircleOutline,
    IonIcons.listCircleOutline,
    IonIcons.refreshOutline,
    IonIcons.addCircleOutline,
    IonIcons.removeCircleOutline,
    IonIcons.arrowForwardCircleOutline,
    IonIcons.playCircleOutline,
    IonIcons.searchCircleOutline,
    IonIcons.homeOutline,
    IonIcons.hammerOutline,
    IonIcons.bookOutline,
    IonIcons.accessibilityOutline,
    IonIcons.peopleOutline,
    IonIcons.pencilOutline,
    IonIcons.trashBinOutline,
    IonIcons.helpCircleOutline,
    IonIcons.cogOutline,
    IonIcons.earOutline,
    IonIcons.diamondOutline,
    IonIcons.keyOutline,
    IonIcons.pawOutline,
    IonIcons.heartOutline,
    IonIcons.heartHalfOutline,
    IonIcons.giftOutline,
    IonIcons.colorFilterOutline,
    IonIcons.diceOutline,
    IonIcons.fishOutline,
    IonIcons.earthOutline,
    IonIcons.flaskOutline,
    IonIcons.ribbonOutline,
    IonIcons.skullOutline,
    IonIcons.checkmarkDoneOutline,
    IonIcons.starOutline,
    IonIcons.searchOutline,
    IonIcons.personOutline,
    IonIcons.folderOpenOutline,
    IonIcons.folderOutline,
    IonIcons.readerOutline,
    IonIcons.flagOutline,
    IonIcons.thumbsDownOutline,
    IonIcons.documentOutline,
  ];

  constructor() {
  }

  loadIcons() {
    this.appIcons.forEach((icon) => {
      const matchedEntry = Object.entries(IonIcons).find(([key, val]) => val === icon);
      if (matchedEntry) {
        const [originalKey] = matchedEntry;
        const dashedKey = this.iconNameWithDash(originalKey);
        try {
          addIcons({ [dashedKey]: icon });
        } catch (e) {
          console.error(`Failed to add icon: ${icon}`);
        }
      } else {
        console.error(`Failed to find icon: ${icon}`);
      }
    });
    // Some icons have the same or too similar of data as other icons, so they have to be added manually.
    addIcons({
      chevronUpOutline,
      checkmarkDoneOutline,
      chevronForwardOutline,
      add,
      addOutline,
      remove,
      removeOutline,
      arrowForwardOutline,
    });
  }

  iconNameWithDash(iconName: string) {
    return iconName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

}
