import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../services/auth-guard';
import { ChangePasswardPage } from '../auth/change-passward/change-passward.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        data: { role: 'ROLE_ADMIN' },
        loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        path: 'attendance',
        canActivate: [AuthGuard],
        loadChildren: () => import('../attendance/attendance.module').then(m => m.AttendancePageModule)
      },
      {
        path: '',
        canActivate: [AuthGuard],
        loadChildren: () => import('../notification/notification.module').then(m => m.NotificationModule),

      },
      {
        path: '',
        canActivate: [AuthGuard],
        loadChildren: () => import('../leave/leave.module').then(m => m.LeaveModule),

      },
      {
        path: '',
        canActivate: [AuthGuard],
        loadChildren: () => import('../regularization/regularization.module').then(m => m.RegularizationModule),

      },
      {
        path: '',
        canActivate: [AuthGuard],
        loadChildren: () => import('../auth/change-passward/change-passward.module').then(m => m.ChangePasswardModule),

      }
    ]
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
