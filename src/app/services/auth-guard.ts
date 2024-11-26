import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, from, map, switchMap } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private storage: Storage, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return from(this.storage && this.storage.get('auth-token')).pipe(
      map((token) => {
        if (this.isAuthenticated(token)) {
          return true;
        } else {
          this.navigateToLogin();
          return false;
        }
      })
    );
  }

  private isAuthenticated(token: any): boolean {
    return token !== undefined && token !== null;
  }

  private navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
