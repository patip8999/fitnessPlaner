import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor() {

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.setGradient(savedTheme);
    }
  }
  setGradient(color: string) {
    const root = document.documentElement;

 
    switch (color) {
      case 'green':
        root.style.setProperty(
          '--background-gradient',
          'linear-gradient(135deg, #e0f7fa, #254636)'
        );
        root.style.setProperty('--button-background', '#254636'); 
        break;

      case 'pastel-lavender':
        root.style.setProperty(
          '--background-gradient',
          'linear-gradient(135deg, #E6E6FA, #F4F0FF)'
        ); 
        root.style.setProperty('--button-background', '#D8BFD8'); 
        break;

      case 'powder-blue':
        root.style.setProperty(
          '--background-gradient',
          'linear-gradient(135deg, #D6ECFA, #B3D9FF)'
        );
        root.style.setProperty('--button-background', '#A9CCE3'); 
        break;
      case 'emerald-gold':
        root.style.setProperty(
          '--background-gradient',
          'linear-gradient(135deg, #50C878, #FFD700)'
        ); 
        root.style.setProperty('--button-background', '#468847'); 
        break;
      case 'cloud':
        root.style.setProperty(
          '--background-gradient',
          'linear-gradient(135deg, #F0F4FF, #E1E9FF)'
        ); 
        root.style.setProperty('--button-background', '#CBD7FF');
        break;

      case 'dusty-rose':
        root.style.setProperty(
          '--background-gradient',
          'linear-gradient(135deg, #F5E3E0, #EAC0C1)'
        ); 
        root.style.setProperty('--button-background', '#E8AFAF'); 
        break;

      case 'powder-mint':
        root.style.setProperty(
          '--background-gradient',
          'linear-gradient(135deg, #E6F9F4, #D0F0E8)'
        ); 
        root.style.setProperty('--button-background', '#B2E4D8'); 
        break;
      case 'navy-ivory':
        root.style.setProperty(
          '--background-gradient',
          'linear-gradient(135deg, #F9F8F6, #2C3E50)'
        ); 
        root.style.setProperty('--button-background', '#34495E'); 
        break;

      case 'cashmere-graphite':
        root.style.setProperty(
          '--background-gradient',
          'linear-gradient(135deg, #EFE1CE, #2F2F2F)'
        ); 
        root.style.setProperty('--button-background', '#3C3C3C'); 
        break;

      case 'pearl-ink':
        root.style.setProperty(
          '--background-gradient',
          'linear-gradient(135deg, #F2F1F0, #1F2933)'
        ); 
        root.style.setProperty('--button-background', '#20232A');
        break;
      case 'beige-espresso':
        root.style.setProperty(
          '--background-gradient',
          'linear-gradient(135deg, #F7F4ED, #4A332D)'
        ); 
        root.style.setProperty('--button-background', '#3C2E2A'); 
        break;
      case 'graphite-rose':
        root.style.setProperty(
          '--background-gradient',
          'linear-gradient(135deg, #FDE9E8, #3D3D3D)'
        );
        root.style.setProperty('--button-background', '#7A6C6C'); 
        break;
      case 'turquoise-alabaster':
        root.style.setProperty(
          '--background-gradient',
          'linear-gradient(135deg, #EDF6F8, #005960)'
        ); 
        root.style.setProperty('--button-background', '#003F45'); 
        break;

      case 'burgundy-cream':
        root.style.setProperty(
          '--background-gradient',
          'linear-gradient(135deg, #F8ECE5, #641E16)'
        );
        root.style.setProperty('--button-background', '#922B21'); 
        break;
      case 'platinum-coal':
        root.style.setProperty(
          '--background-gradient',
          'linear-gradient(135deg, #E5E5E5, #222222)'
        ); 
        root.style.setProperty('--button-background', '#333333'); 
        break;

      case 'pearl-pink-anthracite':
        root.style.setProperty(
          '--background-gradient',
          'linear-gradient(135deg, #FCE4EC, #2B2B2B)'
        ); 
        root.style.setProperty('--button-background', '#4C4C4C'); 
        break;

      case 'opal-blue':
        root.style.setProperty(
          '--background-gradient',
          'linear-gradient(135deg, #E0E5EC, #5C87A3)'
        ); 
        root.style.setProperty('--button-background', '#3B647A'); 
        break;

      case 'mustard-caramel':
        root.style.setProperty(
          '--background-gradient',
          'linear-gradient(135deg, #FFF5E1, #A67B5B)'
        ); 
        root.style.setProperty('--button-background', '#8C6239');
        break;

      default:
        root.style.setProperty(
          '--background-gradient',
          'linear-gradient(135deg, #e0f7fa, #254636)'
        );
        root.style.setProperty('--button-background', '#254636');
        break;
    }
  }
}
