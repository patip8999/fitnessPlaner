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
  @Input() modalId: string = ''; 
  @Input() title: string = ''; 
  @Input() nameLabel: string = ''; 
  @Input() caloriesLabel: string = ''; 
  @Input() burnedCaloriesLabel: string = ''; 
  @Input() weightLabel: string = ''; 
  @Input() timeLabel: string = ''; 
   @Input() videoLinkLabel: string = ''
  @Input() dateLabel: string = ''; 
  @Input() model: any = {}; 
  @Input() imageLabel: string = '';
  @Output() save = new EventEmitter<any>(); 
  @Output() imageSelected = new EventEmitter<File>();

}