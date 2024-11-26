import { Component, OnInit } from '@angular/core';
import { RegularizationService } from '../../services/regularization.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { UpdateHeader } from '../../states/user-state';
import { ViewDidEnter } from '@ionic/angular';

@Component({
  selector: 'app-approve-regularization',
  templateUrl: './approve-regularization.page.html',
  styleUrls: ['./approve-regularization.page.scss'],
})
export class ApproveRegularizationPage implements ViewDidEnter {

  regularization$!: Observable<any>;
  isToastOpen = false;
  errMessage: string = '';
  AttendanceRegularizationForm: FormGroup = new FormGroup({});
  attDate: any;
  allShifts: any[] = [];
  currentAttendance: boolean = false;
  AttendanceTrackingList: any[] = [];
  isShownInTime: boolean = false;
  inTime: any;
  isShownOutTime: boolean = false;
  outTime: any;
  isApproveModal: boolean = false;
  txtRemarks: any;
  isActionDisplay: boolean = false;
  attendanceRegularizationId: number = 0;
  flag: number = 0;
  header: string = '';
  constructor(private regService: RegularizationService, private formbulider: FormBuilder, private store: Store) { }
  ionViewDidEnter(): void {
    this.store.dispatch([new UpdateHeader('Pending Regularization', false, '')]);
    this.loadData();
    this.formInit();
    this.loadAllShift();
  }

  doRefresh(event: any) {
    this.loadData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
  loadData() {
    this.regularization$ = this.regService.getAppliedForApprovedData(1);
    this.regularization$.subscribe();
  }
  formInit() {
    this.AttendanceRegularizationForm = this.formbulider.group({
      attendance_regularization_id: 0,
      shift_id: new FormControl(null, [Validators.required]),
      attendance_date: new FormControl(new Date(new Date().setHours(12, 0, 0, 0)).toISOString(), [Validators.required]),
      reason: new FormControl(null, [Validators.required]),
      is_early_consider: new FormControl(false),
      is_late_consider: new FormControl(false),
      make_absent: new FormControl(false),
      in_time: new FormControl(''),
      out_time: new FormControl(''),
      is_InTime: new FormControl(false),
      is_OutTime: new FormControl(false),
      show_in_time: new FormControl(false),
      show_out_time: new FormControl(false),
      req_approve_employee_id: new FormControl(null, [Validators.required]),
      approve_employee_name: new FormControl(null),
      approver_note: new FormControl(null),
      reject_employee_name: new FormControl(null),
      reject_note: new FormControl(null),
    });
  }
  loadAllShift() {
    this.regService.getShiftForDP().subscribe((data: any) => {
      this.allShifts = data;
    });
  }
  resizeLeaveContent(text: string) {
    if (text.length > 133) {
      return text.substring(0, 130) + '...';
    }
    return text;
  }
  approveApplication(arg: any) {
    this.header = 'Approve ?';
    this.attendanceRegularizationId = arg && arg.attendance_regularization_id ? arg.attendance_regularization_id : 0;
    if (arg && arg.ar_status_id != 1) {
      this.errMessage = 'Only Applied application can be approved.';
      this.setOpen(true);
      return;
    }
    if (this.attendanceRegularizationId == 0) {
      this.errMessage = 'Please select row.';
      this.setOpen(true);
      return;
    }
    this.flag = 2;
    this.isApproveModal = true;
  }
  viewApplication(arg: any) {
    this.attendanceRegularizationId = arg && arg.attendance_regularization_id ? arg.attendance_regularization_id : 0;
    this.isActionDisplay = true;
    for (const key of Object.keys(this.AttendanceRegularizationForm.value)) {
      const val = arg[key] ?? null;
      if (key == 'attendance_date') {
        this.attDate = new Date(val);
        this.AttendanceRegularizationForm.controls[key].setValue((new Date(val)));
      }
      else if (key == 'in_time' || key == 'out_time') {
        this.AttendanceRegularizationForm.controls[key].setValue((new Date(val).toLocaleTimeString()));
        if (key == 'in_time' && val) {
          this.inTime = new Date(val).toLocaleTimeString();
          this.AttendanceRegularizationForm.controls['show_in_time'].setValue((new Date(val).toLocaleTimeString()));
          this.AttendanceRegularizationForm.controls['is_InTime'].setValue(true);
          this.isShownInTime = true;
        }
        if (key == 'out_time' && val) {
          this.outTime = new Date(val).toLocaleTimeString();
          this.AttendanceRegularizationForm.controls['show_out_time'].setValue((new Date(val).toLocaleTimeString()));
          this.AttendanceRegularizationForm.controls['is_OutTime'].setValue(true);
          this.isShownOutTime = true;

        }
      }
      else if (key == 'is_InTime' || key == 'is_OutTime' || key == 'show_in_time' || key == 'show_out_time') {
      }
      else {
        this.AttendanceRegularizationForm.controls[key].setValue(val);
      }
    }

    this.AttendanceRegularizationForm.disable();
  }
  rejectApplication(arg: any) {
    this.header = 'Reject ?';
    this.attendanceRegularizationId = arg && arg.attendance_regularization_id ? arg.attendance_regularization_id : 0;
    if (arg && arg.ar_status_id != 1) {
      this.errMessage = 'Only Applied application can be approved.';
      this.setOpen(true);
      return;
    }
    if (this.attendanceRegularizationId == 0) {
      this.errMessage = 'Please select row.';
      this.setOpen(true);
      return;
    }
    this.flag = 3;
    this.isApproveModal = true;
  }
  onApproveOrReject() {
    if (!this.txtRemarks) {
      this.errMessage = 'Note/Remarks Required!';
      this.setOpen(true);
      return;
    }
    this.regService.onApproveOrReject(this.attendanceRegularizationId, this.flag, this.txtRemarks).subscribe((data: any) => {
      this.loadData();
      this.isApproveModal = false;
      this.txtRemarks = '';
    })

  }
  cancel() {
    this.isApproveModal = false;
    this.txtRemarks = '';
  }
  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
  resetForm() {
    this.AttendanceRegularizationForm.reset();
    this.txtRemarks = '';
  }
}
