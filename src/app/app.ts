import { Component, inject, OnDestroy, OnInit, PLATFORM_ID, REQUEST } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./shared/components/navbar/navbar.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './core/services/auth.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { ModeService } from './core/services/mode.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected title = 'e-commerce';
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);
  private request = inject(REQUEST);
  private cookies = inject(CookieService);
  private modeService = inject(ModeService);
  private modeSubscription!: Subscription;

  ngOnInit(): void {
    // Subscribe to mode changes
    this.modeSubscription = this.modeService.mode.subscribe((mode) => {
      console.log('AppComponent: Mode changed to:', mode); // Debugging
    });

    // Existing token logic
    let token;
    if (isPlatformBrowser(this.platformId)) {
      token = this.cookies.get('token');
    } else {
      token = this.authService.getCookieValue(this.request?.headers.get('cookie') || '', 'token');
    }
    if (token) {
      this.authService.decodeToken(token);
    }
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