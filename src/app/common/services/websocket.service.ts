import { Injectable } from "@angular/core";
import { Socket, SocketIoConfig } from "ngx-socket-io";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService extends Socket {

  readonly ROOT_URL = environment.apiUrl;

  constructor() {
    super({ url: environment.apiUrl, options: {} });
  }

  send(data: any) {
    this.emit('message', data);
  }

  response() {
    return this.fromEvent('message');
  }
}
