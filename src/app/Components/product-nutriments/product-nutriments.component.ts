import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OpenFoodFactsService } from '../../Services/open-food-facts.service';
import { TrainingAndMealService } from '../../Services/calendar.service';
import { mealModel } from '../../Models/meal.model';

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
  nutriments: number = 0;
  openFoodFactsService: OpenFoodFactsService = inject(OpenFoodFactsService);
  trainingAndMealService: TrainingAndMealService  = inject(TrainingAndMealService);
  selectedProduct: any = null;
  showDialog: boolean = false;  // Flag do kontrolowania wyświetlania dialogu
  calories: number = 0; // Przech
  selectedMealDate: string = '';
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
  selectProduct(product: any): void {
    this.selectedProduct = product;
    // Debugowanie struktury nutriments
    console.log('Nutriments:', this.selectedProduct.nutriments);
    
    // Pobieranie kalorii z nutriments
    this.calories = this.selectedProduct.nutriments?.['energy-kcal'] || 0; // Użyj właściwego klucza
    console.log('Wybrane kalorie:', this.calories); // Debugowanie wartości kalorii
    
    this.showDialog = true; // Wyświetlenie dialogu
  }
  addMealToCalendar(): void {
    if (this.selectedProduct) {
      console.log("Dodawanie posiłku:", this.selectedProduct);

      // Pobieranie kalorii
      const calories = this.calories || 0;

      // Sprawdzamy, czy data została wybrana, jeśli nie, używamy dzisiejszej daty
      const mealDate = this.selectedMealDate ? new Date(this.selectedMealDate) : new Date();

      const meal: mealModel = {
        id: this.trainingAndMealService.client.createId(),
        name: this.selectedProduct.product_name || 'Nieznany produkt',
        calories: calories,
        weight: this.selectedProduct.quantity || 'N/A',
        date: mealDate, // Używamy wybranej daty
        day: 0,
        uid: 'currentUserUid', // UID użytkownika
      };

      console.log("Dodany posiłek:", meal);

      // Wywołanie serwisu, aby dodać posiłek
      this.trainingAndMealService.addMeal(meal);

      // Zamknięcie dialogu po dodaniu
      this.showDialog = false;
    }
  }
  // Metoda do anulowania
  cancelAddMeal(): void {
    this.showDialog = false; // Zamknięcie dialogu bez dodawania
  }

}
