import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './auth-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { LoginPage } from './login/login.page';
import { ForgetPasswardPage } from './forget-passward/forget-passward.page';
import { ResetPasswardPage } from './reset-passward/reset-passward.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    HttpClientModule
  ],
  declarations: [LoginPage,ForgetPasswardPage,ResetPasswardPage]
})
export class AuthModule {}
