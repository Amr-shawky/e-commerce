import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  items: any[] = [];
  constructor(private cartService: CartService) {}
  getallcarts() {
    this.cartService.getCart().subscribe({
      next: (res) => {
        console.log(res);
        this.items = res.data.products;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  ngOnInit() {
    this.getallcarts();
  }

}
