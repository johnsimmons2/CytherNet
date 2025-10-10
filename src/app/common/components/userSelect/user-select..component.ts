import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { IonButton, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonRow, } from "@ionic/angular/standalone";
import { UserService } from "../../services/user.service";
import { User } from "../../model/user";

@Component({
    selector: 'app-user-select',
    templateUrl: './user-select.component.html',
    standalone: true,
    imports: [
        CommonModule,
        IonList,
        IonItem,
        IonLabel,
        IonButton,
        IonIcon,
        IonGrid,
        IonRow,
        IonCol,
    ],
    styles: [`
        .scroll-col {
            max-height: 200px;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: var(--ion-item-background) transparent;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserSelectComponent implements OnInit {

    @Input() selectedUsers: User[] = [];
    @Input() showDone: boolean = false;
    @Output() selectedUsersChange: EventEmitter<User[]> = new EventEmitter<User[]>();
    @Output() addedUser: EventEmitter<User> = new EventEmitter<User>();
    @Output() removedUser: EventEmitter<User> = new EventEmitter<User>();
    @Output() doneClicked: EventEmitter<void> = new EventEmitter<void>();

    allUsers: User[] = [];
    shareList: User[] = [];
    controlInitialized: boolean = false;

    constructor(private userService: UserService, private cdk: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        // setTimeout(() => {
        //     this.userService.getUsers().subscribe((users: User[]) => {
        //         users.forEach(user => {
        //             user.roles?.forEach(role => {
        //                 if (role.roleName === 'Player' || role.level >= 1) {
        //                     if (!this.allUsers.some(u => u.id === user.id)) {
        //                         this.allUsers.push(user);
        //                         if (!this.selectedUsers.some(u => u.id === user.id)) {
        //                             this.shareList.push(user);
        //                         }
        //                     }
        //                 }
        //             });
        //         });
        //         this.controlInitialized = true;
        //         this.cdk.markForCheck();
        //     });
        // }, 300);
    }

    doneClickEvent(): void {
        this.doneClicked.emit();
    }

    addUser(user: User) {
        if (!this.selectedUsers.some(u => u.id === user.id)) {
            this.selectedUsers.push(user);
            this.shareList = this.shareList.filter(u => u !== user);
            this.selectedUsersChange.emit(this.selectedUsers);
            this.addedUser.emit(user);
            this.cdk.markForCheck();
        }
    }

    removeUser(user: User) {
        this.selectedUsers = this.selectedUsers.filter(u => u !== user);
        this.selectedUsersChange.emit(this.selectedUsers);
        this.removedUser.emit(user);
        if (this.allUsers.some(u => u.id === user.id)) {
            this.shareList.push(user);
            this.cdk.markForCheck();
        }
    }

}
