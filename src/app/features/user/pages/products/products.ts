import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../core/models/api.interface';
import { ProductService } from '../../../../core/services/product.service';
import { ProductCardComponent } from "../../../../shared/components/product-card/product-card.component";

@Component({
  selector: 'app-products',
  imports: [ProductCardComponent],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit{
 isLoading = false;

  products:Product[]=[];
  constructor(
    private productservices: ProductService
  ){}
  getAllProducts() {
  this.isLoading = true;
    this.productservices.getAllProducts({ limit: 40, page: 1 }).subscribe({
      next: (response: { data: Product[] }) => {
        console.log(response.data);
        this.products = response.data;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        console.log(error);
      },
    });

}



  ngOnInit(){
    this.getAllProducts();
  }

}
