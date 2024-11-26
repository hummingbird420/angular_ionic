import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LeaveService } from '../../services/leave.service';
import { UpdateHeader } from '../../states/user-state';
import { Store } from '@ngxs/store';
import { ViewDidEnter } from '@ionic/angular';
import { ConfirmServiceService } from 'src/app/components/confirm-service.service';

@Component({
  selector: 'app-application-view',
  templateUrl: './application-view.page.html',
  styleUrls: ['./application-view.page.scss'],
})
export class ApplicationViewPage implements ViewDidEnter {

  leaveApplication$!: Observable<any[]>;
  isToastOpen = false;
  errMessage: string = '';
  constructor(private router: Router, private leaveService: LeaveService, private store: Store, private confirmAlert: ConfirmServiceService) {

  }
  ionViewDidEnter(): void {
    this.store.dispatch([new UpdateHeader('Leave Applications', true, '/leave-apply')]);
    this.loadData();
  }


  loadData() {
    this.leaveApplication$ = this.leaveService.getAll();
    this.leaveApplication$.subscribe();
  }
  doRefresh(event: any) {
    this.loadData();
    setTimeout(() => {

      event.target.complete();
    }, 1000);
  }
  routeApplicationById(key: any) {
    this.router.navigate(['leave-view/' + btoa(key)]);
  }

  resizeLeaveContent(text: string) {
    if (text.length > 133) {
      return text.substring(0, 130) + '...';
    }
    return text;
  }
  editApplication(leave: any) {
    if (leave.leave_status_id != 1) {
      this.errMessage = 'Only Draft mode application can be edited.';
      this.setOpen(true);
      return;
    }
    this.router.navigate(['leave-apply'], { queryParams: { approvals: leave.leave_application_id, action: 1 } });
  }
  viewApplication(leave: any) {
    this.router.navigate(['leave-apply'], { queryParams: { approvals: leave.leave_application_id, action: 2 } });
  }
  async deleteApplication(leave: any) {

    if (leave.leave_status_id != 1) {
      this.errMessage = 'Only Draft mode application can be deleted.';
      this.setOpen(true);
      return;
    }
    let confirm = await this.confirmAlert.confirmClick('Do you want to delete this application?');
    if (confirm) {
      this.delete(leave);
    }

  }
  delete(leave: any) {

    let leave_application_id = leave.leave_application_id;
    this.leaveService.delete(leave_application_id).subscribe(data => {
      this.errMessage = data.CurrentMessage;
      this.setOpen(true);
      if (data.MessageType == 1) {
        this.loadData();
      }

    });
  }
  async cancelApplication(leave: any) {

    if (leave.leave_status_id != 5) {
      this.errMessage = 'Only approved application can be canceled.';
      this.setOpen(true);
      return;
    }

    let confirm = await this.confirmAlert.confirmClick('Do you want to cancel this application?');
    if (confirm) {
      let leave_application_id = leave.leave_application_id;
      this.leaveService.cancelForRequest(leave_application_id).subscribe(data => {
        this.errMessage = data.CurrentMessage;
        this.setOpen(true);
        if (data.MessageType == 1) {
          this.loadData();
        }

      });
    }

  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
}


