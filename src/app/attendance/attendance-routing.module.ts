import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendancePage } from './attendance.page';
import { AttendanceResolver } from './attendance.resolver';

const routes: Routes = [
  {
    path: '',
    component: AttendancePage,
    resolve: { att: AttendanceResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendancePageRoutingModule { }
