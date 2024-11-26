import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-forget-passward',
  templateUrl: './forget-passward.page.html',
  styleUrls: ['./forget-passward.page.scss'],
})
export class ForgetPasswardPage {
  showCodeSection = false;
  forgotForm: FormGroup = new FormGroup({});
  isToastOpen = false;
  errMessage: string = '';
  submitted: boolean = false;
  user_id: number = 0;
  user_code: string = '';
  verificationCode: string | null = null;
  verificationForm: FormGroup = new FormGroup({});;
  digits = Array(4).fill(0);
  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) {
    this.forgotForm = this.fb.group({
      email: new FormControl('', [Validators.required]),
    });
    this.initForm();
  }


  forgotPassword() {
    this.submitted = true;
    if (this.forgotForm.invalid) {
      return;
    }

    this.authService.forgotPassword(this.forgotForm.get('email')?.value).subscribe(data => {
      this.errMessage = data.CurrentMessage;
      this.setOpen(true);
      this.forgotForm.reset();
      this.submitted = false;
      if (data.MessageType == 1) {
        this.user_id = data.Data && data.Data.length ? data.Data[0].user_info_id : 0;
        this.user_code = data.Data && data.Data.length ? data.Data[0].code : '';
        this.showCodeSection = true;
      }
    });

  }
  initForm() {
    const formControls = {};
    for (let i = 0; i < this.digits.length; i++) {
      formControls['digit' + i] = ['', Validators.required];
    }

    this.verificationForm = this.fb.group(formControls);
  }

  onDigitInput(event: any, index: number) {

    if (event.target.value.length === 1 && index < this.digits.length - 1) {
      const nextInput = document.getElementById('digit' + (index + 1));
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  verifyCode() {
    const code = Object.values(this.verificationForm.value).join('');
    if (this.user_code == code) {
      this.authService.checkVarificationCode(code, this.user_id).subscribe(data => {
        this.errMessage = data.CurrentMessage;
        this.setOpen(true);
        this.submitted = false;
        if (data.MessageType == 1) {
          this.router.navigate(['/reset-password'], { queryParams: { key: this.user_id } });
        }
      });
    }
    else {
      this.errMessage = 'Code does not match!';
      return this.setOpen(true);
    }

  }
  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
  get fp(): { [key: string]: AbstractControl } {
    return this.forgotForm.controls;
  }
}
