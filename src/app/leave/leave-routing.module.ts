import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationViewPage } from './application-view/application-view.page';
import { LeaveApplicationPage } from './leave-application/leave-application.page';

import { ApprovalViewPage } from './approval-view/approval-view.page';
import { LeaveResolver } from './leave-resolver';

const routes: Routes = [
  {
    path: 'leave',
    component: ApplicationViewPage
  },
  {
    path: 'leave-apply',
    component: LeaveApplicationPage,
    resolve: { data: LeaveResolver }
  },
  {
    path: 'leave-edit/:key',
    component: LeaveApplicationPage,
    resolve: { data: LeaveResolver }
  },
  {
    path: 'approval-leave',
    component: ApprovalViewPage
  },
  {
    path: 'approval-view/:key',
    component: ApprovalViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveRoutingModule { }
