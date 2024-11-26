import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonAccordionGroup, IonDatetime, IonModal, ViewDidEnter, ViewDidLeave, ViewWillEnter, ViewWillLeave, } from '@ionic/angular';
import { Observable, Subject, takeUntil } from 'rxjs';
import { LeaveService } from '../../services/leave.service';
import { ConfirmServiceService } from '../../components/confirm-service.service';
import { Select, Store } from '@ngxs/store';
import { UpdateHeader, UserState } from '../../states/user-state';
import { Filesystem, FilesystemDirectory } from '@capacitor/filesystem';
import { DatePipe } from '@angular/common';
import { FileOpener } from '@ionic-native/file-opener/ngx';
@Component({
  selector: 'app-leave-application',
  templateUrl: './leave-application.page.html',
  styleUrls: ['./leave-application.page.scss'],
})
export class LeaveApplicationPage implements ViewDidEnter, ViewWillEnter, ViewWillLeave, ViewDidLeave {
  dead$ = new Subject();
  @Select(UserState.getEmployee)
  employee$!: Observable<any>;

  @Select(UserState.getLeaveLedger)
  leaveLedger$!: Observable<any>;

  LeaveApplicationForm: FormGroup = new FormGroup({});
  LeavePolicyForm: FormGroup = new FormGroup({});
  LeaveDurationForm: FormGroup = new FormGroup({});
  isToastOpen = false;
  errMessage: string = '';
  submitted: boolean = false;
  isShownIsHourlyLeave: boolean = false;
  isShownResponsilbleRequired: boolean = false;
  isShowRecommender: boolean = false;
  isShownAttachmentRequired: boolean = false;
  isShownAreaRequired: boolean = false;
  isShownRequiredPurpose: boolean = false;
  isShowSendMail: boolean = false;
  isleaveApplicationView: boolean = false;
  isLeaveLeaveApplicationEdit: boolean = false;
  leaveLedgerDetails: any[] = [];
  leavepolicyDetails: any[] = [];
  attendanceTrackingList: any[] = [];
  startDate: any;
  endDate: any;
  @ViewChild('start_date', { static: true }) start_date!: IonAccordionGroup;
  @ViewChild('end_date', { static: true }) end_date!: IonAccordionGroup;
  @ViewChild('startdate', { static: true }) startdate!: IonDatetime;
  @ViewChild('enddate', { static: true }) enddate!: IonDatetime;

  startTime: any;
  endTime: any;
  @ViewChild('start_time', { static: true }) start_time_toggle!: IonAccordionGroup;
  @ViewChild('end_time', { static: true }) end_time_toggle!: IonAccordionGroup;
  @ViewChild('starttime', { static: true }) starttime!: IonDatetime;
  @ViewChild('endtime', { static: true }) endtime!: IonDatetime;

  isShownTimePicker: boolean = false;
  isshownConfirmApply: boolean = false;
  isshownConfirmDraft: boolean = false;
  leaveDurationDisplay: boolean = false;
  attendanceHistoryDisplay: boolean = false;
  isAcknowldgeShow: boolean = false;

  isleavePolicyModal: boolean = false;
  isAttdenceSummary: boolean = false;
  isRecommenderRule: boolean = false;
  isEmployeeLine: boolean = false;
  isShownAttachmentName: boolean = false;
  employeeList: any[] = [];
  fileToUpload: File | null = null;
  param_leave_id: any;


  isConfirmAlert: boolean = false;
  isLoanApply: boolean = false;
  isApplyMode: boolean = false;
  action: number = 0;


  constructor(private router: Router, private store: Store, private formbulider: FormBuilder, private leaveService: LeaveService, private route: ActivatedRoute, private confirmAlert: ConfirmServiceService, private date: DatePipe) {

    this.formInit();
  }

  ionViewWillEnter(): void {
    this.isShownAttachmentName = false;
    this.employee$.pipe(takeUntil(this.dead$)).subscribe((data) => {
      if (data) {
        if (data != null) {
          this.LeaveApplicationForm.controls['employee_name'].setValue(data.employeeDetails);
          this.LeaveApplicationForm.controls['employee_id'].setValue(data.employee_id);
          this.LeaveApplicationForm.controls['company_id'].setValue(data.company_id);
        }
        else {
          this.errMessage = "You are not eligible to apply own leave application.";
          this.setOpen(true);
        }
      }
    });
    this.leaveLedger$.pipe(takeUntil(this.dead$)).subscribe((data) => {
      if (data) {
        this.leaveLedgerDetails = data;
      }
    });

  }
  ionViewDidEnter(): void {
    const param = this.route.snapshot.queryParamMap.get('approvals');
    const param1 = this.route.snapshot.queryParamMap.get('action');
    if (param && param1) {
      this.isApplyMode = false;
      this.param_leave_id = param;
      this.action = Number(param1);

      this.applicationViewById(this.param_leave_id, this.action);
    }
    else {
      this.isApplyMode = true;
      this.store.dispatch([new UpdateHeader('Apply New Leave', false, '')]);
    }
  }
  ionViewWillLeave() {
    console.log('ionViewWillLeave event fired');
  }
  ionViewDidLeave() {
    this.dead$.next('');
    this.dead$.unsubscribe();
  }

