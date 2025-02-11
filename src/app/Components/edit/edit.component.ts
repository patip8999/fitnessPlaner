import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { mealModel } from '../../Models/meal.model';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../UI/modal/modal.component';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [FormsModule, ModalComponent],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class EditComponent {
  @Input() public  meal: mealModel | null = null;
  @Output() readonly  Save: EventEmitter<mealModel> = new EventEmitter<mealModel>();
  @Output() readonly  close = new EventEmitter<void>();
  readonly  model = signal<mealModel> ( {
    name: '',
    calories: 0,
    weight: '',
    day: 0,
    date: new Date(),
    id: '',
    uid: '',
    imageUrl: '',
  });


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['meal'] && this.meal) {

  
      this.model.set( {
        ...this.meal,
        weight: this.meal.weight || '0g',
        date: new Date(this.meal.date),
        imageUrl: this.meal.imageUrl || '',
      });
    }
  }
  

  saveMeal(): void {

  
    if (this.model().name && this.model().calories > 0 && this.model().weight.trim().length > 0) {
      this.Save.emit(this.model());
    } else {
      console.error("Model jest niekompletny lub zawiera błędy:", this.model);
    }
  }

 closeModal(): void {
    this.close.emit();
  }
}