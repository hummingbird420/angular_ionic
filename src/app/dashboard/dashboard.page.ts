import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject, catchError, from, map, takeUntil } from 'rxjs';
import { UserInfo } from '../classes/user-info';
import { DashboardService } from '../services/dashboard.service';
import { Filesystem, FilesystemDirectory } from '@capacitor/filesystem';
import * as Highcharts from 'highcharts';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { IonAccordionGroup, IonDatetime, Platform, ViewDidEnter } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { DashboardState } from '../states/dashboard-state';
import { UpdateHeader } from '../states/user-state';
import { FileOpener } from '@ionic-native/file-opener/ngx';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss']
})
export class DashboardPage implements OnDestroy, ViewDidEnter, OnInit {

  dead$ = new Subject();
  casualLeaveChart: typeof Highcharts = Highcharts;
  medicalLeaveChart: typeof Highcharts = Highcharts;
  casualLeaveOptions!: Highcharts.Options;
  medicalLeaveOptions!: Highcharts.Options;
  absentChart: typeof Highcharts = Highcharts;
  absentOptions!: Highcharts.Options;
  @ViewChild('leave_chart') leave_chart: any;
  users$!: Observable<UserInfo[]>;
  attendanceHistory$!: Observable<any>;
  notice$!: Observable<any>;
  attendanceToday!: any;
  upcommingHolidays$!: Observable<any>
  pendingLeaveApplication$!: Observable<any>
  leaveApplication$!: Observable<any>

  pendingRegularization$!: Observable<any>
  appliedRegularization$!: Observable<any>
  appliedRegularization!: Observable<any>

  monthDropdown: { monthId: number, monthName: string }[] = [];
  month: number = 0;

  yearDropdown: { year: number }[] = [];
  year: number = 0;

  timeCardStartDate: any;
  timeCardEndDate: any;

  isToastOpen = false;
  errMessage: string = '';

  @Select(DashboardState.getMenus)
  menus$!: Observable<any>;
  hasAttendanceApprove: boolean = false;
  attendanceApproveKey: string = 'leave-approval';
  hasRegularizationApprove: boolean = false;
  regularizationApproveKey: string = 'attendance-regularization-approve';

