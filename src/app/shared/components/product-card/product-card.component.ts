import { Component, Input } from '@angular/core';
import { Product } from '../../../core/models/api.interface';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faHeart } from '@ng-icons/font-awesome/regular';
import { faSolidCartShopping } from '@ng-icons/font-awesome/solid';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, NgIcon,CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
  viewProviders: [provideIcons({ faHeart, faSolidCartShopping })],
})
export class ProductCardComponent {
  hovered = true;

  toggleWishlist(product: Product) {
  console.log('Wishlist toggled:', product);
  // هنا تحط اللوجيك بتاع إضافة/إزالة من الـ wishlist
}

isInWishlist(product: Product): boolean {
  // ترجع true لو المنتج موجود في الـ wishlist
  return true;
}
  @Input() product!: Product;

  addToCart(product: Product) {
    console.log('Adding to cart:', product);
  }

  addToWishlist(product: Product) {
    console.log('Adding to wishlist:', product);
  }
}
