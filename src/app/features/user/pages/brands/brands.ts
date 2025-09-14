import { Component, OnInit } from '@angular/core';
import { BrandService } from '../../../../core/services/brand.service';
import { error } from 'console';
import { Brand } from '../../../../core/models/api.interface';

@Component({
  selector: 'app-brands',
  imports: [],
  templateUrl: './brands.html',
  styleUrl: './brands.css'
})
export class Brands implements OnInit {
  constructor(private brandService: BrandService) {}

  Brands:Brand[]=[];
  getbrands() {
    return this.brandService.getAllBrands({limit: 40,page: 1}).subscribe({
      next: (brands) => {
        console.log(brands.data);
        this.Brands = brands.data;
      },
      error: (error) => {
        console.error(error);
      }
    }); 
  }
  ngOnInit() {
    this.getbrands();
  }
}
