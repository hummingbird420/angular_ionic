import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationRoutingModule } from './notification-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NotificationPage } from './notification.page';
import { DetailsPage } from './details/details.page';



@NgModule({
  declarations: [NotificationPage,DetailsPage],
  imports: [
    CommonModule,
    NotificationRoutingModule,
    IonicModule,
    FormsModule
  ]
})
export class NotificationModule { }
