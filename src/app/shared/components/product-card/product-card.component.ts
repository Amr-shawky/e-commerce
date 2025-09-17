import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Mode, Product, wishlistResponse } from '../../../core/models/api.interface';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faHeart } from '@ng-icons/font-awesome/regular';
import { faSolidHeart } from '@ng-icons/font-awesome/solid';
import { faSolidCartShopping } from '@ng-icons/font-awesome/solid';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { SpinnerComponent } from '../spinner/spinner.component';
import { wishlistService } from '../../../core/services/wishlist.service';
import { ModeService } from '../../../core/services/mode.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, NgIcon, CommonModule, RouterLink, SpinnerComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
  viewProviders: [provideIcons({ faHeart, faSolidHeart, faSolidCartShopping })],
})
export class ProductCardComponent implements OnInit, OnDestroy {
  constructor(
    private cartService: CartService,
    private toastr: ToastrService,
    private wishlistService: wishlistService,
    private modeService: ModeService
  ) {}

  isCartUpdated: boolean = false;
  wishlistproducts: Product[] = [];
  @Input() product!: Product;
  private modeSubscription!: Subscription;

  ngOnInit(): void {
    this.getWishlist();
    // Subscribe to mode changes from ModeService
    this.modeSubscription = this.modeService.mode.subscribe((mode: Mode) => {
      console.log('Mode changed to:', mode); // Debugging
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.modeSubscription) {
      this.modeSubscription.unsubscribe();
    }
  }

  get isDarkMode(): boolean {
    return this.modeService.mode.value === 'dark';
  }

  getWishlist() {
    this.wishlistService.getwishlist().subscribe({
      next: (res: wishlistResponse) => {
        this.wishlistproducts = res.data || [];
        console.log('Wishlist fetched:', this.wishlistproducts);
      },
      error: (err: any) => {
        this.toastr.error('Failed to fetch wishlist: ' + err.message, 'Error');
      },
    });
  }

  isInWishlist(product: Product): boolean {
    return this.wishlistproducts.some(p => p._id === product._id);
  }

  toggleWishlist(product: Product) {
    this.isCartUpdated = true;
    if (this.isInWishlist(product)) {
      this.wishlistService.removeFromWishlist(product._id).subscribe({
        next: (res: any) => {
          this.toastr.success('Product removed from wishlist', 'Success');
          this.getWishlist();
          this.isCartUpdated = false;
        },
        error: (err: any) => {
          this.toastr.error('Failed to remove product from wishlist', 'Error');
          this.isCartUpdated = false;
        },
      });
    } else {
      this.wishlistService.addProductToWishlist(product._id).subscribe({
        next: (res: any) => {
          this.toastr.success('Product added to wishlist', 'Success');
          this.getWishlist();
          this.isCartUpdated = false;
        },
        error: (err: any) => {
          this.toastr.error('Failed to add product to wishlist', 'Error');
          this.isCartUpdated = false;
        },
      });
    }
  }

  addToCart(id: string) {
    this.isCartUpdated = true;
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        this.toastr.success('Product added to cart', 'Success');
        this.isCartUpdated = false;
        this.cartService.numOfCartItems.next(res.numOfCartItems);
      },
      error: (err) => {
        this.toastr.error('Failed to add product to cart', 'Error');
        this.isCartUpdated = false;
      },
    });
  }
}