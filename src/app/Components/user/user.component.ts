import { Component, inject } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../Services/theme.service';
import { UserService } from '../../Services/user.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  userPhotoURL: string = '' 
  displayName: string = '';
email: string = '';
  authService: AuthService = inject(AuthService);
  userService: UserService = inject(UserService); 
  themeService: ThemeService = inject(ThemeService);
  userSignal = this.authService.getCurrentUser();

  constructor() {
    this.loadUser(); // Wywołanie ładowania użytkownika przy inicjalizacji
  }
  changeGradient(color: string) {
    this.themeService.setGradient(color);
  }

  loadUser() {
    this.userService.getUser().subscribe((user) => {
      if (user) {
        this.userPhotoURL = user.photoURL || ''; // Obsługa braku wartości
        this.displayName = user.displayName || 'Nieznany użytkownik';
        this.email = user.email || 'Brak adresu e-mail';
      }
    });
  }
}