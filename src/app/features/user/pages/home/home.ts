import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {faCalendarCheck} from '@ng-icons/font-awesome/regular'

@Component({
  selector: 'app-home',
  imports: [NgIcon],
  templateUrl: './home.html',
  styleUrl: './home.css',
    viewProviders: [provideIcons({faCalendarCheck })]
})
export class Home {
  products = [1,2,3,4,5,2,5,6]
}
//