import { CategoryService } from './../../../../core/services/category.service';
import { ProductService } from './../../../../core/services/product.service';
import { Component, Inject } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { faCalendarCheck } from '@ng-icons/font-awesome/regular';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { Product, Category, Metadata, PaginationParameters } from '../../../../core/models/api.interface';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { HeroComponent } from "../../components/hero/hero.component";

@Component({
  imports: [
    ProductCardComponent,
    CarouselModule,
    SpinnerComponent,
    FormsModule,
    HeroComponent,
    FormsModule,
],
  templateUrl: './home.html',
  styleUrl: './home.css',
  viewProviders: [provideIcons({ faCalendarCheck })],
})
export class Home {
  //#region variables
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 600,
    navText: ['<', '>'],
    margin: 10,
    responsive: {
      0: { items: 1 },
      400: { items: 2 },
      740: { items: 3 },
      1000: { items: 4 },
      1200: { items: 8 },
    },
    autoplay: true,
    autoplaySpeed: 500,
    nav: true,
  };
  allfilteredproductscount: number = 0;
  allfilteredproducts: Product[] = [];
  allproducts: Product[] = [];
  results: number = 0;
  categories: Category[] = [];
  isLoading = false;
  isCartUpdated: boolean = false;
  Filteredproducts: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
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
    @Inject(CategoryService) private categoryService: CategoryService
  ) {}

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

  getAllCategories() {
    this.categoryService.getAllCategories({}).subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (error) => {
        console.log(error);
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
    this.getallproducts();
    this.getAllCategories();
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