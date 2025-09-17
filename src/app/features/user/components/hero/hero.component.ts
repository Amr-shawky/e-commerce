import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModeService } from '../../../../core/services/mode.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
})
export class HeroComponent implements OnInit, OnDestroy {
  title = 'Welcome to Our Store';
  subtitle = 'Discover a wide range of clothes, laptops, TVs, and more!';
  private modeService = inject(ModeService);
  private modeSubscription!: Subscription;

  ngOnInit(): void {
    this.modeSubscription = this.modeService.mode.subscribe((mode) => {
      console.log('HeroComponent: Mode changed to:', mode); // Debugging
    });
  }

  ngOnDestroy(): void {
    if (this.modeSubscription) {
      this.modeSubscription.unsubscribe();
    }
  }

  get isDarkMode(): boolean {
    return this.modeService.mode.value === 'dark';
  }
}