import { Component, Input } from '@angular/core';
import { Product } from '../../../core/models/api.interface';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input()
  product!: Product;
  addToCart(product: Product) {
    console.log('Adding to cart:', product);
  }
}
