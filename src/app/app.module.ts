import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { apiInterceptor } from './services/api-interceptor';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';
import { CommonModule, DatePipe } from '@angular/common';
import { ConfirmClickComponent } from './components/confirm-click/confirm-click.component';
import { NgxsModule } from '@ngxs/store';
import { environment } from '../environments/environment.prod';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { UserState } from './states/user-state';
import { DashboardState } from './states/dashboard-state';
import { OfflinePage } from './offline/offline.page';


@NgModule({
  declarations: [AppComponent, ConfirmClickComponent, OfflinePage],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    CommonModule,
    RouterModule.forRoot([]),
    NgxsModule.forRoot([UserState], {
      developmentMode: !environment.production
    }),
    NgxsReduxDevtoolsPluginModule.forRoot()
    //StoreModule.forRoot({ users: usersReducer}),
  ],

  providers: [DatePipe, Geolocation, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, apiInterceptor],
  bootstrap: [AppComponent],
})
export class AppModule { }
