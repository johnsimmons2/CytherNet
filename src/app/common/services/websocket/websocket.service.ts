import { Injectable, NgZone, OnDestroy } from "@angular/core";
import { environment } from "src/environments/environment";
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { BehaviorSubject, filter, retryWhen, Subject, switchMap, takeUntil, timer } from "rxjs";
import { ServerMessage } from "src/app/modules/live/tracker-lobby/trackerlobby";


@Injectable({
    providedIn: 'root'
})
export class WebsocketService implements OnDestroy {

    readonly ROOT_URL = environment.wsApiUrl;
    private stop$ = new Subject<void>();
    
    public socket$!: WebSocketSubject<ServerMessage | any>
    public connected$ = new BehaviorSubject<boolean>(false);
    public messages$ = new Subject<ServerMessage>();

    constructor(private zone: NgZone) {
        this.connect();
    }

    private connect() {
        this.zone.runOutsideAngular(() => {
            this.socket$ = webSocket<ServerMessage | any>({
                url: this.ROOT_URL,
                deserializer: (e) => {
                    const outer = JSON.parse(e.data as string);
                    if (outer?.type === 'ping') return { action: 'PING' };

                    if (outer && typeof outer.text === 'string') {
                        return JSON.parse(outer.text);
                    }
                    return outer;
                },
                serializer: v => JSON.stringify(v),
                openObserver: {
                    next: () => this.zone.run(() => this.connected$.next(true))
                },
                closeObserver: {
                    next: () => this.zone.run(() => this.connected$.next(false))
                }
            });

            this.socket$.pipe(
                retryWhen(errors => errors.pipe(
                    switchMap((_, i) => timer([1000, 2000, 5000][Math.min(i, 2)]))
                )),
                takeUntil(this.stop$)
            ).subscribe({
                next: (msg: ServerMessage) => {
                    if (msg?.type === 'ping')
                        return;
                    this.zone.run(() => this.messages$.next(msg));
                },
                error: () => {},
                complete: () => {}
            });
        });
    }

    shutdown(): void {
        this.stop$.next(); 
        this.stop$.complete();
        try {
            this.socket$.complete();
        } catch {}
    }

    ngOnDestroy() {
        this.shutdown();
    }

    send(action: string, data?: any) {
        if (!this.socket$ || this.socket$.closed)
            return;
        this.socket$.next({ action, data });
    }

    on(action: string) {
        return this.messages$.pipe(filter((m: any) => m?.action === action));
    }
}