  // getEmployee() {
  //   this.leaveService.getEmployeeForSelfService().subscribe((data: any) => {
  //     if (data != null) {
  //       this.LeaveApplicationForm.controls['employee_name'].setValue(data.employeeDetails);
  //       this.LeaveApplicationForm.controls['employee_id'].setValue(data.employee_id);
  //       this.LeaveApplicationForm.controls['company_id'].setValue(data.company_id);
  //       this.getEmployeeLeaveLedger(data.employee_id);
  //     } else {
  //       this.errMessage = "You are not eligible to apply own leave application.";
  //        this.setOpen(true);
  return;
  //       //this.notifyService.ShowNotification(2, "You are not eligible to apply own leave application.");   // because a user can't apply own leave application', only employee can apply
  //     }

  //   });
  // }
  // getEmployeeLeaveLedger(employee_id: any) {
  //   this.leaveService.getEmployeeLeaveLedger(employee_id).subscribe((data: any) => {
  //     this.leaveLedgerDetails = data;
  //   });
  // }
  formInit() {
    this.LeaveApplicationForm = this.formbulider.group({
      leave_application_id: new FormControl(0),
      employee_id: new FormControl('', [Validators.required]),
      employee_name: new FormControl(''),
      company_id: new FormControl(''),
      employee_leave_ledger_id: new FormControl('', [Validators.required]),
      recommend_employee_name: new FormControl(''),
      req_recommend_employee_id: new FormControl(0),
      responsible_employee_name: new FormControl(''),
      req_responsible_employee_id: new FormControl(''),
      approve_employee_name: new FormControl(''),
      req_approve_employee_id: new FormControl('', [Validators.required]),
      purpose: new FormControl(''),
      enjoyable_area: new FormControl(''),
      responsibile_employee_responsibility: new FormControl(''),
      attachment_path: new FormControl(''),
      remarks: new FormControl('N/A'),
      duration_days: new FormControl(0, [Validators.required]),
      duration_min: new FormControl(0, [Validators.required]),
      start_date: new FormControl(new Date(new Date().setHours(12, 0, 0, 0)).toISOString(), [Validators.required]),
      end_date: new FormControl(new Date(new Date().setHours(12, 0, 0, 0)).toISOString(), [Validators.required]),
      is_hourly: new FormControl(false),
      is_half_day: new FormControl(false),
      start_time: ["00:00", [Validators.required]],
      end_time: ["00:00", [Validators.required]],
      is_send_email: new FormControl(false),
      is_acknowledge_required: new FormControl(false),
      attachment_name: new FormControl(''),
      FileUpload: new FormControl(''),
    });
    this.LeavePolicyForm = this.formbulider.group({
      max_enjoyable_limit_min: new FormControl('', [Validators.required]),
      is_allow_sandwich: new FormControl('', [Validators.required]),
      notice_required_for_min: new FormControl('', [Validators.required]),
      is_prefix: new FormControl(false, [Validators.required]),
      is_sufix: new FormControl(false, [Validators.required]),
      notice_period: new FormControl('', [Validators.required]),
      encash_leave_balance_limit_min: new FormControl('', [Validators.required]),
      is_negetive_balance: new FormControl('', [Validators.required]),

    });
    this.LeaveDurationForm = this.formbulider.group({
      start_date: new FormControl('', [Validators.required]),
      end_date: new FormControl('', [Validators.required]),
      leave_duration_day: new FormControl('', [Validators.required]),
      leave_duration_min: new FormControl('', [Validators.required]),
    });
    // this.setUserCategoryValidators();
  }
  setUserCategoryValidators() {
    const enjoyable_area = this.LeaveApplicationForm.get('enjoyable_area');
    const purpose = this.LeaveApplicationForm.get('purpose');
    const req_responsible_employee_id = this.LeaveApplicationForm.get('req_responsible_employee_id');
    const FileUpload = this.LeaveApplicationForm.get('FileUpload');
    const responsibile_employee_responsibility = this.LeaveApplicationForm.get('responsibile_employee_responsibility');
    if (enjoyable_area) {
      this.isShownAreaRequired ? enjoyable_area.setValidators([Validators.required]) : enjoyable_area.clearValidators();
      enjoyable_area.updateValueAndValidity();
    }
    if (FileUpload) {
      if (this.isShownAttachmentRequired && !this.isLeaveLeaveApplicationEdit) {
        FileUpload.setValidators([Validators.required])
      }
      else {
        FileUpload.clearValidators();
      }
      FileUpload.updateValueAndValidity();
    }
    if (purpose) {
      this.isShownRequiredPurpose ? purpose.setValidators([Validators.required]) : purpose.clearValidators();
      purpose.updateValueAndValidity();
    }
    if (req_responsible_employee_id && responsibile_employee_responsibility) {
      if (this.isShownResponsilbleRequired) {
        req_responsible_employee_id.setValidators([Validators.required]),
          responsibile_employee_responsibility.setValidators([Validators.required])
      }
      else {
        req_responsible_employee_id.clearValidators();
        responsibile_employee_responsibility.clearValidators();
      }
      req_responsible_employee_id.updateValueAndValidity();
      responsibile_employee_responsibility.updateValueAndValidity();
    }
  }
  onLeaveLedgerChange(event: any) {
    const data = this.LeaveApplicationForm.value;
    this.resetForm();
    this.LeaveApplicationForm.controls['employee_leave_ledger_id'].setValue(data.employee_leave_ledger_id);
    this.LeaveApplicationForm.controls['employee_name'].setValue(data.employee_name);
    this.LeaveApplicationForm.controls['employee_id'].setValue(data.employee_id);
    this.LeaveApplicationForm.controls['company_id'].setValue(data.company_id);
  }
  onTimeChange(key: string) {
    if (key == 'start') {
      this.startTime = this.LeaveApplicationForm.controls['start_time'].value ?? "00:00";
      this.toggleAccordion3();
    }
    if (key == 'end') {
      this.endTime = this.LeaveApplicationForm.controls['end_time'].value ?? "00:00";
      this.toggleAccordion4();
    }
    this.onDateChange('');
  }
  onDateChange(key: string) {
    if (key == 'start') {
      this.startDate = this.LeaveApplicationForm.controls['start_date'].value;
      this.toggleAccordion();
    }
    if (key == 'end') {
      this.endDate = this.LeaveApplicationForm.controls['end_date'].value;
      this.toggleAccordion2();
    }
    const data = this.LeaveApplicationForm.value;
    if (!data.employee_leave_ledger_id) {
      if (this.action !== 2) {
        this.errMessage = "Please Select Leave Type.";
        this.setOpen(true);
        return;
      }
    }
    this.LeaveApplicationForm.controls['duration_min'].setValue(0);
    this.LeaveApplicationForm.controls['duration_days'].setValue(0);


    if (data.start_time && data.end_time && (data.is_hourly || data.is_half_day)) {
      let totalHour = this.getTotalHour(data.start_time, data.end_time) > 0 ? this.getTotalHour(data.start_time, data.end_time) : 0;
      this.LeaveApplicationForm.controls['duration_days'].setValue((totalHour / 8.0).toFixed(2));
      this.LeaveApplicationForm.controls['duration_min'].setValue((totalHour).toFixed(2));
    }
    else if (this.startDate && this.endDate && (!data.is_hourly || !data.is_half_day)) {
      let totalday = this.getDifferenceInDays(this.startDate, this.endDate);
      totalday = totalday < 0 ? 0 : totalday;
      //this.LeaveApplicationForm.controls['end_date'].value
      this.LeaveApplicationForm.controls['duration_days'].setValue(totalday.toFixed(2));
      this.LeaveApplicationForm.controls['duration_min'].setValue((totalday * 8.0).toFixed(2));
    }
    let employee_leave_ledger_id = this.LeaveApplicationForm.value.employee_leave_ledger_id;
    this.leavepolicyDetails = this.leaveLedgerDetails.filter(
      policy => policy.EmployeeLeaveLedgerId === employee_leave_ledger_id);
    if (this.leavepolicyDetails && this.leavepolicyDetails.length) {
      this.isShowRecommender = this.leavepolicyDetails[0].is_recommendar_required ? true : false;
      this.leaveService.getLeavePolicyById(this.leavepolicyDetails[0]?.LeavePolicyId ?? 0).subscribe(data => {

        // this.LeaveApplicationForm.controls['start_time'].setValue("00:00");
        // this.LeaveApplicationForm.controls['end_time'].setValue("00:00");
        this.LeaveApplicationForm.controls['purpose'].setValue(null);
        this.LeaveApplicationForm.controls['FileUpload'].setValue('');
        this.LeaveApplicationForm.controls['enjoyable_area'].setValue('');
        this.LeaveApplicationForm.controls['responsibile_employee_responsibility'].setValue('')
        this.LeaveApplicationForm.controls['responsible_employee_name'].setValue(null);
        this.LeaveApplicationForm.controls['req_responsible_employee_id'].setValue(0);

        data.is_hourly ? this.isShownIsHourlyLeave = true : this.isShownIsHourlyLeave = false;
        data.is_attachment_required && data.attachment_required_for_min <= this.LeaveApplicationForm.value.duration_min * 60.0 ? this.isShownAttachmentRequired = true : this.isShownAttachmentRequired = false;
        data.is_required_purpose && data.purpose_required_for_min <= this.LeaveApplicationForm.value.duration_min * 60.0 ? this.isShownRequiredPurpose = true : this.isShownRequiredPurpose = false;
        data.is_responsible_person_required && data.responsible_person_required_for_min <= this.LeaveApplicationForm.value.duration_min * 60.0 ? this.isShownResponsilbleRequired = true : this.isShownResponsilbleRequired = false;
        data.is_leave_area_required && data.area_required_for_min <= this.LeaveApplicationForm.value.duration_min * 60.0 ? this.isShownAreaRequired = true : this.isShownAreaRequired = false;
        this.LeaveApplicationForm.controls['is_send_email'].setValue(data.is_send_email);
        this.LeaveApplicationForm.controls['is_acknowledge_required'].setValue(data.is_acknowledge_required);

        this.setUserCategoryValidators();
      });
    }


  }
  getTotalHour(startTime: any, endTime: any) {
    let startDateTime = new Date("01/01/2000 " + startTime);
    let endDateTime = new Date("01/01/2000 " + endTime);
    return (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 3600);

  }
  getDifferenceInDays(date1: string, date2: string) {
    const dt1 = new Date(date1);
    const dt2 = new Date(date2);
    const diffInMs = Math.abs(dt2.getTime() - dt1.getTime());
    return (dt2 >= dt1) ? Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) + 1 : 0;
  }
  doRefresh(event: any) {
    setTimeout(() => {

      event.target.complete();
    }, 1000);
  }
  viewLeavePolicy() {

    let employee_leave_ledger_id = this.LeaveApplicationForm.get('employee_leave_ledger_id')?.value;
    this.leavepolicyDetails = this.leaveLedgerDetails.filter(
      policy => policy.EmployeeLeaveLedgerId === employee_leave_ledger_id);
    if (this.leavepolicyDetails && this.leavepolicyDetails.length) {
      this.leaveService.getLeavePolicyById(this.leavepolicyDetails[0]?.LeavePolicyId ?? 0).subscribe(data => {
        this.LeavePolicyForm.controls['max_enjoyable_limit_min'].setValue((data.max_enjoyable_limit_min / 480.0) + " days");
        this.LeavePolicyForm.controls['notice_period'].setValue(data.notice_period + " days");
        this.LeavePolicyForm.controls['encash_leave_balance_limit_min'].setValue(data.encash_leave_balance_limit_min / 480.0);
        this.LeavePolicyForm.controls['notice_required_for_min'].setValue(data.notice_required_for_min / 480.0);
        this.LeavePolicyForm.controls['is_prefix'].setValue(data.is_prefix ? "Yes" : "No");
        this.LeavePolicyForm.controls['is_sufix'].setValue(data.is_sufix ? "Yes" : "No");
        this.LeavePolicyForm.controls['is_allow_sandwich'].setValue(data.is_allow_sandwich ? "Yes" : "No");
        this.LeavePolicyForm.controls['is_negetive_balance'].setValue(data.is_negetive_balance ? "Yes" : "No");
      });
    }


    this.isleavePolicyModal = true;

  }
  viewAttendanceHistory() {
    const data = this.LeaveApplicationForm.value;
    if (!data.employee_id) {
      this.errMessage = "Employee is required.";
      this.setOpen(true);
      return;

    }
    if (!data.start_date) {
      this.errMessage = "Leave start date is required.";
      this.setOpen(true);
      return;

    }
    if (!data.end_date) {
      this.errMessage = "Leave end date is required.";
      this.setOpen(true);
      return;

    }

    data.start_date = data.start_date != null ? new Date(data.start_date).toLocaleDateString() : data.start_date;
    data.end_date = data.end_date != null ? new Date(data.end_date).toLocaleDateString() : data.end_date;
    if (data.employee_id && data.start_date && data.end_date) {
      this.leaveService.getAttendanceDataByEmployeeandDate(data.employee_id, data.start_date, data.end_date, data.company_id).subscribe(result => {
        if (result && result.AttendanceInfo) {
          this.attendanceTrackingList = result.AttendanceInfo;
          this.attendanceHistoryDisplay = true;
        }

      });
    }
    this.isAttdenceSummary = true;

  }
  onHalfDayChange(e: any) {
    this.LeaveApplicationForm.controls['duration_min'].setValue(0);
    this.LeaveApplicationForm.controls['duration_days'].setValue(0);
    this.LeaveApplicationForm.controls['start_time'].setValue("00:00");
    this.LeaveApplicationForm.controls['end_time'].setValue("00:00");
    if (e.detail?.checked) {
      this.isShownTimePicker = true;
    }
    else {
      this.isShownTimePicker = false;
    }
  }

  documentFormFileInput(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileSizeLimit = 1000000; // 1MB
      const allowedExtensions = ['pdf', 'jpeg', 'jpg', 'tiff', 'tif'];

      // Check file size
      if (file.size > fileSizeLimit) {
        this.errMessage = 'File is too big! Max size 1MB.';
        this.setOpen(true);
        return;
      }

      // Check file extension
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        this.errMessage = 'Invalid file type! Accepted types are: PDF, JPEG, TIFF.';
        this.setOpen(true);
        return;
      }

      // If all checks pass, set the file to upload
      this.fileToUpload = file;
      this.errMessage = ''; // Clear any previous error messages
    }
  }
  checkRuleForRecommenderApprover() {
    this.isRecommenderRule = true;
  }
  getEmployeeList(des: string) {
    let event: any;
    if (des == 'approve_employee_name') {
      event = this.LeaveApplicationForm.controls['approve_employee_name'].value;
    }
    if (des == 'recommend_employee_name') {
      event = this.LeaveApplicationForm.controls['recommend_employee_name'].value;
    }



    let fieldName = des;

    let employee_leave_ledger_id = this.LeaveApplicationForm.value.employee_leave_ledger_id;
    if (employee_leave_ledger_id) {
      this.leavepolicyDetails = this.leaveLedgerDetails.filter(
        policy => policy.EmployeeLeaveLedgerId === employee_leave_ledger_id);
    } else {
      this.errMessage = "Please select leave.";
      this.setOpen(true);
      return;

    }


    const data = this.LeaveApplicationForm.value;

    this.leaveService.getEmployeeAsApproverByNameOrCode(event ?? '', this.leavepolicyDetails[0]?.LeavePolicyId ?? 0, data.employee_id, fieldName).subscribe(data => {
      if (data.MessageType == 1) {
        data.Data.forEach(function (e: any) {
          if (typeof e === "object") {
            e["field_name"] = fieldName
          }
        });
        this.employeeList = data.Data;
        this.isEmployeeLine = true;
      }
      else if (data.MessageType == 3) {
        this.errMessage = data.CurrentMessage;
        this.setOpen(true);
        return;

      }
    });


  }
  getResponsibleEmployeeList() {
    let fieldName = 'responsible_employee_name';
    let event = this.LeaveApplicationForm.controls['responsible_employee_name'].value;
    this.leaveService.getAllEmployeeAsApproverByNameOrCode(event ?? '').subscribe(data => {
      data.forEach(function (e: any) {
        if (typeof e === "object") {
          e["field_name"] = fieldName
        }
      });
      this.employeeList = data;
      this.isEmployeeLine = true;
    });
  }
  selectEmployee(employee: any) {
    if (employee.field_name == 'responsible_employee_name') {
      this.LeaveApplicationForm.controls['responsible_employee_name'].setValue(employee.employee_name + "," + employee.official_info);
      this.LeaveApplicationForm.controls['req_responsible_employee_id'].setValue(employee.employee_id);
    }
    if (employee.field_name == 'recommend_employee_name') {
      this.LeaveApplicationForm.controls['recommend_employee_name'].setValue(employee.employee_name + "," + employee.official_info);
      this.LeaveApplicationForm.controls['req_recommend_employee_id'].setValue(employee.employee_id);
    }
    if (employee.field_name == 'approve_employee_name') {
      this.LeaveApplicationForm.controls['approve_employee_name'].setValue(employee.employee_name + "," + employee.official_info);
      this.LeaveApplicationForm.controls['req_approve_employee_id'].setValue(employee.employee_id);
    }

    this.isEmployeeLine = false;

  }
  showBasicDialog() {
    this.LeaveApplicationForm.valid;
    this.isShownAttachmentName = false;
    this.resetForm();
    this.isShowRecommender = false;
  }
  checkApply() {

    this.submitted = true;
    const data = this.LeaveApplicationForm.value;
    (!data.req_responsible_employee_id) ? data.req_responsible_employee_id = 0 : data.req_responsible_employee_id = data.req_responsible_employee_id;
    (!data.req_recommend_employee_id) ? data.req_recommend_employee_id = 0 : data.req_recommend_employee_id = data.req_recommend_employee_id;

    this.setUserCategoryValidators();

    if (this.LeaveApplicationForm.invalid) {
      return;
    }
    if (data.is_hourly || data.is_half_day) {

      if (data.start_date > data.end_date || data.start_date < data.end_date) {
        this.errMessage = "Leave start date and end date must be same";
        return this.setOpen(true);

      }
      return this.leaveApply();
    }
    if (this.dateValidationCheck(data.start_date, data.end_date)) {
      this.errMessage = "Leave end date must be greater than leave start date";
      return this.setOpen(true);

    }
    this.isshownConfirmApply = true;
    this.isshownConfirmDraft = false;
    if (this.checkLeaveDuration()) {
      return this.leaveApply();
    }

  }

  checkDraft() {
    this.submitted = true;
    const data = this.LeaveApplicationForm.value;
    (!data.req_responsible_employee_id) ? data.req_responsible_employee_id = 0 : data.req_responsible_employee_id = data.req_responsible_employee_id;
    (!data.req_recommend_employee_id) ? data.req_recommend_employee_id = 0 : data.req_recommend_employee_id = data.req_recommend_employee_id;

    this.setUserCategoryValidators();

    if (this.LeaveApplicationForm.invalid) {
      return;
    }

    if (data.is_hourly || data.is_half_day) {
      if (data.start_date > data.end_date || data.start_date < data.end_date) {
        this.errMessage = "Leave start date and end date must be same";
        return this.setOpen(true);
      }
      return this.leaveDraft();
    }
    if (this.dateValidationCheck(data.start_date, data.end_date)) {
      this.errMessage = "Leave end date must be greater than leave start date";
      return this.setOpen(true);

    }
    this.isshownConfirmApply = false;
    this.isshownConfirmDraft = true;

    if (this.checkLeaveDuration()) {
      return this.leaveDraft();
    }

  }
  goBack() {
    this.resetForm();
    this.router.navigate(['/leave']);
  }
  async leaveApply() {
    this.submitted = true;
    const data = this.LeaveApplicationForm.value;
    (!data.req_responsible_employee_id) ? data.req_responsible_employee_id = 0 : data.req_responsible_employee_id = data.req_responsible_employee_id;
    (!data.req_recommend_employee_id) ? data.req_recommend_employee_id = 0 : data.req_recommend_employee_id = data.req_recommend_employee_id;

    if (this.LeaveApplicationForm.invalid) {
      return;
    }
    if (this.dateValidationCheck(data.start_date, data.end_date)) {
      this.errMessage = "End date must be greater than start date";
      return this.setOpen(true);

    }
    if (data.duration_min == 0) {
      this.errMessage = "Leave duration can't be 0";
      return this.setOpen(true);
    }

    let formData = new FormData();
    for (const key of Object.keys(this.LeaveApplicationForm.value)) {
      const value = this.LeaveApplicationForm.value[key];

      if (key == "start_date") {
        let date = new Date(value).toLocaleString();
        formData.append("start_date", date);
      }
      if (key == "end_date") {
        if (value != null) {
          let date = new Date(value).toLocaleString();
          formData.append("end_date", date);
        }

      }
      else if (key == "FileUpload") {
        if (this.fileToUpload) {
          formData.append(key, value);
          formData.append("FileUpload", this.fileToUpload);
        }
      }
      else {
        if (value != null) {
          formData.append(key, value);
        }
      }
    }
    let confirm = await this.confirmAlert.confirmClick('Do you want to proceed this application?');

    if (confirm) {
      this.leaveService.apply(formData).subscribe(
        (result: any) => {
          this.errMessage = result.CurrentMessage;
          this.setOpen(true);
          if (result.MessageType == 1) {
            this.resetForm();
            this.submitted = false;
            this.router.navigate(['/leave']);
          }
          this.submitted = false;
        });
    }
    else {
      this.start_date.value = undefined;
      this.end_date.value = undefined;
      this.start_time_toggle.value = undefined;
      this.end_time_toggle.value = undefined;
    }
  }

  async leaveDraft() {

    this.submitted = true;
    const data = this.LeaveApplicationForm.value;
    (!data.req_responsible_employee_id) ? data.req_responsible_employee_id = 0 : data.req_responsible_employee_id = data.req_responsible_employee_id;
    (!data.req_recommend_employee_id) ? data.req_recommend_employee_id = 0 : data.req_recommend_employee_id = data.req_recommend_employee_id;


    if (this.LeaveApplicationForm.invalid) {
      return;
    }
    if (this.dateValidationCheck(data.start_date, data.end_date)) {
      this.errMessage = "End date must be greater than start date";
      return this.setOpen(true);

    }


    let formData = new FormData();
    for (const key of Object.keys(this.LeaveApplicationForm.value)) {
      const value = this.LeaveApplicationForm.value[key];
      if (this.isLeaveLeaveApplicationEdit && key == "leave_application_id") {
        // formData.append("leave_application_id", this.rowData.leave_application_id);
      }
      if (key == "start_date") {
        let date = new Date(value).toLocaleString();
        formData.append("start_date", date);
      }
      if (key == "end_date") {
        if (value != null) {
          let date = new Date(value).toLocaleString();
          formData.append("end_date", date);
        }

      }
      else if (key == "FileUpload") {
        if (this.fileToUpload) {
          formData.append("FileUpload", this.fileToUpload);
        }
      }
      else {
        if (value != null) {
          formData.append(key, value);
        }
      }
    }
    let confirm = await this.confirmAlert.confirmClick('Do you want to proceed this application?');

    if (confirm) {
      this.leaveService.draft(formData).subscribe(
        result => {
          this.errMessage = result.CurrentMessage;
          this.setOpen(true);

          if (result.MessageType == 1) {
            this.resetForm();
            this.submitted = false;
            this.router.navigate(['/leave']);
          }
        });
    }
    else {
      this.start_date.value = undefined;
      this.end_date.value = undefined;
      this.start_time_toggle.value = undefined;
      this.end_time_toggle.value = undefined;
    }
  }
  // leaveCancel() {
  //     if (this.rowData == null) {
  //         //return this.notifyService.ShowNotification(2, 'Please select row');
  //     }
  //     this.leaveApplicationService.cancelForRequest(this.rowData.leave_application_id).subscribe(
  //         (result:any) => {
  //            // this.notifyService.ShowNotification(result.MessageType, result.CurrentMessage);
  //             if (result.MessageType == 1) {
  //                 this.leaveApplicationList.splice(this.leaveApplicationList.findIndex(item => item.leave_application_id === result.Data.leave_application_id), 1);
  //                 this.leaveApplicationList.unshift(result.Data);
  //                 this.rowData = result.Data;
  //                 this.selectedLeaveApplication = result.Data;

  //             }
  //         });
  // }
  dateValidationCheck(startDate: any, endDate: any) {

    return new Date(startDate) > new Date(endDate) ? true : false;
  }
  checkLeaveDuration(): boolean {
    const data = this.LeaveApplicationForm.value;
    this.leaveService.getLeaveDuration(data.employee_id, data.employee_leave_ledger_id, new Date(data.start_date), new Date(data.end_date)).subscribe(result => {
      this.LeaveDurationForm.controls['leave_duration_day'].setValue((result.leave_duration_day) + " days");
      this.LeaveDurationForm.controls['leave_duration_min'].setValue((result.leave_duration_min / 60) + " hrs");
      this.LeaveDurationForm.controls['start_date'].setValue((new Date(result.start_date)).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
      }).replace(/ /g, '-'));
      this.LeaveDurationForm.controls['end_date'].setValue(new Date(result.end_date).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
      }).replace(/ /g, '-'));
      this.LeaveApplicationForm.controls['duration_days'].setValue((result.leave_duration_day));
      this.LeaveApplicationForm.controls['duration_min'].setValue(result.leave_duration_min / 60);
      this.LeaveApplicationForm.controls['start_date'].setValue(new Date(result.start_date));
      this.LeaveApplicationForm.controls['end_date'].setValue(new Date(result.end_date));
    });
    this.leaveDurationDisplay = true;
    return true;
  }
  toggleAccordion = () => {
    const nativeEl = this.start_date;
    if (nativeEl.value === undefined) {
      nativeEl.value = 'start';
    } else {
      nativeEl.value = undefined;
    }

  };
  toggleAccordion2 = () => {
    const nativeEl2 = this.end_date;
    if (nativeEl2.value === undefined) {
      nativeEl2.value = 'end';
    } else {
      nativeEl2.value = undefined;
    }
  };
  toggleAccordion3 = () => {
    const nativeEl3 = this.start_time_toggle;
    if (nativeEl3) {
      if (nativeEl3.value === undefined) {
        nativeEl3.value = 'start_t';
      } else {
        nativeEl3.value = undefined;
      }
    }


  };
  toggleAccordion4 = () => {
    const nativeEl4 = this.end_time_toggle;
    if (nativeEl4) {
      if (nativeEl4.value === undefined) {
        nativeEl4.value = 'end_t';
      } else {
        nativeEl4.value = undefined;
      }
    }

  };

  applicationViewById(key: any, action: number) {
    this.LeaveApplicationForm.controls['leave_application_id'].setValue(key ?? 0);
    this.isleaveApplicationView = true;
    this.leaveApplicationGetById(key, action);
    //this.LeaveApplicationForm.controls['FileUpload'].disable();
    //this.LeaveApplicationForm.get('FileUpload').disable();
  }
  leaveApplicationGetById(leave_app_id: any, action: number = 0) {
    let leave_application_id = leave_app_id;

    this.leaveService.getLeaveApplicationById(leave_application_id).subscribe((data: any) => {

      this.LeaveApplicationForm.controls['employee_leave_ledger_id'].setValue(data.employee_leave_ledger_id ?? 0);
      this.LeaveApplicationForm.controls['is_hourly'].setValue(data.is_hourly);
      this.LeaveApplicationForm.controls['employee_id'].setValue(data.employee_id ?? 0);
      this.LeaveApplicationForm.controls['is_half_day'].setValue(data.is_half_day);
      this.LeaveApplicationForm.controls['start_date'].setValue(new Date(data.start_date ?? ''));
      this.startDate = data.start_date ?? '';
      this.LeaveApplicationForm.controls['end_date'].setValue(new Date(data.end_date ?? ''));
      this.endDate = data.end_date ?? '';
      this.LeaveApplicationForm.controls['start_time'].setValue((data.starttime ?? "00:00"));
      this.startTime = data.starttime ?? '';
      this.LeaveApplicationForm.controls['end_time'].setValue((data.endtime ?? "00:00"));
      this.endTime = data.endtime ?? '';
      this.LeaveApplicationForm.controls['duration_days'].setValue(data.duration_days ?? '');
      this.LeaveApplicationForm.controls['duration_min'].setValue((data.duration_min ?? 0) / 60);
      this.LeaveApplicationForm.controls['req_responsible_employee_id'].setValue(data.req_responsible_employee_id ?? '');
      this.LeaveApplicationForm.controls['req_recommend_employee_id'].setValue(data.req_recommend_employee_id ?? '');
      this.LeaveApplicationForm.controls['req_approve_employee_id'].setValue(data.req_approve_employee_id ?? '');
      this.LeaveApplicationForm.controls['enjoyable_area'].setValue(data.enjoyable_area ?? '');
      this.LeaveApplicationForm.controls['purpose'].setValue(data.purpose ?? '');
      this.LeaveApplicationForm.controls['employee_name'].setValue(data.employee_name ?? '');
      this.LeaveApplicationForm.controls['recommend_employee_name'].setValue(data.recommender_name ?? '');
      this.LeaveApplicationForm.controls['responsible_employee_name'].setValue(data.responsible_name ?? '');
      this.LeaveApplicationForm.controls['approve_employee_name'].setValue(data.approver_name ?? '');
      this.LeaveApplicationForm.controls['responsibile_employee_responsibility'].setValue(data.responsibile_employee_responsibility ?? '');
      this.LeaveApplicationForm.controls['remarks'].setValue(data.remarks ?? '');
      this.LeaveApplicationForm.controls['attachment_path'].setValue(data.attachment_path ?? '');
      this.LeaveApplicationForm.controls['attachment_name'].setValue(data.attachment_name ?? '');
      //data.attachment_name ? this.isShownAttachmentName = true : this.isShownAttachmentName = false;

      if (data.attachment_name == null || data.attachment_name == undefined || data.attachment_name == '' || data.attachment_name == 'null') {

        this.isShownAttachmentName = false;
      } else {

        this.isShownAttachmentName = true;
      }

      if (data.recommender_name == null || data.recommender_name == undefined || data.recommender_name == '' || data.recommender_name == 'null') {
        this.isShowRecommender = false;
      } else {
        this.isShowRecommender = true;
      }

      (data.is_hourly || data.is_half_day) ? this.isShownTimePicker = true : this.isShownTimePicker = false;

      this.leavepolicyDetails = this.leaveLedgerDetails.filter(
        policy => policy?.EmployeeLeaveLedgerId === data.employee_leave_ledger_id);
      if (this.leavepolicyDetails.length) {
        this.leaveService.getLeavePolicyById(this.leavepolicyDetails[0]?.LeavePolicyId ?? 0).subscribe(data => {
          data.is_hourly ? this.isShownIsHourlyLeave = true : this.isShownIsHourlyLeave = false;

          //data.is_required_purpose ? this.isShownRequiredPurpose = true : this.isShownRequiredPurpose = false;
          //data.is_responsible_person_required ? this.isShownResponsilbleRequired = true : this.isShownResponsilbleRequired = false;
          //data.is_leave_area_required ? this.isShownAreaRequired = true : this.isShownAreaRequired = false;
          data.is_attachment_required && data.attachment_required_for_min <= this.LeaveApplicationForm.value.duration_min * 60.0 ? this.isShownAttachmentRequired = true : this.isShownAttachmentRequired = false;
          data.is_required_purpose && data.purpose_required_for_min <= this.LeaveApplicationForm.value.duration_min * 60.0 ? this.isShownRequiredPurpose = true : this.isShownRequiredPurpose = false;
          data.is_responsible_person_required && data.responsible_person_required_for_min <= this.LeaveApplicationForm.value.duration_min * 60.0 ? this.isShownResponsilbleRequired = true : this.isShownResponsilbleRequired = false;
          data.is_leave_area_required && data.area_required_for_min <= this.LeaveApplicationForm.value.duration_min * 60.0 ? this.isShownAreaRequired = true : this.isShownAreaRequired = false;
          this.LeaveApplicationForm.controls['is_send_email'].setValue(data.is_send_email);
          this.LeaveApplicationForm.controls['is_acknowledge_required'].setValue(data.is_acknowledge_required);
        });
      }

      this.isLeaveLeaveApplicationEdit = true;
      if (action == 2) {
        this.store.dispatch([new UpdateHeader('View Leave Application', false, '')]);
        this.LeaveApplicationForm.disable();
        this.isApplyMode = false;
      }
      if (action == 1) {
        this.store.dispatch([new UpdateHeader('Update Leave Application', false, '')]);
        this.LeaveApplicationForm.enable();
        this.isApplyMode = true;
      }
      //this.header = "";
    });

  }
  blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result.split(',')[1]);
        } else {
          reject(new Error('FileReader result is not a string'));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
  }
  async downloadFile() {
    const data = this.LeaveApplicationForm.value;
    this.leaveService.downloadFile(data.attachment_path).subscribe(async (blob: any) => {
      const base64Data = await this.blobToBase64(blob);
      const fname = this.date.transform(new Date(), 'ddMMyyHHmmss') + '_' + data.attachment_name;
      const extension = fname.split('.').pop();


      const result = await Filesystem.writeFile({
        path: fname,
        data: base64Data,
        directory: FilesystemDirectory.Documents,
      });
      let fileOpener: FileOpener = new FileOpener();
      fileOpener.open(result.uri, this.getMimeType(extension))
        .then(() => console.log('File is opened'))
        .catch(e => console.log('Error opening file', e));
      await Filesystem.readFile({
        path: fname,
        directory: FilesystemDirectory.Documents
      });

      console.log(blob);
    });
  }
  getMimeType(extension: string): string {
    switch (extension.toLowerCase()) {
      case 'pdf':
        return 'application/pdf';
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'txt':
        return 'text/plain';
      default:
        return 'application/octet-stream';
    }
  }
  resetForm() {
    this.LeaveApplicationForm.enable();
    let emp_id = this.LeaveApplicationForm.controls['employee_id'].value;
    let emp_name = this.LeaveApplicationForm.controls['employee_name'].value;
    this.LeaveApplicationForm.reset();
    this.LeaveApplicationForm.controls['employee_name'].setValue(emp_name);
    this.LeaveApplicationForm.controls['employee_id'].setValue(emp_id);
    this.LeaveApplicationForm.controls['start_time'].setValue('00:00');
    this.LeaveApplicationForm.controls['end_time'].setValue('00:00');
    this.submitted = false;
    this.isLeaveLeaveApplicationEdit = false;
    this.isShownRequiredPurpose = false;
    this.isShownAreaRequired = false;
    this.isShownResponsilbleRequired = false;
    this.isShownAttachmentRequired = false;
    this.isShownIsHourlyLeave = false;
    this.isShownTimePicker = false;
    this.isshownConfirmApply = false;
    this.isshownConfirmDraft = false;
    this.isleaveApplicationView = false;
    this.leaveDurationDisplay = false;
    this.attendanceHistoryDisplay = false;
    this.startDate = '';
    this.endDate = '';
    this.startTime = '';
    this.endTime = '';
    //this.getEmployee();

  }
  cancel() {
    this.isAttdenceSummary = false;
    this.isleavePolicyModal = false;
    this.isRecommenderRule = false;
    this.isEmployeeLine = false;
  }


  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
}

