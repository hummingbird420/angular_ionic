import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegularizationService } from '../../services/regularization.service';
import { IonAccordionGroup, IonDatetime, ViewDidEnter, ViewDidLeave, ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateHeader } from '../../states/user-state';
import { Store } from '@ngxs/store';


@Component({
  selector: 'app-apply-regularization',
  templateUrl: './apply-regularization.page.html',
  styleUrls: ['./apply-regularization.page.scss'],
})
export class ApplyRegularizationPage implements ViewDidEnter, ViewWillEnter, ViewWillLeave, ViewDidLeave {
  isToastOpen: boolean = false;
  errMessage: string = '';
  isApplyMode: boolean = false;
  AttendanceRegularizationForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  isShownInTime: boolean = false;

  allShifts: any[] = [];

  attDate: any;
  @ViewChild('att_date', { static: true }) att_date!: IonAccordionGroup;
  @ViewChild('datetime', { static: true }) datetime!: IonDatetime;

  AttendanceTrackingList: any;
  currentAttendance: boolean = false;
  isShownOutTime: boolean = false;
  @ViewChild('in_time', { static: true }) in_time!: IonAccordionGroup;
  @ViewChild('starttime', { static: true }) starttime!: IonDatetime;

  inTime: any;
  @ViewChild('out_time', { static: true }) out_time!: IonAccordionGroup;
  @ViewChild('endtime', { static: true }) endtime!: IonDatetime;
  outTime: any;
  isRecommenderRule: boolean = false;
  isEmployeeLine: boolean = false;
  isView: boolean = false;
  employeeList: any[] = [];
  oEmployee: any;

  constructor(
    private formbulider: FormBuilder,
    private regService: RegularizationService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private store: Store,
    private router: Router
  ) {
    this.formInit();
  }

  ionViewWillEnter(): void {
    this.formInit();
  }
  ionViewDidEnter(): void {
    this.store.dispatch([new UpdateHeader('Apply New Regularization', false, '')]);
    const param = this.route.snapshot.paramMap.get('key');

    if (param) {
      const action = Number(param);
      this.isView = true;
      this.isApplyMode = false;
      this.applicationView(action);
    }
    else {
      this.isView = false;
      this.isApplyMode = true;
      this.AttendanceRegularizationForm.reset();
    }
  }
  ionViewDidLeave(): void {

  }
  ionViewWillLeave(): void {

  }

