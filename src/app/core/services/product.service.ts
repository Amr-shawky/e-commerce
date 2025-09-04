import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, Response } from '../models/api.interface';

interface PaginationParameters {
  limit?: number;
  page?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  baseUrl = `https://ecommerce.routemisr.com/api/v1`;
  endPoint = `/products`;

  constructor(private http: HttpClient) {}

  // !!!
  getAllProducts({
    limit = 40,
    page = 1,
  }: PaginationParameters): Observable<Response<Product>> {
    return this.http.get<Response<Product>>(
      `${this.baseUrl}${this.endPoint}?limit=${limit}&page=${page}`
    );
  }

  //! 
  getProductDetails(productId : string | null) 
   :Observable<{data : Product}> {
    return this.http.get<{data: Product}>(`${this.baseUrl}${this.endPoint}/${productId}`)
  }




}


