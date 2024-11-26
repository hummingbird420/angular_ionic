import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardPage } from './dashboard.page';
import { HighchartsChartModule } from 'highcharts-angular';
import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { NgxsModule } from '@ngxs/store';
import { DashboardState } from '../states/dashboard-state';
import { MinutesToHourPipe } from '../pipes/minutes-to-hour.pipe';

@NgModule({

  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    DashboardPageRoutingModule,
    HighchartsChartModule,
   NgxsModule.forFeature([DashboardState]),
  ],

  declarations: [DashboardPage,MinutesToHourPipe]
})
export class DashboardPageModule {}
