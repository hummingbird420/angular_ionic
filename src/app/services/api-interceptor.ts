import { EnvironmentInjector, Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS, HttpEvent, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, EMPTY, Observable, catchError, filter, finalize, from, map, switchMap, take, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
//import { ToastrService } from 'ngx-toastr'
import { environment } from '../../environments/environment';
import { TokenService } from './token.service';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from './auth.service';
import { LoadingController } from '@ionic/angular';
import { LoaderService } from './loader.service';

const TOKEN_KEY = 'auth-token';
const TOKEN_HEADER_KEY = 'Authorization';
const USER_KEY = 'auth-user';
@Injectable({
  providedIn: 'root'
})
export class ApiInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private isLoading = false;
  protected debug = true;
  is_check: boolean = false;
  base_url: string = '';
  constructor(private storage: Storage, private loaderService: LoaderService, private router: Router) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.indexOf('/assets/') > -1) {
      return next.handle(request);
    }

    if (environment.production) {
      this.base_url = environment.apiUrl;
    }

    // Show loader


    return from(this.storage.get(TOKEN_KEY)).pipe(
      switchMap((token: any) => {
        if (token && !['Authenticate/login', 'Authenticate/GetRefreshToken'].some(url => request.url.includes(url))) {
          request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
        }

        if (!request.headers.has('Content-Type')) {
          if (!request.headers.has('Content-Type')) {
            if (request.body instanceof FormData) {

              // request = request.clone({ headers: request.headers.append('Content-Type', 'multipart/form-data;') });
              //   request = request.clone({ headers: request.headers.append('Process-Data', 'false') });

            }
            else {
              request = request.clone({ headers: request.headers.append('Content-Type', 'application/json; charset=utf-8') });
              // request = request.clone({ headers: request.headers.append('cache', 'no-cache') });
            }


          }
        }

        request = request.clone({ headers: request.headers.set('Access-Control-Allow-Origin', '*') });

        request = request.clone({ url: environment.apiUrl + request.url });
        this.loaderService.showLoader();
        return next.handle(request).pipe(
          catchError((error: HttpErrorResponse) => {
            this.loaderService.hideLoader();
            if (typeof error.error === 'string' && error.error.indexOf('Lifetime validation failed. The token is expired.') !== -1) {
              this.router.navigate(['/login']);
            }
            if (error?.status == 404) {
              return throwError(error);
            }
            return throwError(error);
          })
        ).pipe(map((event: any) => {
          if (event instanceof HttpResponse) {
            this.loaderService.hideLoader();
          }
          return event;
        }));
      })
    )
  }
}

export const apiInterceptor = [
  { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true }
];
