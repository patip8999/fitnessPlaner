import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AuthService } from '../../Services/auth.service';

import { Observable } from 'rxjs';
import { UserModel } from '../../app.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  @Output() formChange = new EventEmitter<'login' | 'register'>(); // Emiter zmiany formularza
  currentForm: 'login' | 'register' = 'login'; // Zmienna kontrolująca, który formularz jest wyświetlany
  user$: Observable<UserModel> = this.authService.getCurrentUser(); // Użytkownik

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  showForm(formType: 'login' | 'register') {
    this.formChange.emit(formType); // Przesyłanie typu formularza do rodzica
  }
}