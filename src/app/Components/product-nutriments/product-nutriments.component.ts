import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OpenFoodFactsService } from '../../Services/open-food-facts.service';

@Component({
  selector: 'app-product-nutriments',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './product-nutriments.component.html',
  styleUrl: './product-nutriments.component.css'
})
export class ProductNutrimentsComponent {
  searchQuery: string = '';
  products: any[] = [];
  error = '';
  openFoodFactsService: OpenFoodFactsService = inject(OpenFoodFactsService);
  selectedProduct: any = null;

  searchProducts() {
    if (!this.searchQuery.trim()) {
      this.error = 'Wprowadź frazę do wyszukiwania.';
      this.products = [];
      return;
    }
  
    this.openFoodFactsService.searchProductsByName(this.searchQuery).subscribe({
      next: (response) => {
        console.log('Odpowiedź z API:', response); // Debugowanie
        if (response.products && response.products.length > 0) {
          this.products = response.products;
          this.error = '';
        } else {
          this.products = [];
          this.error = 'Nie znaleziono produktów dla podanej frazy.';
        }
      },
      error: (err) => {
        console.error('Błąd podczas żądania:', err);
        this.products = [];
        this.error = 'Wystąpił błąd podczas pobierania danych.';
      },
    });
  }
  selectProduct(product: any) {
    this.selectedProduct = product;
  }
}
