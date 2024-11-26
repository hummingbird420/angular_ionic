import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(private http: HttpClient) { }
  getTodayStatusInfo() {
    return this.http.get<any>('Dashboard/GetTodayStatusInfo');
  }
  getTodayStatusInfoForApp() {
    return this.http.get<any>('Dashboard/GetTodayStatusInfoForApp');
  }

  addAttendance() {
    return this.http.post<any>('AttendanceLog/ProvideLogByApp', {});
  }
  checkAttendancePermission() {
    return this.http.get<any>('AttendanceMethod/GetAttendanceMethodByKey?attendance_log_source_id=2');
  }
  getCurrentLocationForAttendence() {
    return this.http.get<any>('GeoLocationBind/GetGeoLocationByUser');
  }
}
