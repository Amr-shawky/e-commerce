import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { BrandService } from '../../../../core/services/brand.service';
import { ModeService } from '../../../../core/services/mode.service';
import { Brand } from '../../../../core/models/api.interface';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [SpinnerComponent,CommonModule],
  templateUrl: './brands.html',
  styleUrls: ['./brands.css'],
})
export class Brands implements OnInit, OnDestroy {
  Brands: Brand[] = [];
  isFirstLoading: boolean = true;
  isLoading: boolean = false;
  private modeSubscription!: Subscription;
  private brandService = inject(BrandService);
  private modeService = inject(ModeService);

  ngOnInit() {
    this.modeSubscription = this.modeService.mode.subscribe((mode) => {
      console.log('BrandsComponent: Mode changed to:', mode); // Debugging
    });
    this.getbrands();
  }

  ngOnDestroy(): void {
    if (this.modeSubscription) {
      this.modeSubscription.unsubscribe();
    }
  }

  get isDarkMode(): boolean {
    return this.modeService.mode.value === 'dark';
  }

  getbrands() {
    if (!this.Brands.length) {
      this.isFirstLoading = true; // Show skeleton on initial load
    } else {
      this.isLoading = true; // Show spinner for updates
    }
    this.brandService.getAllBrands({ limit: 40, page: 1 }).subscribe({
      next: (brands) => {
        console.log(brands.data);
        this.Brands = brands.data;
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