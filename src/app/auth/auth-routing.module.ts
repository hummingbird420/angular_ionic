import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPage } from './login/login.page';
import { ForgetPasswardPage } from './forget-passward/forget-passward.page';
import { ResetPasswardPage } from './reset-passward/reset-passward.page';
import { ChangePasswardPage } from './change-passward/change-passward.page';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: 'forget-password',
    component: ForgetPasswardPage,
  },
  {
    path: 'reset-password',
    component: ResetPasswardPage,
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {}
