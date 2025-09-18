import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ModeService } from '../../../../core/services/mode.service';
import { Category } from '../../../../core/models/api.interface';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../../core/services/category.service';
@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [SpinnerComponent,CommonModule],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css'],
})
export class Categories implements OnInit, OnDestroy {
  Categories: Category[] = [];
  isFirstLoading: boolean = true;
  isLoading: boolean = false;
  private modeSubscription!: Subscription;
  private categoryService = inject(CategoryService);
  private modeService = inject(ModeService);

  ngOnInit() {
    this.modeSubscription = this.modeService.mode.subscribe((mode) => {
      console.log('CategoriesComponent: Mode changed to:', mode); // Debugging
    });
    this.getCategories();
  }

  ngOnDestroy(): void {
    if (this.modeSubscription) {
      this.modeSubscription.unsubscribe();
    }
  }

  get isDarkMode(): boolean {
    return this.modeService.mode.value === 'dark';
  }

  getCategories() {
    if (!this.Categories.length) {
      this.isFirstLoading = true; // Show skeleton on initial load
    } else {
      this.isLoading = true; // Show spinner for updates
    }
    this.categoryService.getAllCategories({}).subscribe({
      next: (categories) => {
        this.Categories = categories.data;
        console.log(categories);
        this.isFirstLoading = false;
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.isFirstLoading = false;
        this.isLoading = false;
      },
    });
  }
}