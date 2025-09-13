import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
  });

  get getEmailController() {
    return this.loginForm.get('email');
  }

  get getPasswordController() {
    return this.loginForm.get('password');
  }

  handleSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.authService.decodeToken(response.token); // Store and decode token
        this.toastr.success('Login successful!', 'Success');
        this.authService.decodeToken(response.token);
        this.loginForm.reset();
        this.authService.isLogin.next(true);
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.log('Login failed', error);
        this.toastr.error(error.error.message || 'Login failed. Please try again.', 'Error');
        this.isLoading = false;
      },
    });

    console.log(this.loginForm.value);
    console.log(this.loginForm);
    console.log({
      emailErrors: this.loginForm.get('email')?.errors,
      passwordErrors: this.loginForm.get('password')?.errors,
    });
  }
}