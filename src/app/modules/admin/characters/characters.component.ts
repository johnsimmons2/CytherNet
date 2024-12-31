import { CommonModule } from "@angular/common";
import { Component, ViewChild, TemplateRef, AfterViewInit } from "@angular/core";
import { IonButton, IonSelectOption, IonCard, IonLabel, IonCardContent, IonCol, IonContent, IonGrid, IonInput, IonItem, IonRow, IonSelect, IonList, IonIcon, IonModal, IonCardHeader, IonCardTitle, IonCardSubtitle, IonText } from "@ionic/angular/standalone";
import { Role, User } from "src/app/common/model/user";
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
  @ViewChild('attachToUser') attachModal!: IonModal;

  newCharacterForm = new FormGroup({

  });

  characters: any[] = [];
  contextIndex: number = 0;
  changedUserIdForCharacter: number = -1;
  classes: Class[] = [];
  users: User[] = [];
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
      getValue: (row: Character) => this.classes.filter(c => c.id === row.classId)[0]?.name,
    },
    {
      name: 'subclassId',
      alias: 'subclass',
      getValue: (row: Character) => this.subclasses.filter(c => c.id === row.subclassId)[0]?.name,
    },
    {
      name: 'raceId',
      alias: 'race',
      getValue: (row: Character) => this.races.filter(c => c.id === row.raceId)[0]?.name,
    },
    {
      name: 'user',
      getValue: (row: Character) => {
        return this.users.filter(u => u.id === row.userId)[0]?.username ?? 'None';
      },
    }
  ];

  constructor(private characterService: CharacterService,
              private classService: ClassService,
              private raceService: RaceService,
              private toastService: ToastService,
              private userService: UserService) {
                addIcons({addCircleOutline});
  }

  get contextUsername() {
    return this.users[this.contextIndex]?.username;
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
    console.log(o1);
    return o1.id === o2.id;
  }

  getTableActions(): TableActon[] {
    return [
      {
        label: 'Delete',
        disabled: (index) => false,
        color: 'secondary',
        action: (index) => this.deleteCharacter(index)
      },
      {
        label: 'Edit',
        disabled: (index) => false,
        color: 'primary',
        action: (index) => () => {}
      },
      {
        label: 'Attach',
        disabled: (index) => false,
        color: 'primary',
        action: (index) => this.openAttachModal(index)
      }
    ];
  }

  ngOnInit() {
    this.characterService.getAllCharacters().pipe(
      tap((res: ApiResult) => {
        if (res.success) {
          Object.keys(res.data).forEach(key => {
            console.log(res.data);
            this.characters.push({
              userId: res.data[key].userId,
              ...res.data[key].character
            });
          });
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

    this.userService.getUsers().pipe(
      tap(users => {
        this.users = users;
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

  openAttachModal(index: number) {
    this.contextIndex = index;
    this.attachModal.present();
  }

  saveAttachModal() {
    this.attachModal.dismiss('saved').then(() => {
      this.characterService.updateUserCharacter(this.changedUserIdForCharacter, this.characters[this.contextIndex].id).pipe(
        tap((res: ApiResult) => {
          if (res.success) {
            this.toastService.show({
              message: 'Character attached',
              type: 'success'
            });
          }
        })
      ).subscribe();
    });
  }

  cancelAttachModal() {
    this.attachModal.dismiss();
  }

  saveChanges(event: TableValueChangeEvent) {

  }
}
