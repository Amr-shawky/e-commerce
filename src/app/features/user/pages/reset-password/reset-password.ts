import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  step = 1;
  isLoading: boolean = false;

  private toaster = inject(ToastrService);
  private authService = inject(AuthService);
  private router = inject(Router);

  forgetPasswordGroup = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
  });

  verifyResetCodeGroup = new FormGroup({
    resetCode: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  resetPasswordGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$'),
    ]),
  });

  get getEmailController() {
    return this.forgetPasswordGroup.get('email');
  }

  get getResetCodeController() {
    return this.verifyResetCodeGroup.get('resetCode');
  }

  get getResetEmailController() {
    return this.resetPasswordGroup.get('email');
  }

  get getNewPasswordController() {
    return this.resetPasswordGroup.get('newPassword');
  }

  handleSubmitForgetPassword() {
    if (this.forgetPasswordGroup.invalid) {
      this.forgetPasswordGroup.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.resetPasswordGroup.get('email')?.patchValue(this.forgetPasswordGroup.value.email || '');
    this.authService.forgetPassword({ email: this.forgetPasswordGroup.value.email! }).subscribe({
      next: (res) => {
        this.toaster.success('Reset code sent to your email!', 'Success', { timeOut: 1500 ,progressBar : true });
        this.step = 2;
        this.isLoading = false;
      },
      error: (err) => {
        this.toaster.error(err.error.message || 'Request failed', 'Error', { timeOut: 1500 , progressBar : true });
        this.isLoading = false;
      },
    });
  }

  handleSubmitVerifyResetCode() {
    if (this.verifyResetCodeGroup.invalid) {
      this.verifyResetCodeGroup.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.authService.verifyCode({ resetCode: this.verifyResetCodeGroup.value.resetCode! }).subscribe({
      next: (res) => {
        this.toaster.success('Code verified!', 'Success', { timeOut: 1500 ,progressBar:true});
        this.step = 3;
        this.isLoading = false;
      },
      error: (err) => {
        this.toaster.error(err.error.message || 'Invalid code', 'Error', { timeOut: 1500 ,progressBar:true});
        this.isLoading = false;
      },
    });
  }

  handleSubmitResetPassword() {
    if (this.resetPasswordGroup.invalid) {
      this.resetPasswordGroup.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.authService
      .resetPassword({
        email: this.resetPasswordGroup.value.email!,
        newPassword: this.resetPasswordGroup.value.newPassword!,
      })
      .subscribe({
        next: (res) => {
          this.toaster.success('Password reset successfully!', 'Success', { timeOut: 1500 ,progressBar:true});
          this.authService.decodeToken(res.token);
          this.router.navigate(['/login']);
          this.isLoading = false;
        },
        error: (err) => {
          this.toaster.error(err.error.message || 'Reset failed', 'Error', { timeOut: 1500 ,progressBar:true});
          this.isLoading = false;
        },
      });
  }
}