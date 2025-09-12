import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand, Product, Response } from '../models/api.interface';

interface PaginationParameters {
  limit?: number;
  page?: number;
}

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  baseUrl = `https://ecommerce.routemisr.com/api/v1`;
  endPoint = `/brands`;

  constructor(private http: HttpClient) {}

  // !!!
  getAllBrands({
    limit = 40,
    page = 1,
  }: PaginationParameters): Observable<Response<Brand>> {
    return this.http.get<Response<Brand>>(
      `${this.baseUrl}${this.endPoint}?limit=${limit}&page=${page}`
    );
  }

  //! 
  getBrandDetails(brandId : string | null) 
   :Observable<{data : Brand}> {
    return this.http.get<{data: Brand}>(`${this.baseUrl}${this.endPoint}/${brandId}`)
  }




}

