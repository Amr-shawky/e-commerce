import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-check-out',
  imports: [ReactiveFormsModule],
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.css',
})
export class CheckOutComponent implements OnInit {
  constructor(
    private cartService: CartService,
    private toastr: ToastrService
  ) {}
  isLoading = false;
  ngOnInit(): void {
    console.log(this.cartService.CartId);
    console.log(this.cartService.CartId.value);
        console.log(this.cartService.CartId);
    console.log(this.cartService.CartId.value);
        console.log(this.cartService.CartId);
    console.log(this.cartService.CartId.value);
        console.log(this.cartService.CartId);
    console.log(this.cartService.CartId.value);
        console.log(this.cartService.CartId);
    console.log(this.cartService.CartId.value);
  }

  checkoutform: FormGroup = new FormGroup({
    details: new FormControl('', Validators.required),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('^(010|011|012|015)[0-9]{8}$'),
    ]),
    city: new FormControl('', Validators.required),
  });
  checkOutSession() {
    this.cartService
      .checkOutSession(this.cartService.CartId.value, this.checkoutform.value)
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.session.url) {
            this.toastr.success('Redirecting to checkout...', 'Success');
            window.location.href = response.session.url;
          }
        },
        error: () => {
          this.toastr.error('Checkout session failed', 'Error');
          this.isLoading = false;
        },
      });
  }
  get detailsController() {
  return this.checkoutform.get('details');
}
get phoneController() {
  return this.checkoutform.get('phone');
}
get cityController() {
  return this.checkoutform.get('city');
}
}
