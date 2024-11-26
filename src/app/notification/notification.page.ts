import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { UpdateHeader } from '../states/user-state';
import { ViewDidEnter } from '@ionic/angular';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements ViewDidEnter {
  noticeData$!: Observable<any>;
  isToastOpen = false;
  errMessage: string = '';
  constructor(private noticeService: NotificationService, private router: Router, private store: Store) { }
  ionViewDidEnter(): void {
    this.store.dispatch([new UpdateHeader('Notice', false, '')]);
    this.loadData();
  }
  doRefresh(event: any) {
    this.loadData();
    setTimeout(() => {

      event.target.complete();
    }, 1000);
  }
  loadData() {
    this.noticeData$ = this.noticeService.getNotificationInfo();
    this.noticeData$.subscribe();
  }
  resizeNoticeSubject(text: string) {
    if (text.length > 31) {
      return text.substring(0, 28) + '...';
    }
    return text;
  }
  resizeNoticeContent(text: string) {
    if (text.length > 63) {
      return text.substring(0, 50) + '...';
    }
    return text;
  }
  routeNoticeById(key: any) {
    this.router.navigate(['/notification-details/' + btoa(key)]);
  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
}
