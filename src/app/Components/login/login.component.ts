import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFormComponent } from '../UI/auth-form/auth-form.component';

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
  private readonly cdr = inject(ChangeDetectorRef);
  email: string = '';
  password: string = '';
  isLogin: boolean = true;

 
  login({ email, password }: { email: string; password: string }): void {
    console.log('Attempting to log in with email:', email);
    if (email && password) {
      this.authService.login(email, password)
        .then(() => {
          console.log('Login successful, navigating to /home');
          this.router.navigate(['/home']);
          this.cdr.detectChanges();
        })
        .catch((error) => {
          console.error('Błąd logowania:', error.message);
        });
    } else {
      console.log('Proszę podać e-mail i hasło.');
    }
  }
  loginWithGoogle() {
    this.authService.loginWithGoogle().then(() => {
      console.log('Zalogowano za pomocą Google');
    }).catch((error) => {
      console.error('Błąd logowania przez Google: ', error);
    });
  }
}