  formInit() {
    this.AttendanceRegularizationForm = this.formbulider.group({
      employee_id: new FormControl(null),
      employee_name: new FormControl(null),
      attendance_regularization_id: new FormControl(0),
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
      approve_employee_name: new FormControl(null)

    });

    this.setUserCategoryValidators();

    this.getEmployee();
    this.loadAllShift();
  }
  inTimeCheck() {

    this.toggleAccordion1();
    this.inTime = this.AttendanceRegularizationForm.controls['in_time'].value ? this.datePipe.transform(new Date(this.AttendanceRegularizationForm.controls['in_time'].value), ' h:mm:ss a').toString() : '';

  }
  outTimeCheck() {
    this.toggleAccordion2();
    this.outTime = this.AttendanceRegularizationForm.controls['out_time'].value ? this.datePipe.transform(new Date(this.AttendanceRegularizationForm.controls['out_time'].value), ' h:mm:ss a').toString() : '';

  }
  getEmployee() {
    this.regService.getEmployeeForSelfService().subscribe(oData => {
      this.oEmployee = oData;

      this.AttendanceRegularizationForm.controls['employee_id'].setValue(this.oEmployee.employee_id);
      this.AttendanceRegularizationForm.controls['employee_name'].setValue(this.oEmployee.employee_id);

      //if (this.oEmployee != null) { this.loadAttReg(); }
    });
  }
  setUserCategoryValidators() {
    this.isShownInTime ? this.AttendanceRegularizationForm.controls['in_time'].setValidators([Validators.required]) : this.AttendanceRegularizationForm.controls['in_time'].setValidators(null);
    this.isShownInTime ? this.AttendanceRegularizationForm.controls['out_time'].setValidators([Validators.required]) : this.AttendanceRegularizationForm.controls['out_time'].setValidators(null);

    this.AttendanceRegularizationForm.controls['in_time'].updateValueAndValidity();
    this.AttendanceRegularizationForm.controls['out_time'].updateValueAndValidity();
  }
  loadAllShift() {
    this.regService.getShiftForDP().subscribe((data: any) => {
      this.allShifts = data;
    });
  }
  searchAttendance() {

    this.attDate = this.AttendanceRegularizationForm.controls['attendance_date'].value;
    this.toggleAccordion();

    const data = this.AttendanceRegularizationForm.value;
    data.employee_id = data.employee_id;
    data.shift_id = 0;
    data.attendance_date = this.attDate ? this.datePipe.transform(new Date(this.attDate), 'yyyy-MM-dd h:mm:ss a').toString() : this.attDate;
    this.inTime = '';
    this.outTime = '';
    data.in_time = '';
    data.out_time = '';
    data.is_apply_by_self = true;
    if (data.employee_id && data.attendance_date) {
      this.regService.getAttendanceData(data).subscribe((result: any) => {
        if (result && result.length && result[0].length) {
          this.AttendanceTrackingList = result[0];
          this.currentAttendance = true;

          this.AttendanceRegularizationForm.controls['shift_id'].setValue(this.AttendanceTrackingList[0]?.shift_id ?? 0);
          if (this.isShownInTime) {
            this.AttendanceRegularizationForm.controls['in_time'].setValue(new Date(data.attendance_date));

          }
          if (this.isShownOutTime) {
            this.AttendanceRegularizationForm.controls['out_time'].setValue(new Date(data.attendance_date));
          }
        }

      });
    }
    else {
      this.currentAttendance = false;
    }
  }
  onAllowIntime(event: any) {
    //this.isLeaveLeaveApplicationEdit = false;
    if (event.detail.checked) {
      const data = this.AttendanceRegularizationForm.value;
      this.isShownInTime = true;
      this.AttendanceRegularizationForm.controls['in_time'].setValue(new Date(data.attendance_date));
    }
    else {
      this.isShownInTime = false;
    }
  }

  onAllowOutTime(event: any) {
    // this.isLeaveLeaveApplicationEdit = false;
    if (event.detail.checked) {
      const data = this.AttendanceRegularizationForm.value;
      this.isShownOutTime = true;
      this.AttendanceRegularizationForm.controls['out_time'].setValue(new Date(data.attendance_date));

    }
    else {
      this.isShownOutTime = false;
    }
  }
  getEmployeeList() {
    let event = this.AttendanceRegularizationForm.controls['approve_employee_name'].value;

    this.regService.getApprovalListByEmp(event ?? '').subscribe((data: any) => {
      if (data) {
        data.forEach(function (e: any) {
          if (typeof e === "object") {
            e["field_name"] = 'approve_employee_name'
          }
        });
        this.employeeList = data;
        this.isEmployeeLine = true;
      }
      else if (data.MessageType == 3) {
        this.errMessage = data.CurrentMessage;
        return this.setOpen(true);
        //this.notifyService.ShowNotification(2, data.CurrentMessage);
      }
    });

  }
  selectEmployee(employee: any) {
    this.AttendanceRegularizationForm.controls['approve_employee_name'].setValue(employee.employee_name + "," + employee.official_info);
    this.AttendanceRegularizationForm.controls['req_approve_employee_id'].setValue(employee.employee_id);

    this.isEmployeeLine = false;

  }
  regularizationApply() {
    this.submitted = true;
    const data = this.AttendanceRegularizationForm.value;



    if (this.AttendanceRegularizationForm.invalid) {
      return;
    }
    data.attendance_regularization_id = data.attendance_regularization_id ?? 0;
    data.attendance_date = data.attendance_date ? this.datePipe.transform(new Date(data.attendance_date), 'yyyy-MM-dd h:mm:ss a').toString() : data.attendance_date;



    data.in_time = data.in_time ? this.datePipe.transform(new Date(data.in_time), 'yyyy-MM-dd HH:mm a').toString() : '';
    data.out_time = data.out_time ? this.datePipe.transform(new Date(data.out_time), 'yyyy-MM-dd HH:mm a').toString() : '';

    const time = data.in_time ? data.in_time.split(' ')[1] : '';
    if (time) {
      const newDateTime = data.attendance_date.split(' ')[0] + ' ' + time;
      data.in_time = newDateTime;
    }
    const time1 = data.out_time ? data.out_time.split(' ')[1] : '';;
    if (time1) {
      const newDateTime1 = data.attendance_date.split(' ')[0] + ' ' + time1;
      data.out_time = newDateTime1;
    }
    data.is_early_consider = data.is_early_consider ?? false;
    data.is_late_consider = data.is_late_consider ?? false;
    data.make_absent = data.make_absent ?? false;

    data.is_apply_by_self = true;
    this.regService.applyBySelf(data).subscribe((result: any) => {
      this.errMessage = result.CurrentMessage;
      this.setOpen(true);
      if (result.MessageType == 1) {
        this.formInit();
        this.resetForm();
        this.submitted = false;
        this.router.navigate(['/regularization']);
      }
    });
  }

