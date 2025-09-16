import { Component, Input, OnInit } from '@angular/core';
import { Product, wishlistResponse } from '../../../core/models/api.interface';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faHeart } from '@ng-icons/font-awesome/regular';
import { faSolidHeart } from '@ng-icons/font-awesome/solid'; // Added for filled heart
import { faSolidCartShopping } from '@ng-icons/font-awesome/solid';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { SpinnerComponent } from '../spinner/spinner.component';
import { wishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, NgIcon, CommonModule, RouterLink, SpinnerComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
  viewProviders: [provideIcons({ faHeart, faSolidHeart, faSolidCartShopping })],
})
export class ProductCardComponent implements OnInit {
  constructor(
    private cartService: CartService,
    private toastr: ToastrService,
    private wishlistService: wishlistService
  ) {}

  isCartUpdated: boolean = false;
  wishlistproducts: Product[] = [];
  @Input() product!: Product;

  ngOnInit(): void {
    this.getWishlist();
  }

  getWishlist() {
    this.wishlistService.getwishlist().subscribe({
      next: (res: wishlistResponse) => {
        this.wishlistproducts = res.data || []; // Ensure empty array if res.data is null
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
      // Remove from wishlist
      this.wishlistService.removeFromWishlist(product._id).subscribe({
        next: (res: any) => {
          this.toastr.success('Product removed from wishlist', 'Success');
          this.getWishlist(); // Refresh wishlist
          this.isCartUpdated = false;
        },
        error: (err: any) => {
          this.toastr.error('Failed to remove product from wishlist', 'Error');
          this.isCartUpdated = false;
        },
      });
    } else {
      // Add to wishlist
      this.wishlistService.addProductToWishlist(product._id).subscribe({
        next: (res: any) => {
          this.toastr.success('Product added to wishlist', 'Success');
          this.getWishlist(); // Refresh wishlist
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