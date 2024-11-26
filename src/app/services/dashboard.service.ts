import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInfo } from '../classes/user-info';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http:HttpClient) { }
  getMenuInfo(): Observable<any> {
    return this.http.get<any>('Menu/GetTreeMenuForSidebar');
  }

  getUserInfo(): Observable<UserInfo[]> {
    return this.http.get<UserInfo[]>('Dashboard/GetEmployeeSelfInfo');
  }
  //****************dashboard: attendance summary --top box******************/

  getAttendanceSummaryInfo() {
    return this.http.get<any>('Dashboard/GetAttendanceSummaryInfo');
}

 //****************dashboard: leave summary --leave chart******************/

 getLeaveSummaryInfo() {
    return this.http.get<any>('Dashboard/GetLeaveSummaryInfo');
}
 //****************today status --today attendance status******************/

 getTodayStatusInfo() {
    return this.http.get<any>('Dashboard/GetTodayStatusInfo');
}

//****************dashboard: notification list******************/

getNotificationInfo() {
    return this.http.get<any>('Dashboard/GetNotificationInfo');
}

 //****************dashboard: absent statistics --absent chart******************/

 getAbsentStatisticsInfo() {
    return this.http.get<any>('Dashboard/GetAbsentStatisticsInfo');
}

//****************dashboard: upcomming holidays ******************/

 getUpcommingHolidayInfo() {
    return this.http.get<any>('Dashboard/GetUpcommingHolidayInfo');
}

//****************leave applications --pending approvals ******************/

getPendingLeaveApplicationInfo() {
    return this.http.get<any>('Dashboard/GetPendingLeaveApplicationInfo');
}

//****************dashboard: leave applications --own application ******************/

getPendingAttendanceRegularizationInfo() {
    return this.http.get<any>('Dashboard/GetPendingAttendanceRegularizationInfo');
}

 //****************dashboard: attendance regularization --pending approvals ******************/

 getLeaveApplicationInfo() {
    return this.http.get<any>('Dashboard/GetLeaveApplicationInfo');
}

 //****************dashboard: attendance regularization --own application ******************/

 getAttendanceRegularizationInfo() {
    return this.http.get<any>('Dashboard/GetAttendanceRegularizationInfo');
}

 //****************dashboard: attendance regularization --own application ******************/ to do

 getPayslipInfo(month:any,year:any) {
    return this.http.get<any>('Dashboard/GetPayslipInfo?Month='+month+'&Year='+year);
}

 //****************dashboard: attendance regularization --own application ******************/ to do

 getTimeCardInfo(startDate:any,endDate:any) {
    return this.http.get<any>('Dashboard/GetTimeCardInfo?StartDate='+startDate+'&EndDate='+endDate);
}
//****************To do: dashboard pending approvals ******************/
}
