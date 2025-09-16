import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { wishlistService } from '../../../../core/services/wishlist.service';
import { Product, wishlistResponse } from '../../../../core/models/api.interface';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule, RouterLink, SpinnerComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent implements OnInit {
  wishlistproducts: Product[] = [];
  isLoading: boolean = false;

  constructor(
    private wishlistService: wishlistService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getwishlist();
  }

  getwishlist() {
    this.isLoading = true;
    this.wishlistService.getwishlist().subscribe({
      next: (response: wishlistResponse) => {
        this.wishlistproducts = response.data || [];
        this.toastr.success('Wishlist loaded successfully', 'Success');
        console.log('Wishlist fetched:', this.wishlistproducts);
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error('Failed to load wishlist: ' + error.message, 'Error');
        console.log(error);
        this.isLoading = false;
      },
    });
  }

  removeFromWishlist(productId: string) {
    this.isLoading = true;
    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: (res: any) => {
        this.toastr.success('Product removed from wishlist', 'Success');
        this.getwishlist(); // Refresh wishlist
      },
      error: (err: any) => {
        this.toastr.error('Failed to remove product from wishlist', 'Error');
        this.isLoading = false;
      },
    });
  }
}