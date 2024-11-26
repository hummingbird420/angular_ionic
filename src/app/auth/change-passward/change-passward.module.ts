import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswardRoutingModule } from './change-passward-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChangePasswardPage } from './change-passward.page';



@NgModule({
  declarations: [ChangePasswardPage],
  imports: [
    CommonModule,
    ChangePasswardRoutingModule,
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class ChangePasswardModule { }
