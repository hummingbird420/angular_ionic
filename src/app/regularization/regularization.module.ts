import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ApplyRegularizationPage } from './attendance-reguliaztion/apply-regularization.page';
import { AttendanceReguliaztionPage } from './attendance-reguliaztion/attendance-reguliaztion.page';
import { ApproveRegularizationPage } from './attendance-reguliaztion/approve-regularization.page';
import { RegularizationRoutingModule } from './regularization-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ApplyRegularizationPage,AttendanceReguliaztionPage,ApproveRegularizationPage],
  providers:[DatePipe],
  imports: [
    CommonModule,
    RegularizationRoutingModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RegularizationModule { }
