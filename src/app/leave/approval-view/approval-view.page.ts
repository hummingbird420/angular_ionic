import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LeaveService } from '../../services/leave.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { UpdateHeader } from '../../states/user-state';
import { ViewDidEnter } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-approval-view',
  templateUrl: './approval-view.page.html',
  styleUrls: ['./approval-view.page.scss'],
})
export class ApprovalViewPage implements ViewDidEnter {
  leaveApplicationList$!: Observable<any>;
  isToastOpen: boolean = false;
  errMessage: string = '';
  isActionDisplay: boolean = false;

  isShownAcknowledgeButton: boolean = false;
  isShownRecommendButton: boolean = false;
  isShownApproveButton: boolean = false;
  isShownRejectButton: boolean = false;
  isShownViewButton: boolean = false;
  isShownCancelButton: boolean = false;
  LeaveApprovalForm: FormGroup = new FormGroup({});
  isOnlyReject: boolean = false;
  isShownRequiredPurpose: boolean = false;
  isShownAreaRequired: boolean = false;
  isShownRecommendBy: boolean = false;
  isShownAcknowledgeBy: boolean = false;
  isShownApproveBy: boolean = false;
  isShownCancelNote: boolean = false;
  isShownAcknowledgeNote: boolean = false;
  isShownRecommendNote: boolean = false;
  isShownApproveNote: boolean = false;
  submitted: boolean = false;
  rowData: any;
  actionHeader: string = 'View Application';
  constructor(
    private leaveService: LeaveService,
    private formbulider: FormBuilder,
    private store: Store,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) { }
  ionViewDidEnter(): void {
    this.store.dispatch([new UpdateHeader('Pending Leave Applications', false, '')]);
    this.loadData();
    this.formInit();
  }


  doRefresh(event: any) {
    this.loadData();
    setTimeout(() => {

      event.target.complete();
    }, 1000);
  }
  formInit() {
    this.LeaveApprovalForm = this.formbulider.group({
      leave_application_id: 0,
      employee_id: [null],
      employee_name: [null,],
      employee_leave_ledger_id: [null],
      recommend_employee_name: [null],
      req_recommend_employee_id: [0],
      responsible_employee_name: [null],
      req_responsible_employee_id: [null],
      approve_employee_name: [null],
      req_approve_employee_id: [null],
      purpose: [null],
      enjoyable_area: [null],
      // attendance_policy_id: [null, [Validators.required]],
      leave: [null],
      responsible_note: ['', [Validators.required]],
      recommend_note: ['', [Validators.required]],
      approve_note: ['', [Validators.required]],
      cancel_note: ['', [Validators.required]],
      duration_days: [null],
      duration_min: [null],
      start_date: [null],
      end_date: [null],
      is_hourly: [false],
      is_half_day: [false],
      responsibile_employee_responsibility: ['']
    });
    this.setNoteValidators();

  }
  setNoteValidators() {

    const responsible_note = this.LeaveApprovalForm.get('responsible_note');
    const recommend_note = this.LeaveApprovalForm.get('recommend_note');
    const approve_note = this.LeaveApprovalForm.get('approve_note');
    const cancel_note = this.LeaveApprovalForm.get('cancel_note');

    this.isShownAcknowledgeNote ? responsible_note.setValidators([Validators.required]) : responsible_note.setValidators(null);
    this.isShownRecommendNote ? recommend_note.setValidators([Validators.required]) : recommend_note.setValidators(null);
    this.isShownApproveNote ? approve_note.setValidators([Validators.required]) : approve_note.setValidators(null);
    this.isShownCancelNote ? cancel_note.setValidators([Validators.required]) : cancel_note.setValidators(null);

    responsible_note.updateValueAndValidity();
    recommend_note.updateValueAndValidity();
    approve_note.updateValueAndValidity();
    cancel_note.updateValueAndValidity();
  }
  loadData() {
    this.leaveApplicationList$ = this.leaveService.GetAllApplicationByUser();
    this.leaveApplicationList$.subscribe();
  }
  resizeLeaveContent(text: string) {
    if (text.length > 133) {
      return text.substring(0, 130) + '...';
    }
    return text;
  }

