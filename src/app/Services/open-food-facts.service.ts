import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OpenFoodFactsService {
  private http: HttpClient = inject(HttpClient);
  private apiUrl: string = 'https://world.openfoodfacts.org/api/v0/product';
  private apiBaseUrl = 'https://world.openfoodfacts.org/api/v0/product';
  constructor() {}

  // Pobierz szczegóły produktu na podstawie jego kodu kreskowego
  getProductByBarcode(barcode: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${barcode}.json`);
  }

  // Wyszukaj produkty na podstawie zapytania
  searchProducts(query: string): Observable<any> {
    const searchUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&json=1`;
    return this.http.get<any>(searchUrl);
  }
  getProductNutrition(barcode: string): Observable<any> {
    const url = `${this.apiBaseUrl}/${barcode}.json`;
    return this.http.get<any>(url);
  }
  searchProductsByName(name: string): Observable<any> {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(name)}&search_simple=1&action=process&json=1`;
    console.log('Wysyłanie żądania do URL:', url); // Debugowanie
    return this.http.get<any>(url);
  }

}
