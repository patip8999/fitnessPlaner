import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { mealModel } from '../../Models/meal.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent {
  @Input() meal: mealModel | null = null; // Zmienna do trzymania edytowanego posiłku
  @Output() Save: EventEmitter<mealModel> = new EventEmitter<mealModel>();
  @Output() close = new EventEmitter<void>();
  model: mealModel = {
    name: '',
    calories: 0,
    weight: '',
    day: 0,
    date: new Date(),
    id: '',
  };
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['meal'] && this.meal) {
      // Tworzenie kopii obiektu wejściowego, aby nie zmieniać oryginału
      this.model = { 
        ...this.meal,
        date: new Date(this.meal.date) // Konwersja daty, jeśli potrzebne
      };
    }
  }

  saveMeal(): void {
    if (this.model.name && this.model.calories > 0 && this.model.weight) {
      this.Save.emit(this.model); // Emitowanie tylko, gdy model jest poprawny
    } else {
      console.error('Model jest niekompletny lub zawiera błędy:', this.model);
    }
  }
  
  closeModal() {
    this.close.emit();
  }
}