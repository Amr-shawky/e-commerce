import { Router } from '@angular/router';
import { CartResponse } from './../../../../core/models/api.interface';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { SpinnerComponent } from "../../../../shared/components/spinner/spinner.component";

@Component({
  selector: 'app-cart',
  imports: [SpinnerComponent],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
})
export class Cart implements OnInit {
  cartData: CartResponse | null = null;

  isFirstLoading = true; // لأول مرة فقط
  isLoading = false;     // باقي العمليات
  constructor(
    private cartService: CartService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  getallcarts() {
    if (!this.cartData) {
      this.isFirstLoading = true; // Skeleton
    } else {
      this.isLoading = true; // Spinner
    }

    this.cartService.getCart().subscribe({
      next: (response: CartResponse) => {
        this.cartData = response;
        this.cartService.CartId.next(response.data._id);
        this.isFirstLoading = false;
        this.cartService.numOfCartItems.next(response.numOfCartItems);
        this.isLoading = false;
      },
      error: (error: any) => {
        console.log(error);
        this.toastr.error('Failed to load cart', 'Error');
        this.isFirstLoading = false;
        this.isLoading = false;
      },
    });
  }

  ngOnInit() {
    this.getallcarts();
  }

  updateCount(productId: string, count: number) {
    this.isLoading = true;
    this.cartService.updateProductCount(productId, count).subscribe({
      next: () => {
        this.getallcarts();
        this.toastr.success('Quantity updated successfully', 'Success');
      },
      error: () => {
        this.toastr.error('Failed to update quantity', 'Error');
        this.isLoading = false;
      },
    });
  }

  deleteProduct(productId: string) {
    this.isLoading = true;
    this.cartService.clearSpecificProduct(productId).subscribe({
      next: () => {
        this.getallcarts();
        this.toastr.success('Product removed from cart', 'Success');
      },
      error: () => {
        this.toastr.error('Failed to remove product', 'Error');
        this.isLoading = false;
      },
    });
  }

  clearCart() {
    this.isLoading = true;
    this.cartService.clearCart().subscribe({
      next: () => {
        this.getallcarts();
        this.toastr.success('Cart cleared successfully', 'Success');
      },
      error: () => {
        this.toastr.error('Failed to clear cart', 'Error');
        this.isLoading = false;
      },
    });
  }
  checkOutSession() {
    this.cartService.CartId.next(this.cartData?.cartId || "");
    this.isLoading = true;
    this.router.navigate(['/checkout']);

  }
}
