import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormComponent } from "../form/form.component";

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [FormComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() modalId: string = ''; // Unikalny identyfikator modala
  @Input() title: string = ''; // Tytuł modala (np. 'Dodaj posiłek')
  @Input() nameLabel: string = ''; // Etykieta dla 'Nazwa'
  @Input() caloriesLabel: string = ''; // Etykieta dla 'Kalorie'
  @Input() burnedCaloriesLabel: string = ''; // Etykieta dla 'Spalone kalorie'
  @Input() weightLabel: string = ''; // Etykieta dla 'Waga'
  @Input() timeLabel: string = ''; // Etykieta dla 'Czas trwania'
   @Input() videoLinkLabel: string = ''
  @Input() dateLabel: string = ''; // Etykieta dla 'Data'
  @Input() model: any = {}; // Model danych formularza
  @Output() save = new EventEmitter<any>(); // Event do emitowania danych po zapisaniu
}