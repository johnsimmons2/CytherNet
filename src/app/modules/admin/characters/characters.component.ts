import { CommonModule } from "@angular/common";
import { Component, ViewChild, TemplateRef, AfterViewInit } from "@angular/core";
import { IonButton, IonSelectOption, IonCard, IonLabel, IonCardContent, IonCol, IonContent, IonGrid, IonInput, IonItem, IonRow, IonSelect, IonList, IonIcon, IonModal, IonCardHeader, IonCardTitle, IonCardSubtitle, IonText } from "@ionic/angular/standalone";
import { Role, UserDto } from "src/app/common/model/user";
import { UserService } from "src/app/common/services/user.service";
import { TableComponent } from "src/app/common/components/table/table.component";
import { TableActon } from "src/app/common/components/table/table.actions";
import { filter, flatMap, from, map, mergeMap, of, tap, toArray } from "rxjs";
import { ApiResult } from "src/app/common/model/apiresult";
import { TableValueChangeEvent } from "src/app/common/components/table/tablevaluechanges.event";
import { TableColumn } from "src/app/common/components/table/table.column";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ToastService } from "src/app/common/services/toast.service";
import { Character, CharacterDto } from "src/app/common/model/character";
import { CharacterService } from "src/app/common/services/character.service";
import { ClassService } from "src/app/common/services/class.service";
import { Class, Subclass } from "src/app/common/model/class";
import { RaceService } from "src/app/common/services/race.service";
import { Race } from "src/app/common/model/race";
import { addCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { RouterModule } from "@angular/router";


@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
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
    TableComponent,
    IonIcon
  ]
})
export class CharactersComponent {

  @ViewChild(TableComponent) table!: TableComponent;

  newCharacterForm = new FormGroup({

  });

  characters: CharacterDto[] = [];
  classes: Class[] = [];
  subclasses: Subclass[] = [];
  races: Race[] = [];
  cols: TableColumn[] = [
    {
      name: 'id'
    },
    {
      name: 'name'
    },
    {
      name: 'classId',
      alias: 'class',
      getValue: (row: CharacterDto) => this.classes.filter(c => c.id === row.classId)[0]?.name,
    },
    {
      name: 'subclassId',
      alias: 'subclass',
      getValue: (row: CharacterDto) => this.subclasses.filter(c => c.id === row.subclassId)[0]?.name,
    },
    {
      name: 'raceId',
      alias: 'race',
      getValue: (row: CharacterDto) => this.races.filter(c => c.id === row.raceId)[0]?.name,
    }
  ];

  constructor(private characterService: CharacterService,
              private classService: ClassService,
              private raceService: RaceService,
              private toastService: ToastService) {
                addIcons({addCircleOutline});
  }

  confirmRoleChange(row: UserDto) {
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
