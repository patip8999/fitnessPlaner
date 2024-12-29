import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { TrainingModel } from '../../Models/training.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-training',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-training.component.html',
  styleUrl: './edit-training.component.css'
})
export class EditTrainingComponent {
@Input() training: TrainingModel | null = null; // Zmienna do trzymania edytowanego posiłku
  @Output() Save: EventEmitter<TrainingModel> = new EventEmitter<TrainingModel>();
  @Output() close = new EventEmitter<void>();
  model: TrainingModel = {
    name: '',
    burnedKcal: 0,
    time: '',
  
    date: new Date(),
    id: '',
  };
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['training'] && this.training) {
      // Tworzenie kopii obiektu wejściowego, aby nie zmieniać oryginału
      this.model = { 
        ...this.training,
        date: new Date(this.training.date) // Konwersja daty, jeśli potrzebne
      };
    }
  }

  saveTraining(): void {
    if (this.model.name && this.model.burnedKcal > 0 && this.model.time) {
      this.Save.emit(this.model); // Emitowanie tylko, gdy model jest poprawny
    } else {
      console.error('Model jest niekompletny lub zawiera błędy:', this.model);
    }
  }
  
  closeModal() {
    this.close.emit();
  }
}
