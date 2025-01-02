import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { mealModel } from '../../Models/meal.model';
import { FormsModule } from '@angular/forms';
import { FormComponent } from '../UI/form/form.component';
import { ModalComponent } from "../UI/modal/modal.component";

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [FormsModule,  ModalComponent],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class EditComponent {
  @Input() meal: mealModel | null = null;
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
      this.model = {
        ...this.meal,
        date: new Date(this.meal.date),
      };
    }
  }

  saveMeal(updatedMeal: any): void {
    if (this.model.name && this.model.calories > 0 && this.model.weight) {
      this.Save.emit(this.model);
    } else {
      console.error('Model jest niekompletny lub zawiera błędy:', this.model);
    }
  }

  closeModal() {
    this.close.emit();
  }
}
