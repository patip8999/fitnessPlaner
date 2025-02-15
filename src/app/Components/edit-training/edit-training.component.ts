import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { TrainingModel } from '../../Models/training.model';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../UI/modal/modal.component';

@Component({
  selector: 'app-edit-training',
  standalone: true,
  imports: [FormsModule, ModalComponent],
  templateUrl: './edit-training.component.html',
  styleUrl: './edit-training.component.css',
})
export class EditTrainingComponent {
  @Input() public training: TrainingModel | null = null;
  @Output() readonly Save: EventEmitter<TrainingModel> =
    new EventEmitter<TrainingModel>();
  @Output() readonly close = new EventEmitter<void>();
  readonly model = signal<TrainingModel>( {
    name: '',
    isDone: false,
    burnedKcal: 0,
    time: '',
    videoLink: '',
    date: new Date(),
    id: '',
    imageUrl: '',
  });
  dateLabel: any;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['training'] && this.training) {
      this.model.set( {
        ...this.training,
        date: new Date(this.training.date),
      });
    }
  }

  saveTraining(): void {
    if (this.model().name && this.model().burnedKcal > 0 && this.model().time) {
      this.Save.emit(this.model());
    } else {
      console.error('Model jest niekompletny lub zawiera błędy:', this.model);
    }
  }

  closeModal(): void {
    this.close.emit();
  }
}
