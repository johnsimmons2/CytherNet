import { computed, DestroyRef, Injectable, OnDestroy, signal } from "@angular/core";
import { environment } from "src/environments/environment";
import { WebsocketService } from "../websocket.service";
import { BehaviorSubject, Subject, takeUntil, tap } from "rxjs";
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { LobbyOccupant, LobbyPlayer, LobbyRoom, ServerMessage, WSAction } from "src/app/modules/live/tracker-lobby/trackerlobby";

@Injectable({
    providedIn: 'root'
})
export class TrackerLobbyService {

    public currentUser = signal<LobbyPlayer | null>(null);
    public currentUser$ = toObservable(this.currentUser);

    public rooms = signal<LobbyRoom[]>([]);
    public rooms$ = toObservable(this.rooms);

    public currentRoom = signal<LobbyRoom | null>(null);
    public currentRoom$ = toObservable(this.currentRoom);

    private _currentRoomId = signal<string | null>(localStorage.getItem('lobby-room-id'));
    public currentRoomId$ = toObservable(this._currentRoomId);

    private _currentRoomName = signal<string | null>(localStorage.getItem('lobby-room-name'));
    public currentRoomName$ = toObservable(this._currentRoomName);

    private _ownerId = signal<string | null>(null);
    public ownerId$ = toObservable(this._ownerId);

    private _connected = signal<boolean>(false);
    public connected$ = toObservable(this._connected);

    private end$ = new Subject<void>();

    public totalOnline = computed(() => {
        const rooms = this.rooms();
        const ids = new Set<number>();
        rooms.forEach(r => r.players.forEach(o => ids.add(o.player.id)));
        return ids.size;
    });

    public totalInRooms = computed(() => {
        return this.rooms().reduce((x, r) => x + r.players.length, 0);
    });

    onInfo(event: any) {
        console.warn(event);
    }

    constructor(
        private wss: WebsocketService, 
        private destroyRef: DestroyRef) 
    {
        this.destroyRef.onDestroy(() => this.shutdown());

        wss.messages$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((msg: ServerMessage) => {
                this._connected.set(true);
                console.info(msg);
                if (msg.action) {
                    switch(msg.action) {
                        case WSAction.LIST_ROOMS:
                            this.updateRooms(msg.rooms ?? []);
                            break;
                        default:
                            console.error('NotImplemented', msg.action);
                    }
                }
            }
        );
    }

    updateUser(player: LobbyPlayer) {
        this.send('UPDATE_USER', player);
        this.currentUser.set(player);
    }

    updateRooms(rooms: LobbyRoom[], broadcast: boolean = false) {
        this.rooms.set(rooms);
        const uid = this._ownerId();
        const mine = rooms.find(r => r.players.some(o => o.player.id.toString() == uid));
        console.log(`${mine} ${this.rooms} ${rooms} for some reason... ${uid}`)
        this.setCurrentRoom(mine);
        if (broadcast) {
            this.send(WSAction.UPDATE_ROOM, {});
        }
    }

    setCurrentUserId(uid: string) {
        this._ownerId.set(uid);
    }

    setCurrentRoom(room: LobbyRoom | undefined) {
        this._currentRoomId.set(room?.room_id ?? '');
        this._currentRoomName.set(room?.name ?? '');
        this.currentRoom.set(room ?? null);

        if (room) {
            for (let p of room.players as LobbyOccupant[]) {
                if (p.player.id === +this._ownerId()!) {
                    this.currentUser.set(p.player);
                    break;
                }
            }
            localStorage.setItem('lobby-room-id', room?.room_id ?? '');
            localStorage.setItem('lobby-room-name', room?.name ?? '');
        } else {
            console.error("Could not find room");
            localStorage.removeItem('lobby-room-id');
            localStorage.removeItem('lobby-room-name');
        }
    }

    private shutdown(): void {
        this.end$.next();
        this.end$.complete();
        this.wss.shutdown();
    }

    send(action: string, data: any) {
        if (this._connected()) {
            this.wss.send(action, data);
        }
    }

    disconnect() {
        if (this._connected()) {
            this.wss.send('disconnect');
        }
    }

}
