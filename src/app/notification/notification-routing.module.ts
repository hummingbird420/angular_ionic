import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NotificationPage } from './notification.page';
import { DetailsPage } from './details/details.page';



const routes: Routes = [
  {
    path: 'notification',
    component: NotificationPage

  },
   {
    path: 'notification-details/:key',
    component: DetailsPage
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule { }
