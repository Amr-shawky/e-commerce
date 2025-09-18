import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartResponse } from '../../../../core/models/api.interface';
import { CartService } from '../../../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { ModeService } from '../../../../core/services/mode.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [SpinnerComponent,CommonModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
})
export class Cart implements OnInit, OnDestroy {
  cartData: CartResponse | null = null;
  isFirstLoading = true;
  isLoading = false;
  private modeSubscription!: Subscription;
  private cartService = inject(CartService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private modeService = inject(ModeService);

  ngOnInit() {
    this.modeSubscription = this.modeService.mode.subscribe((mode) => {
      console.log('CartComponent: Mode changed to:', mode); // Debugging
    });
    this.getallcarts();
  }

  ngOnDestroy(): void {
    if (this.modeSubscription) {
      this.modeSubscription.unsubscribe();
    }
  }

  get isDarkMode(): boolean {
    return this.modeService.mode.value === 'dark';
  }

  getallcarts() {
    if (!this.cartData) {
      this.isFirstLoading = true;
    } else {
      this.isLoading = true;
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
    this.cartService.CartId.next(this.cartData?.cartId || '');
    this.isLoading = true;
    this.router.navigate(['/checkout']);
  }
}