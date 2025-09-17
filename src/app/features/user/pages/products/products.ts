import { Component, OnInit,Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from './../../../../core/services/category.service';
import { ProductService } from './../../../../core/services/product.service';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import {
  Product,
  Category,
  Metadata,
  PaginationParameters,
} from '../../../../core/models/api.interface';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ModeService } from '../../../../core/services/mode.service';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-products',
  imports: [
    ProductCardComponent,
    SpinnerComponent,
    FormsModule,
    CommonModule
  ],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit{
   //#region variables

  private modeSubscription!: Subscription;
  allfilteredproductscount: number = 0;
  allfilteredproducts: Product[] = [];
  allproducts: Product[] = [];
  results: number = 0;
  isLoading = false;
  isCartUpdated: boolean = false;
  Filteredproducts: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(
    []
  );
  products: Product[] = [];
  searchTerm: string = '';
  paginationparams: PaginationParameters = { limit: 28, page: 1 };
  metadata: Metadata = {
    limit: this.paginationparams.limit || 28,
    currentPage: this.paginationparams.page || 1,
    numberOfPages: 1,
    nextPage: 2,
  };
  pages: number[] = [];

  //#endregion

  constructor(
    private productservices: ProductService,
    private modeService: ModeService
  ) {}
  get isDarkMode(): boolean {
    return this.modeService.mode.value === 'dark';
  }
  getallproducts() {
    this.isLoading = true;
    this.productservices.getAllProducts({ limit: 100, page: 1 }).subscribe({
      next: (response) => {
        this.allproducts = response.data;
        this.results = response.data.length;
        this.allfilteredproducts = this.allproducts; // Initialize filtered products
        this.allfilteredproductscount = this.allproducts.length;
        // Set initial display to first 28 products
        this.Filteredproducts.next(
          this.allproducts.slice(0, this.paginationparams.limit)
        );
        this.metadata.numberOfPages = Math.ceil(
          this.allfilteredproductscount / this.metadata.limit
        );
        this.pages = this.converttoarray(this.metadata.numberOfPages);
        this.isLoading = false;
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
      },
    });
  }

  changePage(page: number) {
    if (page < 1 || page > (this.metadata.numberOfPages || 1)) return;
    if (page === this.paginationparams.page) return;
    if (this.isLoading) return;

    this.metadata.currentPage = page;
    this.paginationparams = { ...this.paginationparams, page };
    this.Filteredproducts.next(
      this.allfilteredproducts.slice(
        (this.metadata.currentPage! - 1) * this.metadata.limit!,
        this.metadata.currentPage! * this.metadata.limit!
      )
    );
  }

  ngOnInit() {
    // Subscribe to mode changes
    this.modeSubscription = this.modeService.mode.subscribe((mode) => {
      console.log('Mode changed to:', mode); // Debugging
    });
    this.getallproducts();
    setTimeout(() => {
      this.paginationparams = { ...this.paginationparams };
    }, 0);
  }

  onChangeLimit(event: Event) {
    const selectedValue = Number((event.target as HTMLSelectElement).value);
    this.paginationparams = {
      ...this.paginationparams,
      limit: selectedValue,
      page: 1,
    };
    this.metadata.limit = selectedValue;
    this.metadata.currentPage = 1;
    this.metadata.numberOfPages = Math.ceil(
      this.allfilteredproductscount / selectedValue
    );
    this.pages = this.converttoarray(this.metadata.numberOfPages);
    this.Filteredproducts.next(
      this.allfilteredproducts.slice(
        (this.metadata.currentPage! - 1) * this.metadata.limit!,
        this.metadata.currentPage! * this.metadata.limit!
      )
    );
  }

  converttoarray(num: number): number[] {
    const arr: number[] = [];
    for (let i = 1; i <= num; i++) {
      arr.push(i);
    }
    return arr;
  }

  search(query: string, page: number = 1) {
    query = query.toLowerCase();
    this.searchTerm = query;
    this.allfilteredproducts = this.allproducts.filter((product) =>
      product.title.toLowerCase().includes(query)
    );
    this.allfilteredproductscount = this.allfilteredproducts.length;

    this.metadata.currentPage = page;
    this.paginationparams.page = page;
    this.metadata.numberOfPages = Math.ceil(
      this.allfilteredproductscount / this.metadata.limit
    );
    this.pages = this.converttoarray(this.metadata.numberOfPages);

    this.Filteredproducts.next(
      this.allfilteredproducts.slice(
        (this.metadata.currentPage! - 1) * this.metadata.limit!,
        this.metadata.currentPage! * this.metadata.limit!
      )
    );

    if (query.trim() === '') {
      this.allfilteredproducts = this.allproducts;
      this.allfilteredproductscount = this.allproducts.length;
      this.metadata.numberOfPages = Math.ceil(
        this.allfilteredproductscount / this.metadata.limit
      );
      this.pages = this.converttoarray(this.metadata.numberOfPages);
      this.Filteredproducts.next(
        this.allfilteredproducts.slice(
          (this.metadata.currentPage! - 1) * this.metadata.limit!,
          this.metadata.currentPage! * this.metadata.limit!
        )
      );
    }
  }
}
