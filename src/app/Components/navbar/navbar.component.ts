import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AuthService } from '../../Services/auth.service';

import { Observable } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserModel } from '../../Models/User.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  @Output() formChange = new EventEmitter<'login' | 'register'>(); 
  currentForm: 'login' | 'register' = 'login'; 
  user$: Observable<UserModel> = this.authService.getCurrentUser(); 

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  showForm(formType: 'login' | 'register') {
    this.formChange.emit(formType);
  }
  navigateToLogin() {
    this.formChange.emit('login'); // Emitowanie zmiany formularza (opcjonalne)
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.formChange.emit('register'); // Emitowanie zmiany formularza (opcjonalne)
    this.router.navigate(['/register']);
  }
}