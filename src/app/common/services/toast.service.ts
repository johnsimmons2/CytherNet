import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { ToastController } from "@ionic/angular/standalone";


export interface ToastMessage {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {

  constructor(private toastController: ToastController) {

  }

  public async show(message: ToastMessage): Promise<void> {
    const toast = await this.toastController.create({
      message: message.message,
      duration: message.duration || 2500,
      position: 'bottom',
      color: message.type,
      buttons: [
        {
          text: 'Close',
          role: 'cancel'
        }
      ]
    })

    await toast.present();
  }
}
