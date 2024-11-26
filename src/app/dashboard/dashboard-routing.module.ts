import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPage } from './dashboard.page';
import { DashboardResolver } from './dashboard.resolver';


const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardPage,
    resolve: { dashboard: DashboardResolver }
  },
  {
    path: '',
    component: DashboardPage,
    resolve: { dashboard: DashboardResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardPageRoutingModule { }
