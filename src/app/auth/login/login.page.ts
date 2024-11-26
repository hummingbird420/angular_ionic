import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { timer } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { SetUser } from '../../states/user-state';
import { MenuController } from '@ionic/angular';
import { UpdateGEOLocation } from 'src/app/states/attendance-state';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss']
})
export class LoginPage {
  loginform: FormGroup;

  isToastOpen = false;
  errMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
    private store: Store,
    private menuController: MenuController) {
    this.loginform = this.fb.group({
      login_user: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });

  }
  loginUser() {
    this.menuController.close('this-menu');
    if (this.loginform.invalid) {
      return;
    }
    // const { login_User, password } = this.loginform;

    this.authService.login(this.loginform.get('login_user')?.value, this.loginform.get('password')?.value).subscribe(
      (data: any) => {
        if (data.MessageType == 1) {
          this.tokenService.saveToken(data.Data.Token);
          this.tokenService.saveUser(data.Data);
          this.store.dispatch([new SetUser(data.Data), new UpdateGEOLocation()]);
          this.router.navigate(['/dashboard']);
        }
        else {
          this.errMessage = data.CurrentMessage;
          this.setOpen(true);
        }
      },
      (err: any) => {
        this.errMessage = err?.message;
        this.setOpen(true);
      }
    );
  }
  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  reloadPage(): void {
    window.location.reload();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginform.controls;
  }

}
