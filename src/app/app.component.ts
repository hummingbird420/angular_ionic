import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { NavController, Platform } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { Network } from '@capacitor/network';
import { Router } from '@angular/router';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  backUrl: string;
  flag: boolean = false;
  constructor(private storage: Storage, private platform: Platform, private navCtrl: NavController, private router: Router) {
    this.backUrl = this.router.url
    this.init();
    this.requestLocationPermission();
  }
  async init() {
    await this.storage.create();
    this.platform.ready().then(() => {

      this.checkNetworkStatus();
      Network.addListener('networkStatusChange', (status) => {
        if (status.connected && this.flag) {
          this.handleConnectionRestored();
          this.flag = false;
        } else if (!status.connected) {
          this.flag = true;
          this.navigateToOfflinePage();
        }
        else {

        }
      });
    });
  }
  async requestLocationPermission() {
    if (this.platform.is('capacitor')) {
      const hasPermission = await this.checkLocationPermission();
      if (hasPermission) {
      } else {
        const permissionResult = await Geolocation.requestPermissions();
        if (permissionResult.location === 'granted') {
          console.error('Permission granted');
        } else {
          console.error('Permission denied');
        }
      }
    } else {
      console.log('Capacitor is not available - cannot request permissions.');
    }
  }
  async checkLocationPermission(): Promise<boolean> {
    const permissionResult = await Geolocation.checkPermissions();

    return permissionResult.location === 'granted';
  }
  checkNetworkStatus() {
    Network.getStatus().then((status) => {
      if (!status.connected) {
        this.navigateToOfflinePage();
      }
    });
  }

  navigateToOfflinePage() {
    if (this.router.url !== '/offline') {
      this.backUrl = this.router.url;
    }
    this.navCtrl.navigateForward('/offline');
  }

  handleConnectionRestored() {
    this.navCtrl.navigateBack(this.backUrl);
  }
}
