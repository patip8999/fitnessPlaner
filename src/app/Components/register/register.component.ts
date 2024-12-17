import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService) {}

  register(event: Event) {
    event.preventDefault();  // Zapobiega domyślnemu działaniu formularza

    // Sprawdzenie wartości email i password przed wywołaniem rejestracji
    console.log('E-mail:', this.email);
    console.log('Hasło:', this.password);

    if (this.email && this.password) {
      this.authService.register(this.email, this.password)
        .then(() => {
          console.log('Zarejestrowano pomyślnie');
        })
        .catch((error) => {
          console.error('Błąd rejestracji:', error.message);
        });
    } else {
      console.log('Proszę podać e-mail i hasło.');
    }
  }
}