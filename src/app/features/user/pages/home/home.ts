import { CategoryService } from './../../../../core/services/category.service';
import { ProductService } from './../../../../core/services/product.service';
import { Component, Inject } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
// NgIcon,
import { faCalendarCheck } from '@ng-icons/font-awesome/regular';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import {
  Product,
  Category,
  Metadata,
  PaginationParameters,
} from '../../../../core/models/api.interface';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [ProductCardComponent, CarouselModule, SpinnerComponent,FormsModule],
  // NgIcon,
  templateUrl: './home.html',
  styleUrl: './home.css',
  viewProviders: [provideIcons({ faCalendarCheck })],
})
export class Home {
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 600,
    navText: ['<', '>'],
    margin: 10,
    // i want to make margin at y axis 20
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      1000: {
        items: 4,
      },
      1200: {
        items: 8,
      },
    },

    autoplay: true,
    autoplaySpeed: 500,

    nav: true,
  };
  categories: Category[] = [];

  isLoading = false;
  isCartUpdated: boolean = false;
  products: Product[] = [];
  paginationparams: PaginationParameters = { limit: 28, page: 1 };
  metadata: Metadata = {
    limit: this.paginationparams.limit || 28,
    currentPage: this.paginationparams.page || 1,
    numberOfPages: 1,
    nextPage: 2,
  };
  pages: number[] = [];
  constructor(
    private productservices: ProductService,
    @Inject(CategoryService) private categoryService: CategoryService
  ) {}

  getAllCategories() {
    this.categoryService.getAllCategories({}).subscribe({
      next: (response) => {
        console.log(response.data);
        this.categories = response.data;
      },

      error: (error) => {
        // !!!
        console.log(error);
      },
    });
  }
  getAllProducts(params: PaginationParameters = this.paginationparams) {
    this.isLoading = true;
    this.productservices.getAllProducts(params).subscribe({
      next: (response: { data: Product[]; metadata: Metadata }) => {
        console.log(response.data);
        this.products = response.data;
        this.metadata = response.metadata;
        const total = Math.max(1, this.metadata.numberOfPages || 1);
        if(params.limit!>=56||this.paginationparams.limit!>=56){
          this.metadata.numberOfPages=1
          this.pages=[1]
        }
        else{
          this.pages = Array.from({ length: total }, (_, i) => i + 1);
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        console.log(error);
      },
    });
  }
  changePage(page: number) {
    // guard clauses
    if (page < 1 || page > (this.metadata.numberOfPages || 1)) return;
    if (page === this.paginationparams.page) return;
    if (this.isLoading) return;

    // update immutably (safer)
    this.paginationparams = { ...this.paginationparams, page };
    console.log('changePage ->', page);
    this.getAllProducts();
  }
  ngOnInit() {
    this.getAllProducts();
    this.getAllCategories();
  }
  onChangeLimit(event: Event) {
  const selectedValue = Number((event.target as HTMLSelectElement).value);

  // نرّجع للصفحة الأولى عشان البيانات متتلغبطش
  this.paginationparams = { ...this.paginationparams, limit: selectedValue, page: 1 };

  console.log('Selected per page ->', selectedValue);

  // استدعاء API تاني بالـ limit الجديد
  this.getAllProducts(this.paginationparams);
}

}
//
