import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { Character } from "../../model/character";
import { IonAccordion, IonAccordionGroup, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonItem, IonLabel, IonText, IonToolbar } from "@ionic/angular/standalone";
import { CharacterService } from "../../services/character.service";
import { ClassService } from "../../services/class.service";
import { RaceService } from "../../services/race.service";
import { Class, Subclass } from "../../model/class";
import { Race } from "../../model/race";
import { combineLatest, tap } from "rxjs";
import { Statsheet } from "../../model/statsheet";
import { addIcons } from "ionicons";
import { helpCircleOutline } from "ionicons/icons";
import { Campaign } from "../../model/campaign";
import { CampaignService } from "../../services/campaign.service";
import { CommonModule } from "@angular/common";
import { ToastService } from "../../services/toast.service";
import { ParsingService } from "../../services/parsing.service";


@Component({
  selector: 'app-campaign-card',
  templateUrl: './campaigncard.component.html',
  standalone: true,
  imports: [
    CommonModule,
    IonCard,
    IonAccordion,
    IonAccordionGroup,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonButtons,
    IonButton,
    IonToolbar,
    IonIcon,
    IonText,
    IonItem,
    IonLabel
  ]
})
export class CampaignCardComponent implements OnInit {
  //TODO: Clean up and don't use any here.
  @Input() userId!: number;
  @Input() campaign: Campaign | undefined = undefined;

  constructor(private campaignService: CampaignService,
              private toastService: ToastService,
              private parser: ParsingService,
              private classService: ClassService,
              private raceService: RaceService,
              private changeDetectionRef: ChangeDetectorRef) {
    addIcons({ helpCircleOutline });
  }

  ngOnInit(): void {

  }

  public innerHtmlForDescription(text: string) {
    return this.parser.parseMarkdown(text);
  }

  public notImplemented(): void {
    this.toastService.showUnimplemented();
  }

}
