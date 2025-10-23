import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";
import { IonItem, IonLabel, IonList, IonInput, IonCard, IonText, IonButton, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonTitle, IonReorder, IonReorderGroup, IonGrid, IonCol, IonRow, ItemReorderEventDetail, IonIcon, IonModal, IonToolbar, IonButtons, IonHeader } from "@ionic/angular/standalone";
import { UserService } from "src/app/common/services/user.service";
import { TrackerLobbyService } from "src/app/common/services/websocket/trackerlobby/trackerlobby.service";
import { LobbyRoom, WSAction } from "./trackerlobby";
import { FormsModule } from "@angular/forms";
import { PlayerTrackerComponent } from "./player-tracker/player-tracker.component";

@Component({
    selector: 'not-found',
    templateUrl: './trackerlobby.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        IonCard,
        IonContent,
        IonText,
        IonList,
        IonCardHeader,
        IonItem,
        IonCardTitle,
        IonCardSubtitle,
        IonButton,
        IonCardContent,
        IonReorder,
        IonIcon,
        IonGrid,
        IonInput,
        IonToolbar,
        IonButtons,
        IonTitle,
        IonHeader,
        IonLabel,
        IonCol,
        IonRow,
        IonModal,
        IonReorderGroup,
        CommonModule,
        PlayerTrackerComponent,
        FormsModule
    ]
})
export class TrackerLobbyComponent implements OnInit {
    @ViewChild(IonModal) settingsModal!: IonModal;

    inputRoomName: string = '';
    inputMaxHealth: number = 40;
    inputMaxPlayers?: number = 0;

    rooms$ = this.lobbyService.rooms$;
    connected$ = this.lobbyService.connected$;

    trackRoom = (_: number, r: LobbyRoom) => r.room_id;
    trackPlayer = (_: number, o: LobbyRoom['players'][number]) => o.player.id;

    colorInput: string = '#000000';
    imgInput: string = '';

    get currentRoom() {
        return this.lobbyService.currentRoom();
    }

    get rooms() {
        return this.lobbyService.rooms();
    }

    get totalOnline() {
        return this.lobbyService.totalOnline();
    }

    get totalInRooms() {
        return this.lobbyService.totalInRooms();
    }

    get username() {
        return this.userService.currentUsername;
    }

    get user_id(): string {
        return this.userService.currentUserId ?? '';
    }

    constructor(
        private lobbyService: TrackerLobbyService, 
        private userService: UserService
    ) {
    }

    ngOnInit(): void {
        this.lobbyService.setCurrentUserId(this.user_id ?? '');

        this.lobbyService.currentUser$.subscribe((usr) => {
            this.colorInput = usr?.color ?? '#000000';
            this.imgInput = usr?.image ?? '';
            localStorage.setItem('lobby-color', this.colorInput);
        });
        // this.lobbyService.currentRoomName$.subscribe((name) => {
        //     this.current_room_name = name ?? '';
        // });
    }

    onWillDismiss(event: any) {
        console.info(event);
    }

    cancel() {

    }

    confirm() {
        this.settingsModal.dismiss(null, 'confirm');
        localStorage.setItem('lobby-color', this.colorInput);
        const player = this.lobbyService.currentUser();
        if (player) {
            player.color = this.colorInput;
            player.image = this.imgInput;
            this.lobbyService.updateUser(player);
        }
    }

    inRoom(room: LobbyRoom | undefined): boolean {
        return !!room && room.players.some(o => o.player.id.toString() === this.user_id);
    }

    isOwner(room: LobbyRoom | undefined): boolean {
        return !!room && `${room.owner_id}` === this.user_id;
    }

    createRoom() {
        this.lobbyService.send(WSAction.CREATE_ROOM, {
            "name": this.inputRoomName
        });
    }

    joinRoom(room_id: any) {
        this.lobbyService.send(WSAction.JOIN_ROOM, {
            "room_id": room_id
        });
    }

    leaveRoom(room: any) {
        this.lobbyService.send(WSAction.LEAVE_ROOM, {
            "room_id": this.currentRoom?.room_id
        });
        this.lobbyService.setCurrentRoom(undefined);
    }

    closeRoom() {

    }

    startLobby() {

    }

    handleDragDrop(event: CustomEvent<ItemReorderEventDetail>) {
        console.info('drag drop event', event);
        if (!this.currentRoom) {
            return;
        }

        if (event && event.detail.from !== undefined && event.detail.to !== undefined) {
            this.dropReorder(event.detail.from, event.detail.to, this.currentRoom)
        }

        event.detail.complete(this.currentRoom.players);
        this.lobbyService.updateRooms(this.rooms, true);
    }

    dropReorder(from: number, to: number, room: LobbyRoom) {
        if (!this.isOwner(room)) {
            return;
        }
        const ordered = [...room.players];
        [room.players[from], room.players[to]] = [room.players[to], room.players[from]]; 
        
        // send room update to server
    }

}
