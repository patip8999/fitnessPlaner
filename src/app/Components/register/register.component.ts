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
  username = '';
  private authService = inject(AuthService);
  private readonly router = inject(Router);
  register({
    email,
    password,
    confirmPassword,
    username,
  }: {
    email: string;
    password: string;
    confirmPassword?: string;
    username?: string;
  }) {
    if (!email || !password || !username) {
      console.log('Proszę podać e-mail, nazwę użytkownika i hasło.');
      return;
    }

    if (password !== confirmPassword) {
      console.error('Hasła nie są zgodne.');
      return;
    }

    this.authService
      .register(email, password)
      .then(() => {
        this.router.navigate(['/home']);
        console.log(`Zarejestrowano pomyślnie użytkownika: ${username}`);
      })
      .catch((error) => {
        console.error('Błąd rejestracji:', error.message);
      });
  }
}
