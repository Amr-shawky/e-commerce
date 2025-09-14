import { Component, Input } from '@angular/core';
import { Product } from '../../../core/models/api.interface';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faHeart } from '@ng-icons/font-awesome/regular';
import { faSolidCartShopping } from '@ng-icons/font-awesome/solid';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, NgIcon, CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
  viewProviders: [provideIcons({ faHeart, faSolidCartShopping })],
})
export class ProductCardComponent {
  constructor(private cartService: CartService) {}
  @Input() product!: Product;
  addtocart1(id : string) {
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
        console.log(err);
        console.log(err);
        console.log(err);
        console.log(err);
        console.log(err);
      },
    });
  }
  hovered = true;

  toggleWishlist(product: Product) {
    console.log('Wishlist toggled:', product);
    // هنا تحط اللوجيك بتاع إضافة/إزالة من الـ wishlist
  }

  isInWishlist(product: Product): boolean {
    // ترجع true لو المنتج موجود في الـ wishlist
    return true;
  }

  addToCart(id : string) {
    // here you can add logic to add the product to the cart
    this.addtocart1(id);
    // console.log('Adding to cart:', product);
  }

  addToWishlist(product: Product) {
    console.log('Adding to wishlist:', product);
  }
}
