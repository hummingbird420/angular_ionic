import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { CheckPermission, UpdateGEOLocation } from '../states/attendance-state';

@Injectable({
  providedIn: 'root'
})
export class AttendanceResolver implements Resolve<boolean> {
  constructor(private store: Store) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store.dispatch([new CheckPermission(), new UpdateGEOLocation()]);
  }
}
