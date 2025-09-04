import { CategoryService } from './../../../../core/services/category.service';
import { ProductService } from './../../../../core/services/product.service';
import { Component, Inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {faCalendarCheck} from '@ng-icons/font-awesome/regular'
import { ProductCardComponent } from "../../../../shared/components/product-card/product-card.component";
import { Product ,Category} from '../../../../core/models/api.interface';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-home',
  imports: [NgIcon, ProductCardComponent, CarouselModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
    viewProviders: [provideIcons({faCalendarCheck })]
})
export class Home {
    customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: ['<i class="fa fa-home"></i>', 'next'],
    margin : 10 ,

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
      next: (response: { data: Product[]; }) => {
        this.isLoading = false;
        console.log(response.data);
        this.products = response.data;
      },

      error: (error: any) => {
        this.isLoading = false;
        // !!!
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