  viewApplicationDetails(e: any, data: any) {
    this.rowData = data;
    this.userWisefieldAndButtonShow(this.rowData.waiting_status_id, this.rowData.is_action);
    this.isActionDisplay = true;
    if (e.target.innerText.trim().toLowerCase() == "reject") {
      this.isOnlyReject = true;
      this.actionHeader = 'Reject Application';
    }
    else {
      this.actionHeader = 'Approve Application';
      this.isOnlyReject = false;
    }

    this.loadViewData(data)
  }
  userWisefieldAndButtonShow(waiting_status_id, is_action) {
    this.LeaveApprovalForm.controls['responsible_note'].disable();
    this.LeaveApprovalForm.controls['recommend_note'].disable();
    this.LeaveApprovalForm.controls['approve_note'].disable();
    this.LeaveApprovalForm.controls['cancel_note'].disable();

    if (waiting_status_id === 3 && is_action) {
      this.isShownAcknowledgeButton = true;
      this.isShownAcknowledgeNote = true;
      this.LeaveApprovalForm.controls['responsible_note'].enable();
    }

    else if (waiting_status_id === 4 && is_action) {
      this.isShownRecommendNote = true;
      this.LeaveApprovalForm.controls['recommend_note'].enable();
      this.isShownRecommendButton = true;
      this.isShownAcknowledgeBy = true;
      this.isShownAcknowledgeNote = true;
    }


    else if (waiting_status_id === 5 && is_action) {
      this.isShownApproveButton = true;
      this.isShownRejectButton = true;
      this.isShownApproveNote = true;
      this.isShownRecommendNote = true;
      this.isShownRecommendBy = true;
      this.LeaveApprovalForm.controls['approve_note'].enable();
    }

    else if (waiting_status_id === 7 && is_action) {
      this.isShownCancelButton = true;
      this.isShownCancelNote = true;
      this.isShownRecommendNote = true;
      this.isShownApproveNote = true;
      this.isShownApproveBy = true;
      this.LeaveApprovalForm.controls['cancel_note'].enable();
    }

    else if (waiting_status_id === 6 && is_action) {
      this.isShownApproveButton = true;
      this.isShownApproveNote = true;
      this.isShownRecommendNote = true;
      this.isShownRecommendBy = true;
    }
    else if (waiting_status_id === 0) {
      this.isShownViewButton = true;
      this.isShownApproveBy = true;
      this.isShownApproveNote = true;
      this.isShownCancelNote = true;
      this.isShownRecommendNote = true;
    }
    else {
      this.isShownViewButton = true;
      this.isShownApproveBy = true;
      this.isShownApproveNote = true;
      this.isShownCancelNote = true;
      this.isShownRecommendNote = true;
    }
  }
  loadViewData(data) {

    (data.purpose) ? this.isShownRequiredPurpose = true : this.isShownRequiredPurpose = false;
    (data.enjoyable_area) ? this.isShownAreaRequired = true : this.isShownAreaRequired = false;
    (data.recommender_name) ? this.isShownRecommendBy = true : this.isShownRecommendBy = false;
    (data.responsible_name) ? this.isShownAcknowledgeBy = true : this.isShownAcknowledgeBy = false;

    this.LeaveApprovalForm.controls['employee_name'].setValue(data.employee_name + " " + data.official_info);
    this.LeaveApprovalForm.controls['employee_id'].setValue(data.employee_id);
    this.LeaveApprovalForm.controls['is_hourly'].setValue(data.is_hourly);
    if (data.is_houly) {
      this.LeaveApprovalForm.controls['start_date'].setValue(data.start_date_time);
      this.LeaveApprovalForm.controls['end_date'].setValue(data.end_date_time);
    }
    else {
      this.LeaveApprovalForm.controls['start_date'].setValue(data.start_date);
      this.LeaveApprovalForm.controls['end_date'].setValue(data.end_date);
    }
    this.LeaveApprovalForm.controls['duration_days'].setValue(data.duration_days);
    this.LeaveApprovalForm.controls['duration_min'].setValue(data.duration_min / 60.0);
    this.LeaveApprovalForm.controls['leave'].setValue(data.leave);
    this.LeaveApprovalForm.controls['enjoyable_area'].setValue(data.enjoyable_area);
    this.LeaveApprovalForm.controls['purpose'].setValue(data.purpose);
    this.LeaveApprovalForm.controls['recommend_employee_name'].setValue(data.recommender_name);
    this.LeaveApprovalForm.controls['responsible_employee_name'].setValue(data.responsible_name);
    this.LeaveApprovalForm.controls['approve_employee_name'].setValue(data.approver_name);
    this.LeaveApprovalForm.controls['responsible_note'].setValue(data.responsible_note);
    this.LeaveApprovalForm.controls['recommend_note'].setValue(data.recommend_note);
    this.LeaveApprovalForm.controls['approve_note'].setValue(data.approve_note);
    this.LeaveApprovalForm.controls['cancel_note'].setValue(data.cancel_note);
    this.LeaveApprovalForm.controls['responsibile_employee_responsibility'].setValue(data.responsibile_employee_responsibility);

  }
  leaveAcknowledge() {
    this.actionHeader = 'Application Acknowledge';

    this.submitted = true;
    if (this.LeaveApprovalForm.invalid) {
      return;
    }
    let responsible_note = this.LeaveApprovalForm.get('responsible_note')?.value;
    this.LeaveApprovalForm.get('employee_leave_ledger_id').setValue(this.rowData.employee_leave_ledger_id);
    var data = {
      leave_application_id: this.rowData.leave_application_id,
      employee_id: this.rowData.employee_id,
      employee_leave_ledger_id: this.rowData.employee_leave_ledger_id,
      note: responsible_note ?? ''
    };
    this.cdRef.detectChanges();
    this.leaveService.acknowledge(data).subscribe(
      result => {
        this.isShownAcknowledgeButton = false;
        this.errMessage = result.CurrentMessage;
        this.setOpen(true);
        if (result.MessageType == 1) {
          this.loadData();
          this.resetForm();
        }
      });
  }
  leaveRecommend() {
    debugger
    this.actionHeader = 'Application Recommend';
    this.submitted = true;
    if (this.LeaveApprovalForm.invalid) {
      return;
    }
    let recommend_note = this.LeaveApprovalForm.get('recommend_note')?.value;
    this.LeaveApprovalForm.get('employee_leave_ledger_id').setValue(this.rowData.employee_leave_ledger_id);
    var data = {
      leave_application_id: this.rowData.leave_application_id,
      employee_id: this.rowData.employee_id,
      employee_leave_ledger_id: this.rowData.employee_leave_ledger_id,
      note: recommend_note ?? ''
    };
    this.cdRef.detectChanges();
    this.leaveService.recommend(data).subscribe(
      result => {
        this.isShownRecommendButton = false;
        this.errMessage = result.CurrentMessage;
        this.setOpen(true);
        if (result.MessageType == 1) {
          this.loadData();
          this.resetForm();
        }
      });
  }
  leaveApprove() {
    this.submitted = true;
    this.actionHeader = 'Application Approve';
    let approve_note = this.LeaveApprovalForm.get('approve_note')?.value;
    this.LeaveApprovalForm.get('employee_leave_ledger_id').setValue(this.rowData.employee_leave_ledger_id);
    var data = {
      leave_application_id: this.rowData.leave_application_id,
      employee_id: this.rowData.employee_id,
      employee_leave_ledger_id: this.rowData.employee_leave_ledger_id,
      note: approve_note ?? ''
    };
    this.cdRef.detectChanges();
    if (this.LeaveApprovalForm.invalid) {
      return;
    }
    this.leaveService.approve(data).subscribe(
      result => {
        this.isShownApproveButton = false;
        this.errMessage = result.CurrentMessage;
        this.setOpen(true);
        if (result.MessageType == 1) {
          this.loadData();
          this.resetForm();
        }
      });
  }
  leaveReject() {
    this.submitted = true;
    this.actionHeader = 'Application Reject';
    let approve_note = this.LeaveApprovalForm.get('approve_note')?.value;
    this.LeaveApprovalForm.get('employee_leave_ledger_id').setValue(this.rowData.employee_leave_ledger_id);
    var data = {
      leave_application_id: this.rowData.leave_application_id,
      employee_id: this.rowData.employee_id,
      employee_leave_ledger_id: this.rowData.employee_leave_ledger_id,
      note: approve_note ?? ''
    };
    this.cdRef.detectChanges();
    if (this.LeaveApprovalForm.invalid) {
      return;
    }
    this.leaveService.reject(data).subscribe(
      result => {
        this.isShownRejectButton = false;
        this.errMessage = result.CurrentMessage;
        this.setOpen(true);
        if (result.MessageType == 1) {
          this.loadData();
          this.resetForm();
        }
      });
  }
  leaveCancel() {
    this.submitted = true;
    this.actionHeader = 'Application Cancel';
    let cancel_note = this.LeaveApprovalForm.get('cancel_note')?.value;
    this.LeaveApprovalForm.get('employee_leave_ledger_id').setValue(this.rowData.employee_leave_ledger_id);
    var data = {
      leave_application_id: this.rowData.leave_application_id,
      employee_id: this.rowData.employee_id,
      employee_leave_ledger_id: this.rowData.employee_leave_ledger_id,
      note: cancel_note ?? ''
    };
    this.cdRef.detectChanges();
    if (this.LeaveApprovalForm.invalid) {
      return;
    }
    this.leaveService.cancel(data).subscribe(
      result => {
        this.isShownCancelButton = false;
        this.errMessage = result.CurrentMessage;
        this.setOpen(true);
        if (result.MessageType == 1) {
          this.loadData();
          this.resetForm();
        }
      });
  }
  resetForm() {
    this.LeaveApprovalForm.reset();
    this.submitted = false;
    this.rowData = null;
    this.isActionDisplay = false;
  }
  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
}
