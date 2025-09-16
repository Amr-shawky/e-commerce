import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {  } from '../models/api.interface';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class wishlistService {
  private cookies = inject(CookieService);

  numOfCartItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  baseUrl = `https://ecommerce.routemisr.com/api/v1`;
  endPoint = `/wishlist`;
  CartId: BehaviorSubject<string> = new BehaviorSubject<string>('');
  constructor(private http: HttpClient) {}

  //   !!! addToWishlist (156456785)
  addProductToWishlist(productId: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}${this.endPoint}`,
      { productId },
      {
        headers: {
          token: this.cookies.get('token') || '',
        },
      }
    );
  }

  // !!! getwishlist
  getwishlist(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${this.endPoint}`, {
      headers: {
        token: this.cookies.get('token') || '',
      },
    });
  }


  //! Remove product from wishlist
  removeFromWishlist(productId: string): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}${this.endPoint}/${productId}`,
      {
        headers: {
          token: this.cookies.get('token') || '',
        },
      }
    );
  }

  //! clearCart

}
