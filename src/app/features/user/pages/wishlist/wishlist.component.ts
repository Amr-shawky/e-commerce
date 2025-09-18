import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { wishlistService } from '../../../../core/services/wishlist.service';
import { ModeService } from '../../../../core/services/mode.service';
import { Product, wishlistResponse } from '../../../../core/models/api.interface';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink, SpinnerComponent],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit, OnDestroy {
  wishlistproducts: Product[] = [];
  isFirstLoading: boolean = true;
  isLoading: boolean = false;
  private modeSubscription!: Subscription;
  private wishlistService = inject(wishlistService);
  private toastr = inject(ToastrService);
  private modeService = inject(ModeService);

  ngOnInit(): void {
    this.modeSubscription = this.modeService.mode.subscribe((mode) => {
      console.log('WishlistComponent: Mode changed to:', mode); // Debugging
    });
    this.getwishlist();
  }

  ngOnDestroy(): void {
    if (this.modeSubscription) {
      this.modeSubscription.unsubscribe();
    }
  }

  get isDarkMode(): boolean {
    return this.modeService.mode.value === 'dark';
  }

  getwishlist() {
    if (!this.wishlistproducts.length) {
      this.isFirstLoading = true; // Show skeleton on initial load
    } else {
      this.isLoading = true; // Show spinner for updates
    }
    this.wishlistService.getwishlist().subscribe({
      next: (response: wishlistResponse) => {
        this.wishlistproducts = response.data || [];
        this.toastr.success('Wishlist loaded successfully', 'Success');
        console.log('Wishlist fetched:', this.wishlistproducts);
        this.isFirstLoading = false;
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error('Failed to load wishlist: ' + error.message, 'Error');
        console.log(error);
        this.isFirstLoading = false;
        this.isLoading = false;
      },
    });
  }

  removeFromWishlist(productId: string) {
    this.isLoading = true; // Show spinner during removal
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