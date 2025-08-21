import { ProductCard } from './../../components/product-card/product-card';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  products = [1,2,3,4,5,2,5,6]
}
