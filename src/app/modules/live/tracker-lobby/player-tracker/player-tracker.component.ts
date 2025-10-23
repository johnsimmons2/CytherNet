import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, computed, ElementRef, Input } from "@angular/core";
import { GestureController, IonBadge, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonIcon, IonItem, IonLabel, IonList, IonSegment, IonSegmentButton } from "@ionic/angular/standalone";
import { LobbyOccupant, LobbyPlayer } from "../trackerlobby";
import { FormsModule } from "@angular/forms";
import { TrackerLobbyService } from "src/app/common/services/websocket/trackerlobby/trackerlobby.service";
import { encode } from "punycode";

@Component({
    selector: 'player-tracker',
    imports: [
        CommonModule,
        IonCardContent,
        IonCard,
        IonCardHeader,
        IonCardTitle,
        IonCardSubtitle,
        IonButton,
        IonIcon,
        IonList,
        IonItem,
        IonBadge,
        IonLabel,
        IonSegment,
        IonSegmentButton,
        FormsModule,
    ],
    styleUrls: ['./player-tracker.component.scss'],
    templateUrl: `./player-tracker.component.html`,
    standalone: true
})
export class PlayerTrackerComponent {

    @Input() player?: LobbyPlayer;
    commanderMode = false;
    pressedSide: 'left' | 'right' | null = null;
    delta: number = 0;
    private pressTimer: any = null;
    private longPressFired = false;
    private tallyTimer: any = null;
    private readonly TALLY_IDLE_MS = 1400;

    setCommanderMode(on: boolean) { 
        this.commanderMode = on; 
    }

    get img() {
        return encodeURI(this.player?.image ?? '');
    }

    get currentUserId() {
        return +localStorage.getItem('uid')!;
    }

    private playersById = computed(() => {
        const room = this.lobby.currentRoom();
        const m = new Map<number, LobbyPlayer>();
        room?.players?.forEach((p: LobbyOccupant) => m.set(p.player.id, p.player));
        return m;
    });

    commanderList = computed(() => {
        const cd = this.player?.commander_damage ?? {};
        const entries = Object.entries(cd as Record<string, number>);
        const map = this.playersById();
        return entries
        .map(([attackerId, dmg]) => {
            const idNum = Number(attackerId);
            return {
            id: idNum,
            name: map.get(idNum)?.name ?? `Player ${attackerId}`,
            dmg: Number(dmg) || 0
            };
        })
        .filter(e => e.dmg > 0)
        .sort((a, b) => b.dmg - a.dmg);
    });
    cmdDamage: boolean = false;

    constructor(
        private el: ElementRef, 
        private gesture: GestureController, 
        private lobby: TrackerLobbyService,
        private cdr: ChangeDetectorRef
    ) {
        this.gesture.create({
            el: this.el.nativeElement.closest('ion-content'),
            onStart: () => this.onStart(),
            gestureName: 'drag-drop'
        });
    }

    private onStart() {
        console.log("boohang");
    }

    changeHealth(requestedDelta: number): void {
        if (!this.player || requestedDelta === 0)
            return;

        const before = this.player.health;
        const next = before + requestedDelta;
        const actual = next - before;

        // accumulate the delta, restart timer
        this.delta += actual;

        // just update UI instantly; the server will overwrite later
        this.player = { ...this.player, health: next };

        // restart idle countdown; if more presses happen, the timer resets
        this.restartTallyTimer();
        this.cdr.markForCheck();
    }

    toggleCommander(): void {
        if (!this.player) return;
            this.cmdDamage = !this.cmdDamage;
    }

    normalizeHex(hex: string | null | undefined): string {
        if (!hex) {
            return '#ffffff';
        }

        let h = hex.trim();
        if (h[0] !== '#') {
            h = '#' + h;
        }

        if (/^#([a-fA-F0-9]{3})$/.test(h)) {
            h = '#' + h.substring(1).split('').map(c => c + c).join('');
        }

        return /^#([a-fA-F0-9]{6})$/.test(h) ? h : '#ffffff';
    }
    
    onPressCancel() {
        this.pressedSide = null;
        this.longPressFired = false;
        if (this.pressTimer) {
            clearTimeout(this.pressTimer);
            this.pressTimer = null;
        }
    }

    onPressStart(side: 'left' | 'right', ev: PointerEvent) {
        ev.preventDefault();
        this.pressedSide = side;
        if (this.pressTimer) {
            clearTimeout(this.pressTimer);
        }
        this.pressTimer = setTimeout(() => { 
            this.longPressFired = true;
            const magnitude = 10;
            const delta = this.pressedSide === 'left' ? -magnitude : +magnitude;
            this.changeHealth(delta);

            // clear the timer so it doesn’t fire again
            clearTimeout(this.pressTimer);
            this.pressTimer = null;
            this.cdr.markForCheck();
        }, 500);
    }

    onPressEnd(ev?: PointerEvent) {
        ev?.preventDefault();
        if (!this.pressedSide) 
            return;

        if (!this.longPressFired) {
            const magnitude = 1; // tap
            const delta = this.pressedSide === 'left' ? -magnitude : +magnitude;
            this.changeHealth(delta);
        }

        this.pressedSide = null;
        this.longPressFired = false;

        if (this.pressTimer) {
            clearTimeout(this.pressTimer);
            this.pressTimer = null;
        }

        this.cdr.markForCheck();
    }

    private restartTallyTimer() {
        // Clear any active countdown
        if (this.tallyTimer) {
            clearTimeout(this.tallyTimer);
        }

        // Start a new idle countdown
        this.tallyTimer = setTimeout(() => {
            if (this.delta !== 0 && this.player) {
                this.lobby.send('HEALTH', {
                    owner: this.currentUserId,
                    deltas: [
                        {
                            target: this.player.id,
                            delta: this.delta,
                            commander: this.commanderMode
                        }
                    ]
                });
            }

            this.delta = 0;
            this.tallyTimer = null;
            this.cdr.markForCheck();
        }, this.TALLY_IDLE_MS);
    }

    private resetTallyNow() {
        if (this.tallyTimer)  {
            clearTimeout(this.tallyTimer);
        }
        this.delta = 0;
        this.tallyTimer = null;
    }

    private relLuma(hex: string): number {
        const h = this.normalizeHex(hex);
        const r = parseInt(h.slice(1,3), 16) / 255;
        const g = parseInt(h.slice(3,5), 16) / 255;
        const b = parseInt(h.slice(5,7), 16) / 255;
        const toLin = (c: number) => c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4);
        return 0.2126*toLin(r) + 0.7152*toLin(g) + 0.0722*toLin(b);
    }

    private contrastRatio(l1: number, l2: number): number {
        const [L1, L2] = l1 >= l2 ? [l1, l2] : [l2, l1];
        return (L1 + 0.05) / (L2 + 0.05);
    }

    pickTextOn(hex: string): '#000000' | '#ffffff' {
        const Lbg = this.relLuma(hex);
        const cBlack = this.contrastRatio(Lbg, 0);
        const cWhite = this.contrastRatio(Lbg, 1);
        return cBlack >= cWhite ? '#000000' : '#ffffff';
    }

    fgColor(): string {
        if (this.player?.image) return '#ffffff';
        return this.pickTextOn(this.player?.color ?? '#ffffff');
    }

}