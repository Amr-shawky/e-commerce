import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../../core/models/api.interface';
import { ProductService } from '../../../../core/services/product.service';
import { CartService } from '../../../../core/services/cart.service';
import { ModeService } from '../../../../core/services/mode.service';
import { ToastrService } from 'ngx-toastr';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CarouselModule, SpinnerComponent,CommonModule],
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css'],
})
export class ProductDetails implements OnInit, OnDestroy {
  product: Product | null = null;
  isFirstLoading: boolean = true;
  isLoading: boolean = false;
  errorMessage: string = '';
  currentImageIndex: number = 0;
  private modeSubscription!: Subscription;
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);
  private modeService = inject(ModeService);

  carouselOptions: OwlOptions = {
    loop: true,
    margin: 10,
    nav: true,
    dots: true,
    items: 1,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    navText: [
      '<i class="fa-regular fa-circle-left text-2xl"></i>',
      '<i class="fa-regular fa-circle-right text-2xl"></i>',
    ],
  };

  ngOnInit(): void {
    this.modeSubscription = this.modeService.mode.subscribe((mode) => {
      console.log('ProductDetailsComponent: Mode changed to:', mode); // Debugging
    });
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.getProductDetails(id);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.modeSubscription) {
      this.modeSubscription.unsubscribe();
    }
  }

  get isDarkMode(): boolean {
    return this.modeService.mode.value === 'dark';
  }

  getProductDetails(id: string) {
    this.isFirstLoading = true;
    this.isLoading = true;
    this.productService.getProductDetails(id).subscribe({
      next: (response: { data: Product | null }) => {
        this.product = response.data;
        this.isFirstLoading = false;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Error fetching product details';
        console.error(error);
        this.isFirstLoading = false;
        this.isLoading = false;
      },
    });
  }

  addToCart(productId: string) {
    this.isLoading = true;
    this.cartService.addProductToCart(productId).subscribe({
      next: (response) => {
        this.toastr.success('Product added to cart successfully', 'Success');
        this.cartService.numOfCartItems.next(response.numOfCartItems);
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error('Failed to add product to cart', 'Error');
        console.error(error);
        this.isLoading = false;
      },
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