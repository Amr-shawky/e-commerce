import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {TitleCasePipe} from '@angular/common';
@Component({
  selector: 'app-register',
  imports: [TitleCasePipe, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
// {
//     "name": "Ahmed Abd Al-Muti",
//     "email":"ahmedmuttii4012@gmail.com",
//     "password":"Ahmed@123",
//     "rePassword":"Ahmed@123",
//     "phone":"01010700701"
// }
  registerform = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    rePassword: new FormControl(''),
    phone: new FormControl('')
  });

  handlesubmit() {
    console.log(this.registerform.value);
  }
}
