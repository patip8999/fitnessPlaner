import { Component, inject, signal, computed } from '@angular/core';
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
  styleUrls: ['./product-nutriments.component.css'],
})
export class ProductNutrimentsComponent {
  private router: Router = inject(Router);
  openFoodFactsService: OpenFoodFactsService = inject(OpenFoodFactsService);
  trainingAndMealService: TrainingAndMealService = inject(
    TrainingAndMealService
  );
  searchQuery = signal<string>('');
  products = signal<any[]>([]);
  error = signal<string>('');
  selectedProduct = signal<any>(null);
  showDialog = signal<boolean>(false);
  mealWeight = signal<number>(100);
  calculatedCalories = computed(() => {
    const selectedProduct = this.selectedProduct();
    const weight = this.mealWeight();

    if (selectedProduct && selectedProduct.nutriments && weight > 0) {
      const caloriesPer100g = selectedProduct.nutriments['energy-kcal'] || 0;
      return (caloriesPer100g / 100) * weight;
    }
    return 0;
  });
  selectedMealDate = signal<string>('');

  searchProducts(): void {
    if (!this.searchQuery().trim()) {
      this.error.set('Wprowadź frazę do wyszukiwania.');
      this.products.set([]);
      return;
    }

    this.openFoodFactsService
      .searchProductsByName(this.searchQuery())
      .subscribe({
        next: (response) => {
          if (response.products && response.products.length > 0) {
            this.products.set(response.products);
            this.error.set('');
          } else {
            this.products.set([]);
            this.error.set('Nie znaleziono produktów dla podanej frazy.');
          }
        },
        error: (err) => {
          console.error('Błąd podczas żądania:', err);
          this.products.set([]);
          this.error.set('Wystąpił błąd podczas pobierania danych.');
        },
      });
  }

  selectProduct(product: any): void {
    this.selectedProduct.set(product);
    this.mealWeight.set(100);
    this.showDialog.set(true);
  }

  addMealToCalendar(): void {
    const selectedProduct = this.selectedProduct();
    if (!selectedProduct) {
      alert('Proszę wybrać produkt.');
      return;
    }

    const mealDate = this.selectedMealDate()
      ? new Date(this.selectedMealDate())
      : new Date();

    const meal: mealModel = {
      id: this.trainingAndMealService.client.createId(),
      name: selectedProduct.product_name || 'Nieznany produkt',
      calories: this.calculatedCalories(),
      weight: `${this.mealWeight()} g`,
      date: mealDate,
      day: 0,
      uid: 'currentUserUid',
      imageUrl: selectedProduct.image_url || '',
    };

    this.trainingAndMealService.addMeal(meal);
    this.showDialog.set(false);
    this.router.navigate(['/home']);
  }

  cancelAddMeal(): void {
    this.showDialog.set(false);
  }
}
