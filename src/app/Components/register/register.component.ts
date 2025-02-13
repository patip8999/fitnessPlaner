import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFormComponent } from '../UI/auth-form/auth-form.component';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, AuthFormComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = signal<string>('');
  password = signal<string>('');
  confirmPassword = signal<string>('');
  displayName = signal<string>('');
  errorMessage = signal<string | null>(null);

  register(credentials: {
    email: string;
    password: string;
    confirmPassword?: string;
    displayName?: string;
  }): void {
    const email = credentials.email;
    const password = credentials.password;
    const confirmPassword = credentials.confirmPassword ?? ''; 
    const displayName = credentials.displayName ?? ''; 
  

    if (!email || !password || !displayName) {
      this.errorMessage.set('Proszę podać e-mail, nazwę użytkownika i hasło.');
      return;
    }
  
    if (password !== confirmPassword) {
      this.errorMessage.set('Hasła nie są zgodne.');
      return;
    }

    this.authService
      .register(email, password, displayName)
      .then(() => {
        console.log(`Zarejestrowano pomyślnie użytkownika: ${displayName}`);
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.error('Błąd rejestracji:', error.message);
        this.errorMessage.set('Błąd rejestracji: ' + error.message);
      });
  }
}  