import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, TemplateRef, Type, ViewChild } from "@angular/core";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonItem, IonLabel, IonList, IonPopover, IonText } from "@ionic/angular/standalone";
import { Character } from "../../model/character";
import { Campaign } from "../../model/campaign";
import { Feat } from "../../model/feat";
import { Note } from "../../model/note";
import { Race } from "../../model/race";
import { User } from "../../model/user";
import { CampaignService } from "../../services/campaign.service";
import { CharacterService } from "../../services/character.service";
import { RaceService } from "../../services/race.service";
import { UserService } from "../../services/user.service";
import { catchError, finalize, of, retry, Subject, takeUntil, tap } from "rxjs";
import { ApiResult } from "../../model/apiresult";

@Component({
  selector: 'app-note-text',
  templateUrl: './notetext.component.html',
  standalone: true,
  imports: [
    CommonModule,
    IonText,
    IonPopover,
    IonContent,
    IonButton,
    IonLabel,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonList,
    IonItem,
    IonCardHeader
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
  ion-popover {
    &::part(content) {
      min-width: 530px;
    }
  }
  `
})
export class NotetextComponent implements OnInit {

  private UNRESOLVED_VALUE: string = "[ UNKNOWN ]";
  private unsubscribe$ = new Subject<void>();

  @Input() rawText: string = '';

  @ViewChild(IonPopover) popover!: IonPopover;

  @ViewChild('userContent') userContent!: TemplateRef<any>;
  @ViewChild('characterContent') characterContent!: TemplateRef<any>;


  resolvedType: 'USERS' | 'CHARACTERS' | 'RACES' | null = null;
  resolvedQuery: string = '';
  resolvedValue: any = {};
  isResolved: boolean = false;
  isUnresolvable: boolean = false;
  serviceFn: (...args: any) => any = () => {};
  showPopover: boolean = false;

  private validQueryClasses: {
    type: 'USERS' | 'CHARACTERS' | 'RACES' | null,
    service: any,
    serviceFn: (...args: any) => any,
    serviceFnId: (...args: any) => any,
    searchables?: { name: string, type: 'string' | 'number' }[]
  }[] = [
    {
      type: 'USERS',
      service: this.userService,
      serviceFn: (id) => this.userService.getUserByUsername(id),
      serviceFnId: (id) => this.userService.getUser(id),
      searchables: [
        {
          name: 'username',
          type: 'string'
        },
        {
          name: 'id',
          type: 'number'
        }
      ]
    },
    {
      type: 'CHARACTERS',
      service: this.characterService,
      serviceFn: (id) => this.characterService.getCharacterByName(id),
      serviceFnId: (id) => this.characterService.getCharacter(id),
      searchables: [
        {
          name: 'name',
          type: 'string'
        },
        {
          name: 'id',
          type: 'number'
        }
      ]
    },
    {
      type: 'RACES',
      service: this.raceService,
      serviceFn: (id) => this.raceService.getRace.bind(this.raceService),
      serviceFnId: (id) => this.raceService.getRace.bind(this.raceService),
      searchables: [
        {
          name: 'name',
          type: 'string'
        },
        {
          name: 'id',
          type: 'number'
        }
      ]
    }
  ];

  get viewContent(): TemplateRef<any> | null {
    switch (this.resolvedType) {
      case 'USERS':
        return this.userContent;
      case 'CHARACTERS':
        console.log(this.characterContent);
        return this.characterContent;
      default:
        return null;
    }
  }

  constructor(private userService: UserService,
              private characterService: CharacterService,
              private campaignService: CampaignService,
              private raceService: RaceService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.resolveValue();
  }

  showDetails(event: any) {
    this.showPopover = true;
    this.popover.event = event;
  }

  private resolveValue(): void {
    if (this.isResolved || !this.rawText) return; // Ensure resolveValue runs only once
    this.isResolved = true; // Mark as executed immediately

    const [type, id] = this.rawText.split('.');
    if (!type || !id) {
      console.error('Invalid rawText format:', this.rawText);
      return;
    }

    // Dynamically find the correct service and function
    const queryClass = this.validQueryClasses.find((q) => q.type === type);
    if (!queryClass) {
      console.error('Unrecognized type:', type);
      return;
    }
    this.resolvedType = queryClass.type;
    const isStringId = isNaN(+id); // Determine if ID is a string or a number
    const serviceFn = isStringId ? queryClass.serviceFn : queryClass.serviceFnId;

    if (!serviceFn) {
      console.error('No service function found for:', { type, id });
      return;
    }

    // Call the resolved service function
    serviceFn(id).pipe(
      catchError((error) => {
        console.error('Service call failed:', error);
        this.resolvedValue = { searchId: this.UNRESOLVED_VALUE };
        this.resolvedType = null;
        this.isUnresolvable = true;
        return of(null); // Graceful fallback
      }),
      // finalize(() => {
      //   this.unsubscribe$.next();
      //   this.unsubscribe$.complete(); // Ensure no memory leaks
      // }),
      takeUntil(this.unsubscribe$) // Stop subscription when unsubscribed
    )
    .subscribe((result: ApiResult) => {
      if (result.success) {
        console.log(result.data);
        try {
          queryClass.searchables?.forEach((searchable) => {
            if (result.data[searchable.name] === id) {
              this.resolvedValue = {searchId: result.data[searchable.name], ...result.data};
              return;
            }
          });
        } catch (error) {
          console.error('Failed to resolve value, query param invalid?: ', id, error);
          this.resolvedValue = { searchId: this.UNRESOLVED_VALUE };
          this.resolvedType = null;
          this.isUnresolvable = true;
        }
      } else {
        this.resolvedValue = { searchId: this.UNRESOLVED_VALUE };
        this.resolvedType = null;
        this.isUnresolvable = true;
        console.error('Failed to resolve value:', id);
      }
      console.log(this.resolvedValue);
      this.cdr.detectChanges();
    });
  }
}
