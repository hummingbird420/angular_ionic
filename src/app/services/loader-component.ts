import { Component, OnInit } from '@angular/core';
import { LoaderService } from './loader.service';
import { ViewDidEnter } from '@ionic/angular';


@Component({
  selector: 'app-loader',
  template: `
    <ion-list *ngIf="loaded" style="height: 100vh;background-color: white;">
  <ion-list-header>
    <ion-skeleton-text [animated]="true" style="width: 80px"></ion-skeleton-text>
  </ion-list-header>
  <ion-item>
    <ion-thumbnail slot="start">
      <ion-skeleton-text [animated]="true"></ion-skeleton-text>
    </ion-thumbnail>
    <ion-label>
      <h3>
        <ion-skeleton-text [animated]="true" style="width: 80%;"></ion-skeleton-text>
      </h3>
      <p>
        <ion-skeleton-text [animated]="true" style="width: 60%;"></ion-skeleton-text>
      </p>
      <p>
        <ion-skeleton-text [animated]="true" style="width: 30%;"></ion-skeleton-text>
      </p>
    </ion-label>
  </ion-item>
</ion-list>
  `
})
export class LoaderComponent implements ViewDidEnter {
  loaded = false;

  constructor(private loaderService: LoaderService) {
    this.loaderService.loadState.subscribe(res => {
      this.loaded = res;
    });
  }
  ionViewDidEnter(): void {

  }
}
