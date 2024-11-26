import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RegularizationService } from '../../services/regularization.service';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { UpdateHeader } from '../../states/user-state';
import { ViewDidEnter } from '@ionic/angular';

@Component({
  selector: 'app-attendance-reguliaztion',
  templateUrl: './attendance-reguliaztion.page.html',
  styleUrls: ['./attendance-reguliaztion.page.scss'],
})
export class AttendanceReguliaztionPage implements ViewDidEnter {
  regularization$!: Observable<any>;
  isToastOpen: boolean = false;
  errMessage: string = '';
  constructor(private regService: RegularizationService, private router: Router, private store: Store) { }
  ionViewDidEnter(): void {
    this.store.dispatch([new UpdateHeader('Regularization', true, '/regularization-apply')]);
    this.loadData();
  }
  loadData() {
    this.regularization$ = this.regService.getRegularizationBySelf();
    this.regularization$.subscribe();
  }
  doRefresh(event: any) {
    this.loadData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
  editApplication(e: any) {

  }
  viewApplication(e: any) {
    this.router.navigate(['regularization-view/' + e.attendance_regularization_id])
  }
  deleteApplication(e: any) {

  }
  cancelApplication(e: any) {

  }
  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
}
