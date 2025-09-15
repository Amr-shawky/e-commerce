import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartResponse } from '../models/api.interface';
import { HttpClient } from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cookies = inject(CookieService) ;

  numOfCartItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  baseUrl = `https://ecommerce.routemisr.com/api/v1`;
  endPoint = `/cart`;

  constructor(private http: HttpClient) {}

  //   !!! addToCart (156456785)
  addProductToCart(productId: string): Observable<any> {
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

  // !!! getCart
  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${this.baseUrl}${this.endPoint}`, {
      headers: {
        token: this.cookies.get('token') || '',
      },
    });
  }

  // !! updateCount
  updateProductCount(
    productId: string,
    count: number
  ): Observable<CartResponse> {
    return this.http.put<CartResponse>(
      `${this.baseUrl}${this.endPoint}/${productId}`,
      { count },
      {
        headers: {
          token: this.cookies.get('token') || '',
        },
      }
    );
  }

  //! removeProduct
  clearSpecificProduct(productId: string): Observable<CartResponse> {
    return this.http.delete<CartResponse>(
      `${this.baseUrl}${this.endPoint}/${productId}`,
      {
        headers: {
          token: this.cookies.get('token') || '',
        },
      }
    );
  }

  //! clearCart
  clearCart(): Observable<any> {
    return this.http.delete(`${this.baseUrl}${this.endPoint}`, {
      headers: {
        token: this.cookies.get('token') || '',
      },
    });
  



}
  checkOutSession(id: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/orders/checkout-session/${id}?url=http://localhost:4200`,
      {
        shippingAddress: {
          details: 'details',
          phone: '01010800921',
          city: 'Cairo',
        },
      },
      {
        headers: {
          token: this.cookies.get('token') || '',
        },
      }
    );
  }
}