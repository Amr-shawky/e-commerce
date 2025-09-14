import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../../core/services/category.service';
import { Category } from '../../../../core/models/api.interface';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories implements OnInit {
  constructor(private categoryService: CategoryService) {}
  Categories: Category[] = [];
  ngOnInit() {
    this.getCategories();
  }
  getCategories() {
    return this.categoryService.getAllCategories({}).subscribe({
      next: (categories) => {
        this.Categories = categories.data;
        console.log(categories);
      },
      error: (error) => {
        console.error(error);
      }
    });
}
}
