import { Component, OnInit } from '@angular/core';
import { MenuController, ViewDidEnter } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UserState, SetUser, UpdateLogout } from '../states/user-state';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { Storage } from '@ionic/storage-angular';
import { UpdateMenuReset } from '../states/dashboard-state';
import { ResetLocation } from '../states/attendance-state';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements ViewDidEnter {
  @Select(UserState.getUsers)
  userInfo$!: Observable<any>;

  @Select(UserState.getHeaders)
  headerInfo$!: Observable<any>;

  isOpen: boolean = false;
  constructor(private storage: Storage, private menuCtrl: MenuController, private store: Store, private router: Router, private tokenService: TokenService) { }
  ionViewDidEnter(): void {
    this.closeMenu();
  }
  openFirstMenu() {
    this.isOpen = true;
    this.menuCtrl.open('this-menu');
  }
  closeMenu() {
    this.menuCtrl.close('this-menu');
  }
  logOut() {
    localStorage.clear();
    sessionStorage.clear();
    this.tokenService.signOut();
    this.store.dispatch([new SetUser({}), new UpdateLogout(), new UpdateMenuReset(), new ResetLocation()]);
    this.router.navigate(['/login']);
  }
  routeChangePassword() {
    this.closeMenu();
    this.router.navigate(['/change-password']);
  }
  navigateMenu(link: string) {
    this.closeMenu();
    this.router.navigate([link]);
  }
}
