import { Component } from '@angular/core';
import { ProductCard } from './../../components/product-card/product-card';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {faCalendarCheck} from '@ng-icons/font-awesome/regular'

@Component({
  selector: 'app-home',
  imports: [ProductCard , NgIcon],
  templateUrl: './home.html',
  styleUrl: './home.css',
    viewProviders: [provideIcons({faCalendarCheck })]
})
export class Home {
  products = [1,2,3,4,5,2,5,6]
}
//