import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, Product, Response } from '../models/api.interface';

interface PaginationParameters {
  limit?: number;
  page?: number;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  baseUrl = `https://ecommerce.routemisr.com/api/v1`;
  endPoint = `/categories`;

  constructor(private http: HttpClient) {}

  // !!!
  getAllCategories({
    limit = 40,
    page = 1,
  }: PaginationParameters): Observable<Response<Category>> {
    return this.http.get<Response<Category>>(
      `${this.baseUrl}${this.endPoint}?limit=${limit}&page=${page}`
    );
  }

  //! 
  getCategoryDetails(categoryId : string | null) 
   :Observable<{data : Product}> {
    return this.http.get<{data: Product}>(`${this.baseUrl}${this.endPoint}/${categoryId}`)
  }




}


