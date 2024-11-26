import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { catchError } from 'rxjs';
import { ViewDidEnter, ViewWillEnter } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { UpdateHeader } from 'src/app/states/user-state';
import { ActivationStart, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-change-passward',
  templateUrl: './change-passward.page.html',
  styleUrls: ['./change-passward.page.scss'],
})
export class ChangePasswardPage implements ViewDidEnter, ViewWillEnter {
  @ViewChild(RouterOutlet) outlet: RouterOutlet;
  isToastOpen: boolean = false;
  errMessage: string = '';
  changePasswordForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  constructor(private fb: FormBuilder, private authService: AuthService, private store: Store, private router: Router) {
    this.changePasswordForm = this.fb.group({
      currentPassword: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),

    }, { validator: confirmPasswordValidator });
    this.changePasswordForm.get('confirmPassword').valueChanges.subscribe(() => {
      this.changePasswordForm.updateValueAndValidity();
    });
  }
  ionViewWillEnter(): void {

  }
  ionViewDidEnter(): void {
    this.store.dispatch([new UpdateHeader('Change Password', false, '')]);


  }


  changePassword() {
    this.submitted = true;

    const resetdata = this.changePasswordForm.value;

    if (this.changePasswordForm.invalid) { return };
    this.authService.changePassword(resetdata).pipe(
      catchError((err: any) => {
        this.errMessage = err.CurrentMessage;
        this.submitted = false;
        this.setOpen(true);
        this.changePasswordForm.reset();
        return err;
      })
    ).subscribe(data => {
      this.errMessage = data.CurrentMessage;
      this.submitted = false;
      this.setOpen(true);
      this.changePasswordForm.reset();
    });
  }

  doRefresh(event: any) {
    //this.loadData();
    setTimeout(() => {
      this.ionViewDidEnter();
      event.target.complete();
    }, 1000);
  }
  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
}
function confirmPasswordValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }

  return password.value === confirmPassword.value ? null : { 'passwordMismatch': true };
}
