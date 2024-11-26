import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ViewDidEnter } from '@ionic/angular';

@Component({
  selector: 'app-reset-passward',
  templateUrl: './reset-passward.page.html',
  styleUrls: ['./reset-passward.page.scss'],
})
export class ResetPasswardPage implements ViewDidEnter {
  userId: number = 0;
  resetForm: FormGroup = new FormGroup({});
  isToastOpen = false;
  errMessage: string = '';
  submitted: boolean = false;
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private authService: AuthService, private router: Router) {
    let key = this.route.snapshot.queryParamMap.get('key');
    if (key) {
      this.userId = Number(key);
    }
  }
  ionViewDidEnter(): void {
    this.resetForm = this.fb.group({
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      userInfoId: new FormControl(this.userId, [Validators.required]),
    }, { validator: confirmPasswordValidator });
  }


  resetPassword() {
    this.submitted = true;
    const resetdata = this.resetForm.value;

    if (this.resetForm.invalid) return;
    this.authService.resetPassword(resetdata).subscribe(data => {
      this.errMessage = data.CurrentMessage;
      this.submitted = false;
      this.setOpen(true);
      if (data.MessageType == 1) {
        this.router.navigate(['/login']);
      }
    });
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
