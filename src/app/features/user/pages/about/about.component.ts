import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModeService } from '../../../../core/services/mode.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ReactiveFormsModule, SpinnerComponent,CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit, OnDestroy {
  contactForm: FormGroup;
  isFirstLoading: boolean = true;
  isLoading: boolean = false;
  private modeSubscription!: Subscription;
  private fb = inject(FormBuilder);
  private modeService = inject(ModeService);

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.modeSubscription = this.modeService.mode.subscribe((mode) => {
      console.log('AboutComponent: Mode changed to:', mode); // Debugging
    });
    // Simulate loading for skeleton (replace with actual data fetching if needed)
    setTimeout(() => {
      this.isFirstLoading = false;
    }, 1000); // Adjust delay as needed
  }

  ngOnDestroy(): void {
    if (this.modeSubscription) {
      this.modeSubscription.unsubscribe();
    }
  }

  get isDarkMode(): boolean {
    return this.modeService.mode.value === 'dark';
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isLoading = true;
      const { name, email, message } = this.contactForm.value;
      const subject = encodeURIComponent(`Message from ${name} via E-commerce Site`);
      const body = encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${message}`);
      const mailtoLink = `mailto:amrshawky936@gmail.com?subject=${subject}&body=${body}`;
      window.location.href = mailtoLink;
      setTimeout(() => {
        this.isLoading = false;
        this.contactForm.reset();
      }, 1000); // Simulate email client opening
    }
  }
}