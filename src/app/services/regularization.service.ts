import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegularizationService {

  constructor(private http: HttpClient) { }
  getRegularizationBySelf() {
    return this.http.get<any[]>('AttendanceRegularizationForAdmin/GetBySelf');
  }
  getShiftForDP(): Observable<any> {

    return this.http.get('ShiftInformation/GetShiftForDP');
  }
  getAttendanceData(oAttendanceTracking: any): Observable<any> {
    return this.http.post<any[]>('AttendanceTracking/GetAttendanceData', oAttendanceTracking);
  }
  getApprovalListByEmp(e: any) {
    return this.http.get('AttendanceRegularizationForAdmin/GetApprovalListByEmp?NameOrCode=' + e);
  }
  applyBySelf(data: any) {
    return this.http.post<any>('AttendanceRegularizationForAdmin/ApplyAndApprove', data);
  }
  getById(attendance_regularization_id: number): Observable<any> {
    return this.http.get('AttendanceRegularizationForAdmin/GetById?attendance_regularization_id=' + attendance_regularization_id);
  }
  getAppliedForApprovedData(key: number) {
    return this.http.get<any[]>('AttendanceRegularizationForAdmin/GetAppliedForApprovedData?key=' + key);
  }
  onApproveOrReject(nAttendanceRegularizationId: number, flag: number, txtRemarks: string) {
    return this.http.get<any[]>('AttendanceRegularizationForAdmin/ApproveOrReject?RegularizationId=' + nAttendanceRegularizationId + '&Note=' + txtRemarks + '&Type=' + flag);
  }
  getEmployeeForSelfService(): Observable<any> {
    return this.http.get<any[]>('Employee/GetEmployeeForSelfService');
  }
}
