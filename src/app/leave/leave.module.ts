import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LeaveApplicationPage } from './leave-application/leave-application.page';
import { LeaveRoutingModule } from './leave-routing.module';
import { ApplicationViewPage } from './application-view/application-view.page';
import { ApprovalViewPage } from './approval-view/approval-view.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [LeaveApplicationPage,ApplicationViewPage,ApprovalViewPage],
  imports: [
    CommonModule,
    IonicModule,
    LeaveRoutingModule,FormsModule,ReactiveFormsModule
  ]
})
export class LeaveModule { }
