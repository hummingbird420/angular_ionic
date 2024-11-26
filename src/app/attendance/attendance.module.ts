import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendancePage } from './attendance.page';

import { AttendancePageRoutingModule } from './attendance-routing.module';
import { NgxsModule } from '@ngxs/store';
import { AttendenceState } from '../states/attendance-state';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AttendancePageRoutingModule,
    NgxsModule.forFeature([AttendenceState]),
  ],
  declarations: [AttendancePage],
  providers: []
})
export class AttendancePageModule { }
