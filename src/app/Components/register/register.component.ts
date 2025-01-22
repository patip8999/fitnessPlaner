import { Component, inject } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { FormsModule } from '@angular/forms';
import { AuthFormComponent } from '../UI/auth-form/auth-form.component';
import { Router } from '@angular/router';

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
  confirmPassword = '';
 
  displayName = '';
  private authService = inject(AuthService);
  private readonly router = inject(Router);
  register({
    email,
    password,
    confirmPassword,
    displayName,
  }: {
    email: string;
    password: string;
    confirmPassword?: string;
    displayName?: string;
  }) {
    if (!email || !password || !displayName) {
      console.log('Proszę podać e-mail, nazwę użytkownika i hasło.');
      return;
    }

    if (password !== confirmPassword) {
      console.error('Hasła nie są zgodne.');
      return;
    }

    this.authService
      .register(email, password, displayName)
      .then(() => {
        this.router.navigate(['/home']);
        console.log(`Zarejestrowano pomyślnie użytkownika: ${displayName}`);
      })
      .catch((error) => {
        console.error('Błąd rejestracji:', error.message);
      });
  }
}
