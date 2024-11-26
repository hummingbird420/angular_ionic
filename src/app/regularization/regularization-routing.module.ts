import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttendanceReguliaztionPage } from './attendance-reguliaztion/attendance-reguliaztion.page';
import { ApplyRegularizationPage } from './attendance-reguliaztion/apply-regularization.page';
import { ApproveRegularizationPage } from './attendance-reguliaztion/approve-regularization.page';

const routes: Routes = [
  {
    path: 'regularization',
    component: AttendanceReguliaztionPage
  },
  {
    path: 'regularization-apply',
    component: ApplyRegularizationPage
  },
  {
    path: 'regularization-edit/:key',
    component: ApplyRegularizationPage
  },

  {
    path: 'regularization-view/:key',
    component: ApplyRegularizationPage
  },
  {
    path: 'approval-regularization',
    component: ApproveRegularizationPage
  },
  {
    path: 'approval-view/:key',
    component: ApplyRegularizationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegularizationRoutingModule { }
