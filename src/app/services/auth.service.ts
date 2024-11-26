import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  login(login_User: string, password: string): Observable<any> {

    return this.http.post('Authenticate/login', {
      login_User: login_User,
      password: password,
      isAppLogin: true
    });
  }

  forgotPassword(email: string): Observable<any> {

    return this.http.post('ForgetPassword/ForgotPassword', {
      email,
    });
  }
  checkVarificationCode(code: string, UserInfoId: number): Observable<any> {
    return this.http.post('ForgetPassword/CheckVarificationCode', {
      'Code': code, 'UserInfoId': UserInfoId
    });
  }
  resetPassword(obj: any): Observable<any> {
    return this.http.post('ForgetPassword/ResetPasswordApp', obj);
  }

  getRefreshToken(LoginId: string, EmailAddress: string): Observable<any> {
    return this.http.post<any>('Authenticate/GetRefreshToken', { LoginId, EmailAddress });
  }
  changePassword(obj: any): Observable<any> {
    return this.http.post('ChangePassword/ChangePasswordApp', obj);
  }
}