  @ViewChild('start_date', { static: true }) start_date!: IonAccordionGroup;
  inTime: any;
  @ViewChild('end_date', { static: true }) end_date!: IonAccordionGroup;
  @ViewChild('datetime2', { static: true }) datetime2!: IonDatetime;
  @ViewChild('datetime1', { static: true }) datetime1!: IonDatetime;
  outTime: any;
  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    private datePipe: DatePipe,
    private store: Store
  ) {
  }
  ngOnInit(): void {
    this.store.dispatch([new UpdateHeader('Dashboard', false)]);
    this.loadAllData();
    this.loadDropdown();
    this.menus$.pipe(takeUntil(this.dead$)).subscribe((data: any) => {
      this.hasAttendanceApprove = this.hasAccess(data, this.attendanceApproveKey);
      this.hasRegularizationApprove = this.hasAccess(data, this.regularizationApproveKey);
    });
  }
  ionViewDidEnter(): void {
    this.store.dispatch([new UpdateHeader('Dashboard', false)]);
    this.loadAllData();
    this.loadDropdown();
    this.menus$.pipe(takeUntil(this.dead$)).subscribe((data: any) => {
      this.hasAttendanceApprove = this.hasAccess(data, this.attendanceApproveKey);
      this.hasRegularizationApprove = this.hasAccess(data, this.regularizationApproveKey);
    });
  }
  doRefresh(event: any) {
    this.loadAllData();
    this.loadDropdown();
    setTimeout(() => {

      event.target.complete();
    }, 1000);
  }

  loadDropdown() {
    this.monthDropdown = [
      { monthId: 1, monthName: 'Jan' }
      , { monthId: 2, monthName: 'Feb' }
      , { monthId: 3, monthName: 'Mar' }
      , { monthId: 4, monthName: 'Apr' }
      , { monthId: 5, monthName: 'May' }
      , { monthId: 6, monthName: 'Jun' }
      , { monthId: 7, monthName: 'Jul' }
      , { monthId: 8, monthName: 'Aug' }
      , { monthId: 9, monthName: 'Sep' }
      , { monthId: 10, monthName: 'Oct' }
      , { monthId: 11, monthName: 'Nov' }
      , { monthId: 12, monthName: 'Dec' }];
    let i = 0;
    this.yearDropdown = [];
    while (i <= 2) {
      this.yearDropdown.push({ year: (new Date().getFullYear() - (i - 1)) });
      i++;
    }
  }
  loadAllData() {
    this.users$ = this.dashboardService.getUserInfo();
    this.users$.subscribe();

    this.attendanceHistory$ = this.dashboardService.getAttendanceSummaryInfo();
    this.attendanceHistory$.subscribe();

    this.dashboardService.getLeaveSummaryInfo().subscribe((leave: any) => {
      if (leave && leave.length) {
        this.loadLeaveChartInfo(leave)
      }
    });
    this.notice$ = this.dashboardService.getNotificationInfo();
    this.notice$.subscribe();

    this.upcommingHolidays$ = this.dashboardService.getUpcommingHolidayInfo();
    this.upcommingHolidays$.subscribe();

    this.dashboardService.getAbsentStatisticsInfo().subscribe((data) => {
      if (data && data.length) {
        let dataInfo = data.map(m => m.absent_count);
        this.loadAbsentChartInfo(dataInfo);
      }
    });

    this.dashboardService.getTodayStatusInfo().subscribe((data: any) => this.attendanceToday = data);

    this.pendingLeaveApplication$ = this.dashboardService.getPendingLeaveApplicationInfo();
    this.pendingLeaveApplication$.subscribe();

    this.leaveApplication$ = this.dashboardService.getLeaveApplicationInfo();
    this.leaveApplication$.subscribe();

    this.pendingRegularization$ = this.dashboardService.getPendingAttendanceRegularizationInfo();
    this.pendingRegularization$.subscribe();

    this.appliedRegularization$ = this.dashboardService.getAttendanceRegularizationInfo();
    this.appliedRegularization$.subscribe();
  }


  loadLeaveChartInfo(data: any) {
    this.casualLeaveOptions = {
      chart: {
        type: 'bar',
        height: 170
      },
      xAxis: {
        visible: false
      },
      yAxis: {
        min: 0,
        tickPosition: "inside",
        max: data[0].total_leave_days,
        title: {
          text: null
        }
      },
      title: {
        text: ''
      },

      series: [
        {
          name: 'Taken ' + data[0].leave_head_name,
          type: 'bar',
          color: '#3b82f6',
          groupPadding: .005,
          data: [{ y: data[0].enjoy_days, color: '#3b82f6' }]
        },
        {
          name: 'Total ' + data[0].leave_head_name,
          type: 'bar',
          color: '#ec4899',
          groupPadding: .005,
          data: [{ y: data[0].total_leave_days, color: '#ec4899' }]
        }
      ],
      credits: {
        enabled: false
      }

    }
    if (data.length > 1) {
      this.medicalLeaveOptions = {
        chart: {
          type: 'bar',
          height: 170
        },
        xAxis: {
          visible: false
        },
        yAxis: {
          min: 0,
          max: data[1].total_leave_days,
          title: {
            text: null
          }
        },
        title: {
          text: ''
        },

        series: [
          {
            name: 'Taken ' + data[1].leave_head_name,
            type: 'bar',
            color: '#3b82f6',
            groupPadding: .005,
            data: [{ y: data[1].enjoy_days, color: '#3b82f6' }]
          },
          {
            name: 'Total ' + data[1].leave_head_name,
            type: 'bar',
            color: '#ec4899',
            groupPadding: .005,
            data: [{ y: data[1].total_leave_days, color: '#ec4899' }]
          }
        ],
        credits: {
          enabled: false
        }

      }
    }



  }
  loadAbsentChartInfo(data: any) {

    this.absentOptions = {
      chart: {
        type: 'column'
      },
      title: {
        text: '' // or enabled: false
      },
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        crosshair: true
      },
      yAxis: {
        min: 0,
        max: 30,
        title: {
          text: '' // or enabled: false
        },
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
            format: '{y}', // Display the y-value on top of the bar
          }
        }
      },
      series: [{
        name: 'Absence of the month in ' + new Date().getFullYear(),
        type: 'column',
        color: '#3b82f6',
        groupPadding: 0.005,
        data: data || [] // Ensure data is defined or provide a default value
      }],
      credits: {
        enabled: false
      }
    };
  }
  ngOnDestroy(): void {
    this.dead$.next('');
    this.dead$.unsubscribe();
  }
  resizeNoticeContent(text: string) {
    if (text.length > 63) {
      return text.substring(0, 50) + '...';
    }
    return text;
  }
  resizeLeaveContent(text: string) {
    if (text.length > 133) {
      return text.substring(0, 130) + '...';
    }
    return text;
  }
  getStatusWiseEmp(leave: any): string {

    if (leave && leave.leave_status_id < 4) {
      return +[leave.req_recommend_emp_code ?? ''] + '-' + leave.req_recommend_employee == 'null' ? leave.req_recommend_employee : '' ?? '';
    }
    if (leave && leave.leave_status_id == 4) {
      return [leave.req_approve_emp_code ?? ''] + '-' + leave.req_approve_employee == 'null' ? leave.req_approve_employee : '' ?? '';
    }
    return '';
  }
  routeNotice() {
    this.router.navigate(['/notification']);
  }
  routeNoticeById(key: any) {
    this.router.navigate(['/notification-details/' + btoa(key)]);
  }
  async routePayslip() {
    if (!this.month) {
      this.errMessage = "Please select month for payslip.";
      this.setOpen(true);
    }
    if (!this.year) {
      this.errMessage = "Please select year for payslip.";
      this.setOpen(true);

    }

    this.dashboardService.getPayslipInfo(this.month, this.year).pipe(catchError((): any => {

    })).pipe(
      catchError(() => {
        this.month = 0;
        this.year = 0;
        return [];
      })
    ).subscribe(async (response: any) => {

      if (response.Data && response.Data.FileContents) {
        try {

          const result = await Filesystem.writeFile({
            path:
              'Payslip-' + this.month + '_' + this.year + this.datePipe.transform(new Date(), 'hmmss') + '.pdf',
            data: response.Data.FileContents,
            directory: FilesystemDirectory.Documents,
          });
          // this.errMessage = 'File save in documents folder';
          // this.setOpen(true);
          this.month = 0;
          this.year = 0;
          let fileOpener: FileOpener = new FileOpener();
          fileOpener.open(result.uri, 'application/pdf')
            .then(() => console.log('File is opened'))
            .catch(e => console.log('Error opening file', e));
          await Filesystem.readFile({
            path: 'Payslip-' + this.month + '_' + this.year + this.datePipe.transform(new Date(), 'hmmss') + '.pdf',
            directory: FilesystemDirectory.Documents
          });
        } catch (error) {

          this.month = 0;
          this.year = 0;
          //this.errMessage = 'Error writing to file: ' + error.message;
          // this.setOpen(true);
        }
      } else {
        this.month = 0;
        this.year = 0;
        this.errMessage = "No records found.";
        return this.setOpen(true);
      }
    });

    //this.router.navigate(['/AppMainComponent/payroll-report']);
  } //saveBase64AsPDF(response.Data, 'Time card ' + this.datePipe.transform(this.timeCardStartDate, 'd MMM YY') + ' to ' + this.datePipe.transform(this.timeCardEndDate, 'd MMM YY'));
  async routeTimeCard() {
    if (!this.timeCardStartDate) {
      this.errMessage = "Please select a start date for the time card.";
      return this.setOpen(true);
    }

    if (!this.timeCardEndDate) {
      this.errMessage = "Please select an end date for the time card.";
      return this.setOpen(true);
    }

    if (this.timeCardStartDate > this.timeCardEndDate) {
      this.errMessage = "Start date should be smaller than the end date.";
      return this.setOpen(true);
    }

    this.dashboardService
      .getTimeCardInfo(
        this.datePipe.transform(this.timeCardStartDate, 'yyyy-MM-dd'),
        this.datePipe.transform(this.timeCardEndDate, 'yyyy-MM-dd')
      )
      .pipe(
        catchError(() => {
          this.timeCardStartDate = undefined;
          this.timeCardEndDate = undefined;
          return [];
        })
      )
      .subscribe(async (response: any) => {
        if (response.Data && response.Data.length) {
          try {

            const result = await Filesystem.writeFile({
              path:
                'Time_card-' +
                this.datePipe.transform(this.timeCardStartDate, 'd-MMM-YY') + this.datePipe.transform(new Date(), 'hmmss') + '.pdf',
              data: response.Data,
              directory: FilesystemDirectory.Documents,
            });
            this.datetime1.reset();
            this.datetime2.reset();
            let fileOpener: FileOpener = new FileOpener();
            fileOpener.open(result.uri, 'application/pdf')
              .then(() => console.log('File is opened'))
              .catch(e => console.log('Error opening file', e));
            await Filesystem.readFile({
              path: 'Time_card-' +
                this.datePipe.transform(this.timeCardStartDate, 'd-MMM-YY') + this.datePipe.transform(new Date(), 'hmmss') + '.pdf',
              directory: FilesystemDirectory.Documents
            });
          } catch (error) {

            //this.errMessage = 'Error writing to file: ' + error.message;
            //this.setOpen(true);
          }
        } else {
          this.errMessage = 'No records found.';
          this.setOpen(true);
        }

        this.timeCardStartDate = undefined;
        this.timeCardEndDate = undefined;
      });
  }
  routeLeaveApprovals() {
    this.router.navigate(['/AppMainComponent/leave-approval']);
  }
  routeLeaveApprovalById(key: any) {
    this.router.navigate(['/AppMainComponent/leave-approval'], { queryParams: { approvals: btoa(key) } });
  }
  routeRegularizationApproval() {
    this.router.navigate(['/AppMainComponent/attendance-regularization-for-admin']);
  }
  routeRegularization() {
    this.router.navigate(['/AppMainComponent/attendance-regularization']);
  }
  routeLeaveApplications() {
    this.router.navigate(['/leave-apply']);
  }
  routeApplicationById(key: any) {
    this.router.navigate(['/AppMainComponent/leave-application'], { queryParams: { approvals: btoa(key) } });
  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
  hasAccess(menuData: any, targetRouterLink: string) {
    if (!menuData || !menuData.items) {
      return false;
    }

    for (const menuItem of menuData.items) {
      if (menuItem.routerLink === targetRouterLink) {
        return true;
      }

      if (menuItem.items && menuItem.items.length > 0) {
        if (this.hasAccess(menuItem, targetRouterLink)) {
          return true;
        }
      }

      if (menuItem.items && menuItem.items.length > 0) {
        for (const subMenuItem of menuItem.items) {
          if (subMenuItem.routerLink === targetRouterLink) {
            return true;
          }
        }
      }
    }

    return false;
  }

  toggleAccordion1 = () => {
    this.datetime1.confirm();
    const nativeEl = this.start_date;
    if (nativeEl.value === 'start') {
      nativeEl.value = undefined;
    } else {
      nativeEl.value = 'start';
    }

  };
  toggleAccordion2 = () => {
    this.datetime2.confirm();
    const nativeEl = this.end_date;
    if (nativeEl.value === 'end') {
      nativeEl.value = undefined;
    } else {
      nativeEl.value = 'end';
    }
  };
}

