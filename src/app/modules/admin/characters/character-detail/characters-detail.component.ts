import { CommonModule } from "@angular/common";
import { Component, ViewChild, TemplateRef, AfterViewInit } from "@angular/core";
import { IonButton, IonSelectOption, IonCard, IonLabel, IonCardContent, IonCol, IonContent, IonGrid, IonInput, IonItem, IonRow, IonSelect, IonList, IonIcon, IonModal, IonCardHeader, IonCardTitle, IonCardSubtitle, IonText, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView } from "@ionic/angular/standalone";
import { Role, User } from "src/app/common/model/user";
import { UserService } from "src/app/common/services/user.service";
import { TableComponent } from "src/app/common/components/table/table.component";
import { TableActon } from "src/app/common/components/table/table.actions";
import { filter, flatMap, from, map, mergeMap, of, tap, toArray } from "rxjs";
import { ApiResult } from "src/app/common/model/apiresult";
import { TableValueChangeEvent } from "src/app/common/components/table/tablevaluechanges.event";
import { TableColumn } from "src/app/common/components/table/table.column";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ToastService } from "src/app/common/services/toast.service";
import { Character, CharacterDto } from "src/app/common/model/character";
import { CharacterService } from "src/app/common/services/character.service";
import { ClassService } from "src/app/common/services/class.service";
import { Class, Subclass } from "src/app/common/model/class";
import { RaceService } from "src/app/common/services/race.service";
import { Race } from "src/app/common/model/race";
import { addCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';


@Component({
  selector: 'app-characters-detail',
  templateUrl: './characters-detail.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonGrid,
    IonList,
    IonItem,
    IonText,
    IonSelect,
    IonSelectOption,
    IonLabel,
    IonRow,
    IonCol,
    IonButton,
    IonModal,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonSegmentView,
    TableComponent,
    IonSegment,
    IonSegmentButton,
    IonSegmentContent,
    IonIcon
  ]
})
export class CharactersDetailComponent {

  @ViewChild(IonSegment) segment!: IonSegment;

  newCharacterForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    class: new FormControl('', [Validators.required]),
  });

  currentStep: number = 0;
  characters: CharacterDto[] = [];
  classes: Class[] = [];
  subclasses: Subclass[] = [];
  races: Race[] = [];
  cols: any[] = [
    {
      "name": "basics",
      "label": "Basics",
      "description": "This is the step for name, class, subclass, race, languages, background, eventually starting kit."
    },
    {
      "name": "attributes",
      "label": "Attributes",
      "description": "This is the step for ability scores and modifiers."
    },
    {
      "name": "skills",
      "label": "Skills",
      "description": "This is the step for skills, saving throws, and proficiencies."
    },
    {
      "name": "spells",
      "label": "Spells",
      "descriptions": "This is the step for spells, cantrips, and spell slots."
    },
    {
      "name": "descriptions",
      "label": "Descriptions",
      "descriptions": "This is the step for descriptions and miscellanious information."
    },
    {
      "name": "equipment",
      "label": "Equipment",
      "description": "This is the step for equipment and inventory."
    },
  ];

  get stepSummary() {
    return this.cols[this.currentStep].description;
  }

  constructor(private characterService: CharacterService,
              private classService: ClassService,
              private raceService: RaceService,
              private toastService: ToastService) {
                addIcons({addCircleOutline});
  }

  confirmRoleChange(row: User) {
    // try {
    //   console.log('hi');
    //   this.characterService..updateUserRoles(row.id!, row.roles!).pipe(
    //     tap((res: ApiResult) => {
    //       if (res.success) {
    //         this.toastService.show({
    //           message: res.message ?? 'Roles updated',
    //           type: 'success',
    //         });
    //         this.table.modal.dismiss(null, 'saved');
    //       } else {
    //         this.toastService.show({
    //           message: res.errors?.join(', ') ?? 'An error occurred',
    //           type: 'warning',
    //         });
    //       }
    //     })
    //   ).subscribe();
    // } catch (e) {
    //   console.error(e);
    // }
  }

  compareRoleFn(o1: any, o2: any): boolean {
    return o1.id === o2.id;
  }

  getTableActions(): TableActon[] {
    return [
      {
        label: 'Delete',
        disabled: (index) => false,
        color: 'secondary',
        action: (index) => this.deleteCharacter(index)
      }
    ];
  }

  ngOnInit() {
    this.characterService.getAllCharacters().pipe(
      tap((res: ApiResult) => {
        if (res.success) {
          this.characters = res.data as CharacterDto[];
          console.log(this.characters);
        } else {
          this.toastService.show({
            message: res.message ?? 'Failed to load characters',
            type: 'warning'
          });
        }
      })
    ).subscribe();

    this.classService.classes$.pipe(
      tap(cls => {
        this.classes = cls;
      })
    ).subscribe();

    this.classService.subclasses$.pipe(
      tap(cls => {
        this.subclasses = cls;
      })
    ).subscribe();

    this.raceService.races$.pipe(
      tap(cls => {
        this.races = cls;
      })
    ).subscribe();
  }

  step(stp: number) {
    if (this.currentStep >= stp) {
      return true;
    }
    return false;
  }

  nextStep() {
    this.currentStep++;
    console.log(this.cols[this.currentStep].name.toString());
    this.segment.value = (this.cols[this.currentStep].name.toString());
    this.segment.writeValue(this.cols[this.currentStep].name.toString());
  }

  deleteCharacter(index: number) {
    // const user = this.users[index].id!;
    // console.log(user);
    // this.userService.deleteUser(user).pipe(
    //   tap((res: ApiResult) => {
    //     if (res.success) {
    //       this.users = this.users.filter(u => u.id !== user);
    //       this.toastService.show({
    //         message: 'User deleted',
    //         type: 'success',
    //       })
    //     } else {
    //       this.toastService.show({
    //         message: res.errors?.join(', ') ?? 'An error occurred',
    //         type: 'warning',
    //       });
    //     }
    //   })
    // ).subscribe();
  }

  saveChanges(event: TableValueChangeEvent) {
    // try {
    //   const newValue = event.value;
    //   event.data[event.column] = newValue;
    //   const user: UserDto = event.data;
    //   this.userService.updateUser(user).pipe(
    //     tap((res: ApiResult) => {
    //       if (res.success) {
    //         this.getUsersWithRoles();
    //         this.toastService.show({
    //           message: 'User updated',
    //           type: 'success',
    //         });
    //       } else {
    //         this.toastService.show({
    //           message: res.errors?.join(', ') ?? 'An error occurred',
    //           type: 'warning',
    //         });
    //       }
    //     })
    //   ).subscribe()
    // } catch (e) {
    //   this.toastService.show({
    //     message: 'An exception has ocurred: ' + e,
    //     type: 'warning',
    //   });
    // }
  }
}
