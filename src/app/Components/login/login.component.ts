import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFormComponent } from '../UI/auth-form/auth-form.component';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, AuthFormComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

 
  email = signal<string>('');
  password = signal<string>('');
  isLogin = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  login(credentials: { email: string; password: string }): void {
    const { email, password } = credentials;

    if (!email || !password) {
      this.errorMessage.set('Proszę podać e-mail i hasło.');
      return;
    }

    this.authService
      .login(email, password)
      .then(() => {
        console.log('Logowanie udane, przekierowanie do /home');
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.error('Błąd logowania:', error.message);
        this.errorMessage.set('Nieprawidłowy e-mail lub hasło.');
      });
  }


  loginWithGoogle(): void {
    this.authService
      .loginWithGoogle()
      .then(() => {
        console.log('Zalogowano za pomocą Google');
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.error('Błąd logowania przez Google:', error);
        this.errorMessage.set('Błąd logowania przez Google.');
      });
  }
}