import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

let headers = new HttpHeaders();
headers.append('Content-Type', 'application/json');
const httpOptionsForFileUpload = {
  headers: headers
};
@Injectable({
  providedIn: 'root'
})

export class LeaveService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<any[]> {
    return this.http.get<any[]>('LeaveApplication/GetAll');
  }
  getEmployeeForSelfService(): Observable<any> {
    return this.http.get<any[]>('Employee/GetEmployeeForSelfService');
  }
  getEmployeeLeaveLedger(employeeId: Number): Observable<any> {
    return this.http.get('EmployeeLeaveLedger/Gets?nEmployeeId=' + employeeId);
  }
  getLeavePolicyById(leave_policy_id: Number): Observable<any> {

    return this.http.get('LeavePolicy/GetLeavePolicyById?leave_policy_id=' + leave_policy_id);
  }
  getAttendanceDataByEmployeeandDate(employee_id: any, start_date: any, end_date: any, company_id: Number): Observable<any> {
    return this.http.get<any[]>('AttendanceProcessManagement/GetAttendanceDataByEmployeeandDate?employee_id=' + employee_id + ' &start_date=' + start_date + '&end_date=' + end_date + '&company_id=' + company_id);
  }
  getEmployeeAsApproverByNameOrCode(nameOrCode: any, leavePolicyId: number, employee_id: number, fieldName: string): Observable<any> {
    return this.http.get<any[]>('LeaveApplication/GetEmployeeAsApproverByNameOrCode?nameOrCode=' + nameOrCode + '&leavePolicyId=' + leavePolicyId + '&employee_id=' + employee_id + '&fieldName=' + fieldName);
  }
  getAllEmployeeAsApproverByNameOrCode(nameOrCode: any): Observable<any> {
    return this.http.get<any[]>('Employee/GetEmployeeAsApproverByNameOrCode?nameOrCode=' + nameOrCode);
  }
  getLeaveDuration(employee_id: number, employee_leave_ledger_id: number, start_date: any, end_date: any): Observable<any> {
    return this.http.post<any>('LeaveApplication/GetLeaveDuration', { employee_id, employee_leave_ledger_id, start_date, end_date });
  }
  draft(oLeaveApplication: FormData): Observable<any> {
    return this.http.post<any>('LeaveApplication/Draft', oLeaveApplication, httpOptionsForFileUpload);
  }
  apply(oLeaveApplication: FormData): Observable<any> {
    return this.http.post<any>('LeaveApplication/Apply', oLeaveApplication);
  }

  cancelForRequest(leave_application_id: any): Observable<any> {
    return this.http.post<any>('LeaveApplication/CancelforRequest', { leave_application_id });
  }
  getLeaveApplicationById(leave_application_id: Number): Observable<any> {
    return this.http.get('LeaveApplication/GetLeaveApplicationById?leave_application_id=' + leave_application_id);
  }
  downloadFile(url: string): Observable<any> {
    return this.http.get('Common/DownloadFile?fileUrl=' + url, { responseType: 'blob' });
  }
  GetAllApplicationByUser(): Observable<any[]> {
    return this.http.get<any[]>('LeaveApproval/GetAllApplicationByUser');
  }
  acknowledge(leaveApproval: any): Observable<any> {
    return this.http.post<any>('LeaveApproval/Acknowledge', leaveApproval);
  }
  recommend(leaveApproval: any): Observable<any> {
    return this.http.post<any>('LeaveApproval/Recommend', leaveApproval);
  }
  approve(leaveApproval: any): Observable<any> {
    return this.http.post<any>('LeaveApproval/Approve', leaveApproval);
  }
  delete(leave_application_id: any): Observable<any> {
    return this.http.post<any>('LeaveApplication/Delete', { leave_application_id });
  }
  cancel(leaveApproval: any): Observable<any> {
    return this.http.post<any>('LeaveApproval/Cancel', leaveApproval);
  }
  reject(leaveApproval: any): Observable<any> {
    return this.http.post<any>('LeaveApproval/Reject', leaveApproval);
  }
}
