import { Component, inject } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { FormsModule } from '@angular/forms';
import { AuthFormComponent } from '../UI/auth-form/auth-form.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, AuthFormComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  email = '';
  password = '';
  private authService = inject(AuthService);

  register({ email, password }: { email: string; password: string }) {
    if (email && password) {
      this.authService.register(email, password)
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