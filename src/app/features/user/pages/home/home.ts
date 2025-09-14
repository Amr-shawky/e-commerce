import { CategoryService } from './../../../../core/services/category.service';
import { ProductService } from './../../../../core/services/product.service';
import { Component, Inject } from '@angular/core';
import {provideIcons } from '@ng-icons/core';
// NgIcon,
import {faCalendarCheck} from '@ng-icons/font-awesome/regular'
import { ProductCardComponent } from "../../../../shared/components/product-card/product-card.component";
import { Product ,Category} from '../../../../core/models/api.interface';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { SpinnerComponent } from "../../../../shared/components/spinner/spinner.component";

@Component({
  selector: 'app-home',
  imports: [ProductCardComponent, CarouselModule, SpinnerComponent],
  // NgIcon, 
  templateUrl: './home.html',
  styleUrl: './home.css',
    viewProviders: [provideIcons({faCalendarCheck})]
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
  products:Product[]=[];
  constructor(
    private productservices: ProductService,
    @Inject(CategoryService) private categoryService: CategoryService
  ){}
  
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
    this.getAllCategories();
  }

}
//