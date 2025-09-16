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
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [
    ProductCardComponent,
    CarouselModule,
    SpinnerComponent,
    FormsModule,
  ],
  // NgIcon,
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
  allfilteredproductscount: number = 0;
  allfilteredproducts: Product[] = [];
  allproducts: Product[] = [];
  results: number = 0;
  categories: Category[] = [];

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
    @Inject(CategoryService) private categoryService: CategoryService
  ) {}
getallproducts(){
  this.productservices.getAllProducts({limit: 100,page: 1}).subscribe({
    next: (response) => {
      this.allproducts = response.data;
    },
    error: (error) => {
      console.log(error);
    }
  });
};
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
      next: (response: {
        data: Product[];
        metadata: Metadata;
        results: number;
      }) => {
        console.log(response.data);
        this.products = response.data;
        this.results = response.results;
        this.Filteredproducts.next(
          this.products.filter((product) =>
            product.title.toLowerCase().includes(this.searchTerm.toLowerCase())
          )
        );
        this.metadata = response.metadata;
        const total = Math.max(1, this.metadata.numberOfPages || 1);
        if (params.limit! >= 56 || this.paginationparams.limit! >= 56) {
          this.metadata.numberOfPages = 1;
          this.pages = [1];
        } else {
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
    this.metadata.currentPage = page;
    this.paginationparams = { ...this.paginationparams, page };
    console.log('changePage ->', page);
    if(this.allfilteredproducts.length>0){
      this.Filteredproducts.next(this.allfilteredproducts.slice(this.metadata.currentPage! * this.metadata.limit!, (this.metadata.currentPage! + 1) * this.metadata.limit!));
    }
    else{
      this.getAllProducts();
    }
  }
  ngOnInit() {
    this.getAllProducts();
    this.getAllCategories();
    setTimeout(() => {
      this.paginationparams = { ...this.paginationparams }; // Force change detection
    }, 0);
    console.log(this.paginationparams);
    this.getallproducts();
  }
  onChangeLimit(event: Event) {
    const selectedValue = Number((event.target as HTMLSelectElement).value);
    this.paginationparams = {
      ...this.paginationparams,
      limit: selectedValue,
      page: 1,
    };
    console.log('Selected per page ->', selectedValue);
    this.getAllProducts(this.paginationparams);
  }
  converttoarray(num: number): number[] {
    const arr: number[] = [];
    for (let i = 1; i <= num; i++) {
      arr.push(i);
    }
    return arr;
  }
  search(query: string , page: number = 1) {
    query = query.toLowerCase();
    this.searchTerm = query;
    console.log('Search query:', query);
    // Filter products based on the search query
    this.allfilteredproductscount = this.allproducts.filter((product) =>
      product.title.toLowerCase().includes(query)
    ).length;

    console.log('Filtered products count:', this.allfilteredproductscount);

    this.allfilteredproducts=this.allproducts.filter((product) =>
        product.title.toLowerCase().includes(query)
      )

    this.Filteredproducts.next(
      this.allfilteredproducts.slice(this.metadata.currentPage! * this.metadata.limit!, (this.metadata.currentPage! + 1) * this.metadata.limit!)
    );
    const productscount: number = this.allfilteredproductscount;
    const limit = this.metadata.limit;
    const nofpages = Math.ceil(productscount/ limit);
    if (query.trim() === '') {
      console.log('Empty search query, resetting to all products.');
      console.log('Total products count:', this.results);
      this.metadata.numberOfPages = Math.ceil(this.results / limit);
      console.log('limit:', limit);
      console.log('Number of pages:', this.metadata.numberOfPages);
      this.pages = this.converttoarray(this.metadata.numberOfPages);
      console.log('Pages array:', this.pages);
    } else {
      console.log('Filtered products count:', productscount);
      console.log('limit:', limit);
      console.log('Number of pages:', nofpages);
      this.metadata.numberOfPages = nofpages;
      this.pages = this.converttoarray(this.metadata.numberOfPages);

      console.log('Pages array:', this.pages);
    }
  }
}
