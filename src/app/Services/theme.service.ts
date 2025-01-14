import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor() {
    // Przy starcie aplikacji wczytujemy ustawienie z localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.setGradient(savedTheme);
    }
  }
  setGradient(color: string) {
    const root = document.documentElement;

    // Ustawienie nowego gradientu
    switch (color) {
      case 'blue':
        root.style.setProperty('--background-gradient', 'linear-gradient(135deg, #87CEFA, #254636)');
        root.style.setProperty('--button-background', '#4682B4'); // Ustawienie koloru przycisku na niebieski
        break;

      case 'green':
        root.style.setProperty('--background-gradient', 'linear-gradient(135deg, #e0f7fa, #254636)');
        root.style.setProperty('--button-background', '#254636'); // Kolor przycisku na zielony
        break;
       case 'purple': // Nowy kolor lawendowy
        root.style.setProperty('--background-gradient', 'linear-gradient(135deg, #DDA0DD, #254636)');
        root.style.setProperty('--button-background', '#DDA0DD'); // Kolor przycisku na lawendowy
        break;
        
      // Dodaj inne kolory, jeśli chcesz
      default:
        root.style.setProperty('--background-gradient', 'linear-gradient(135deg, #e0f7fa, #254636)');
        root.style.setProperty('--button-background', '#254636');
        break;
    }
  }
}