import { DatePipe } from '@angular/common';
import { Component, computed, Signal } from '@angular/core';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  currentDate = new Date(); // Aktualna data
  selectedDate = new Date(); // Wybrana data
  daysInMonth: Signal<number[]>;

  constructor() {
    this.daysInMonth = computed(() => {
      const year = this.selectedDate.getFullYear();
      const month = this.selectedDate.getMonth();
      const daysCount = new Date(year, month + 1, 0).getDate(); // Ilość dni w miesiącu
      return Array.from({ length: daysCount }, (_, i) => i + 1);
    });
  }

  changeMonth(offset: number): void {
    this.selectedDate.setMonth(this.selectedDate.getMonth() + offset);
    this.selectedDate = new Date(this.selectedDate); // Aktualizacja daty
  }

}
