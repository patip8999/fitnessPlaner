import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { TrainingModel } from '../../Models/training.model';
import { FormsModule } from '@angular/forms';
import { FormComponent } from "../UI/form/form.component";
import { ModalComponent } from "../UI/modal/modal.component";

@Component({
  selector: 'app-edit-training',
  standalone: true,
  imports: [FormsModule,  ModalComponent],
  templateUrl: './edit-training.component.html',
  styleUrl: './edit-training.component.css',
})
export class EditTrainingComponent {
  @Input() training: TrainingModel | null = null;
  @Output() Save: EventEmitter<TrainingModel> =
    new EventEmitter<TrainingModel>();
  @Output() close = new EventEmitter<void>();
  model: TrainingModel = {
    name: '',
    isDone: false,
    burnedKcal: 0,
    time: '',
videoLink: '',
    date: new Date(),
    id: '',
  };
dateLabel: any;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['training'] && this.training) {
      this.model = {
        ...this.training,
        date: new Date(this.training.date),
      };
    }
  }

  saveTraining(): void {
    if (this.model.name && this.model.burnedKcal > 0 && this.model.time) {
      this.Save.emit(this.model);
    } else {
      console.error('Model jest niekompletny lub zawiera błędy:', this.model);
    }
  }

  closeModal() {
    this.close.emit();
  }
}