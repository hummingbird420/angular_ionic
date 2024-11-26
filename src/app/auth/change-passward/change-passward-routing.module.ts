import { NgModule } from '@angular/core';
import { ChangePasswardPage } from './change-passward.page';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  {
    path: 'change-password',
    component: ChangePasswardPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ChangePasswardRoutingModule { }
