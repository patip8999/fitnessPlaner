import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {
  @Input() title: string = '';
  @Input() nameLabel: string = '';
  @Input() caloriesLabel: string = '';
  @Input() weightLabel: string = '';
  @Input() videoLinkLabel: string = '';
  @Input() burnedCalories: string ='';
  @Input() dateLabel: string = '';
  @Input() timeLabel: string =''
  @Input() model: any = {}; 
  @Output() save = new EventEmitter<any>();

  onSubmit() {
    this.save.emit(this.model);
  }
  onDateChange(date: string): void {
    this.model.date = new Date(date + 'T00:00:00');
  }
}