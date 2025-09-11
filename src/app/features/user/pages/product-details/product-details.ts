import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../../core/models/api.interface';
import { ProductService } from './../../../../core/services/product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-details',
  imports: [],
 templateUrl: './product-details.html',
  styleUrls: ['./product-details.css']
})

export class ProductDetails implements OnInit {
  product: Product | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  currentImageIndex: number = 0;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.getProductDetails(id);
      }
    });
  }

  getProductDetails(id: string) {
    this.isLoading = true;
    this.productService.getProductDetails(id).subscribe({
      next: (response: { data: Product | null }) => {
        this.product = response.data; 
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Error fetching product details';
        console.error(error);
        this.isLoading = false;
      }
    });
  }

  setImage(index: number) {
    this.currentImageIndex = index;
  }

  prevImage() {
    if (!this.product) return;
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.product.images.length) %
      this.product.images.length;
  }

  nextImage() {
    if (!this.product) return;
    this.currentImageIndex =
      (this.currentImageIndex + 1) % this.product.images.length;
  }
}
