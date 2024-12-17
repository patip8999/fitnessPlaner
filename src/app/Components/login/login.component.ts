import { Component, inject } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private router = inject(Router);
  private authService = inject(AuthService); // Zakładam, że masz AuthService

  email: string = '';
  password: string = '';

  login() {
    if (this.email && this.password) {
      this.authService.login(this.email, this.password)
        .then(() => {
          console.log('Zalogowano pomyślnie');
          // Po pomyślnym logowaniu, przekierowanie na stronę Home
          this.router.navigate(['/home']);
        })
        .catch((error) => {
          console.error('Błąd logowania:', error.message);
        });
    } else {
      console.log('Proszę podać e-mail i hasło.');
    }
  }


}