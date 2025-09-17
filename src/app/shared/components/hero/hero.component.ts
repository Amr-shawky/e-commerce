import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent {
  // Optional: Add properties if needed, e.g., for dynamic content
  title = 'Welcome to Our Store';
  subtitle = 'Discover a wide range of clothes, laptops, TVs, and more!';
}
