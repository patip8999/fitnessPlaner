import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OpenFoodFactsService } from '../../Services/open-food-facts.service';
import { TrainingAndMealService } from '../../Services/calendar.service';
import { mealModel } from '../../Models/meal.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-nutriments',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './product-nutriments.component.html',
  styleUrl: './product-nutriments.component.css',
})
export class ProductNutrimentsComponent {
  searchQuery: string = '';
  products: any[] = [];
  error = '';
  nutriments: number = 0;
   private router: Router =  inject(Router);
  openFoodFactsService: OpenFoodFactsService = inject(OpenFoodFactsService);
  trainingAndMealService: TrainingAndMealService = inject(
    TrainingAndMealService
  );
  selectedProduct: any = null;
  showDialog: boolean = false;
  calories: number = 0;
  selectedMealDate: string = '';
  mealWeight: number = 100;
  calculatedCalories: number = 0;
  searchProducts() {
    if (!this.searchQuery.trim()) {
      this.error = 'Wprowadź frazę do wyszukiwania.';
      this.products = [];
      return;
    }

    this.openFoodFactsService.searchProductsByName(this.searchQuery).subscribe({
      next: (response) => {
        console.log('Odpowiedź z API:', response);
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
  calculateCalories() {
    if (this.selectedProduct && this.selectedProduct.nutriments) {
      const caloriesPer100g =
        this.selectedProduct.nutriments['energy-kcal'] || 0;

      if (this.mealWeight > 0) {
        this.calculatedCalories = (caloriesPer100g / 100) * this.mealWeight;
      } else {
        this.calculatedCalories = 0;
      }

      console.log('Obliczone kalorie:', this.calculatedCalories);
    }
  }
  selectProduct(product: any): void {
    this.selectedProduct = product;
    this.mealWeight = 100;
    this.calculateCalories();
    this.showDialog = true;
  }

  addMealToCalendar(): void {
    if (this.selectedProduct) {
      console.log('Dodawanie posiłku:', this.selectedProduct);

      const calories = this.calculatedCalories;

      const mealDate = this.selectedMealDate
        ? new Date(this.selectedMealDate)
        : new Date();

      const meal: mealModel = {
        id: this.trainingAndMealService.client.createId(),
        name: this.selectedProduct.product_name || 'Nieznany produkt',
        calories: calories,
        weight: `${this.mealWeight} g`,
        date: mealDate,
        day: 0,
        uid: 'currentUserUid',
      };

      console.log('Dodany posiłek:', meal);

      this.trainingAndMealService.addMeal(meal);

      this.showDialog = false;
    }
    this.router.navigate(['/home']);
  }

  cancelAddMeal(): void {
    this.showDialog = false;
  }
}
