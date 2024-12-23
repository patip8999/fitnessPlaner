import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // Jeśli użytkownik jest zalogowany, pozwól na dostęp
    return true;
  } else {
    // Jeśli użytkownik nie jest zalogowany, przekieruj na stronę logowania
    router.navigate(['/login']);
    return false;
  }
};