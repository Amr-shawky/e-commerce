import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [TitleCasePipe, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  // Custom validator for matching password and rePassword
  matchPasswordValidator(control: import('@angular/forms').AbstractControl) {
    const form = control as FormGroup;
    const password = form.get('password')?.value;
    const rePassword = form.get('rePassword')?.value;
    return password === rePassword ? null : { mismatch: true };
  }

  registerform: FormGroup = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern('^[a-zA-Z]+( [a-zA-Z]+)*$')
    ]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$')
    ]),
    rePassword: new FormControl(null, []),
    phone: new FormControl(null, [Validators.required, Validators.pattern('^01[0125][0-9]{8}$')])
  },
   { validators: this.matchPasswordValidator }); // Add the custom validator to the FormGroup

  get getnamecontroller() {
    return this.registerform.get('name');
  }
  get getemailcontroller() {
    return this.registerform.get('email');
  }
  get getpasswordcontroller() {
    return this.registerform.get('password');
  }
  get getrePasswordcontroller() {
    return this.registerform.get('rePassword');
  }
  get getphonecontroller() {
    return this.registerform.get('phone');
  }

  handlesubmit() {
    if(this.registerform.invalid){
      this.registerform.markAllAsTouched();
      return;
    }
    console.log(this.registerform.value);
    console.log(this.registerform);
    console.log({
      nameerrors: this.registerform.get('name')?.errors,
      emailerrors: this.registerform.get('email')?.errors,
      passworderrors: this.registerform.get('password')?.errors,
      rePassworderrors: this.registerform.get('rePassword')?.errors,
      phoneerrors: this.registerform.get('phone')?.errors,
      formerrors: this.registerform.errors // Log form-level errors (e.g., mismatch)
    });
  }
}