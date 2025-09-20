import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core/services/auth.service';
import { SpinnerComponent } from "../../../../shared/components/spinner/spinner.component";
import { Subscription } from 'rxjs';
import { ModeService } from '../../../../core/services/mode.service';
import { get } from 'https';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, SpinnerComponent,CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements  OnDestroy , OnInit {
  isLoading: boolean = false;
    isFirstLoading: boolean = true;
  private modeSubscription!: Subscription;
  private modeService = inject(ModeService);
  isloading :boolean = false;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}
ngOnInit() {
    this.modeSubscription = this.modeService.mode.subscribe((mode) => {
      console.log('LoginComponent: Mode changed to:', mode); // Debugging
    });
   //Simulate initial load (replace with actual async check if needed)
    setTimeout(() => {
      this.isFirstLoading = false;
    }, 100); // Adjust delay as needed
  }

  ngOnDestroy(): void {
    if (this.modeSubscription) {
      this.modeSubscription.unsubscribe();
    }
  }
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
  get isDarkMode(): boolean {
    return this.modeService.mode.value === 'dark';
  }
}
