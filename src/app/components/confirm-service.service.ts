import { Injectable } from '@angular/core';
import { ConfirmClickComponent } from './confirm-click/confirm-click.component';
import { AlertController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class ConfirmServiceService {
  constructor(private alertController: AlertController) { }
  async showConfirmAlert(message: string): Promise<boolean> {
    const alert = await this.alertController.create({
      header: 'Confirm',
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            return false;

          }
        },
        {
          text: 'Confirm',
          role: 'confirm',
          handler: () => {
            return true;
          }
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    return role === 'confirm';
  }
  async confirmClick(message: string): Promise<boolean> {
   return await this.showConfirmAlert(message);
  }
}