  checkRuleForRecommenderApprover() {
    this.isRecommenderRule = true;
  }
  cancel() {
    this.isRecommenderRule = false;
    this.isEmployeeLine = false;
  }
  close() {
    this.resetForm();
    this.router.navigate(['/regularization']);
  }
  applicationView(key: number) {
    this.resetForm();
    this.regService.getById(key).subscribe((data: any) => {
      console.log(Object.keys(this.AttendanceRegularizationForm.value));
      for (const key of Object.keys(this.AttendanceRegularizationForm.value)) {
        const val = data[key] ?? null;
        if (key == 'attendance_date') {
          this.AttendanceRegularizationForm.controls[key].setValue((new Date(val)));
          this.attDate = new Date(val);
        }
        else if (key == 'in_time' || key == 'out_time') {
          this.AttendanceRegularizationForm.controls[key].setValue(val ? (new Date(val).toLocaleTimeString()) : '');
          if (key == 'in_time' && val) {
            this.AttendanceRegularizationForm.controls['show_in_time'].setValue(true);
            this.AttendanceRegularizationForm.controls['is_InTime'].setValue(true);
            this.isShownInTime = true;
            this.inTime = new Date(val).toLocaleTimeString();
          }
          if (key == 'out_time' && val) {
            this.AttendanceRegularizationForm.controls['show_out_time'].setValue(true);
            this.AttendanceRegularizationForm.controls['is_OutTime'].setValue(true);
            this.isShownOutTime = true;
            this.outTime = new Date(val).toLocaleTimeString();
          }
        }

        else if (key == 'is_InTime' || key == 'show_in_time' || key == 'show_out_time' || key == 'is_OutTime') {

        }
        else {
          this.AttendanceRegularizationForm.controls[key].setValue(val ?? '');
        }
      }
      this.isApplyMode = false;
      this.AttendanceRegularizationForm.disable();
      this.store.dispatch([new UpdateHeader('View Regularization', false, '')]);
    });


    // this.tpAction.setView(this.nAttendanceRegularizationId);
  }
  toggleAccordion = () => {
    const nativeEl = this.att_date;
    if (nativeEl.value === 'att') {
      nativeEl.value = undefined;
    } else {
      nativeEl.value = 'att';
    }

  };
  toggleAccordion1 = () => {
    const nativeEl = this.in_time;
    if (nativeEl.value === 'in') {
      nativeEl.value = undefined;
    } else {
      nativeEl.value = 'in';
    }

  };
  toggleAccordion2 = () => {
    const nativeEl = this.out_time;
    if (nativeEl.value === 'out') {
      nativeEl.value = undefined;
    } else {
      nativeEl.value = 'out';
    }

  };
  doRefresh(event: any) {

    setTimeout(() => {
      this.resetForm();
      event.target.complete();
      const param = this.route.snapshot.paramMap.get('key');

      if (param) {
        const action = Number(param);
        this.isView = true;
        this.isApplyMode = false;
        this.applicationView(action);
      }
      else {
        this.isView = false;
        this.isApplyMode = true;
        this.AttendanceRegularizationForm.reset();
      }


    }, 1000);
  }
  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
  resetForm() {
    this.AttendanceRegularizationForm.enable();
    this.AttendanceRegularizationForm.reset();
    this.formInit();
    this.submitted = false;
    this.isShownInTime = false;
    this.isShownOutTime = false;
    this.attDate = '';
    this.AttendanceTrackingList = [];
    this.inTime = '';
    this.outTime = '';
  }
}
