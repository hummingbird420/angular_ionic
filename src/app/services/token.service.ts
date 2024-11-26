import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Storage } from '@ionic/storage-angular';
import { EMPTY, Subject, from, map, switchMap, takeUntil, tap, timer } from 'rxjs';
import { Router } from '@angular/router';



const TOKEN_KEY = 'auth-token';
const REFRESHTOKEN_KEY = 'auth-refreshtoken';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})


export class TokenService {
  private _storage: Storage | null = null;
  dead$ = new Subject();
  token: string = '';
  constructor(private authService: AuthService, private storage: Storage,private router:Router) {
   this.storage.create();
    this._storage=storage;
  }



  signOut(): void {
    this.storage.clear();
  }

  saveToken(token: string): void {
    this.storage.clear();
    this.set(TOKEN_KEY, token);
    this.setRefreshToken();
  }

  getToken() {
    return from(this.storage.get(TOKEN_KEY)).pipe(
      tap((access_token:string) => {
       return access_token;
      })
    );
  }


  saveUser(user: any): void {
    this.set(USER_KEY, JSON.stringify(user));
  }

  getUser(): any {
    return from(this.storage.get(TOKEN_KEY)).pipe(
      tap((access_token:string) => {
       return access_token;
      })
    );
  }

  setRefreshToken() {
    timer(3600000 * 8).pipe(
      switchMap(() => from(this.storage.get(USER_KEY))),
      switchMap((user: any) => {
        if (user) {
          let jsonUser = JSON.parse(user);
          return this.authService.getRefreshToken(jsonUser.Login_Id, jsonUser.Email).pipe(
            tap((data: any) => {
              if (data) {
                this.saveToken(data.RefreshToken);
                jsonUser.Token=data.RefreshToken;
                this.saveUser(jsonUser);
              }
            })
          );
        } else {
          return EMPTY;
        }
      })
    ).subscribe();
  }
    //0, 1000 * 60 * 60 * 8
    // Convert to second: 60000*50 = 3000000; 60000sec = 1 minute; 50 means 50 minutue, based on 1hr(60 minute) of access token

  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }
}
