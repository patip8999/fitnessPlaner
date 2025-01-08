import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('AuthGuard: Checking authentication status');
  if (authService.isAuthenticated()) {
    console.log('AuthGuard: User is authenticated');
    return true;
  } else {
    console.log('AuthGuard: User is not authenticated, redirecting to /login');
    router.navigate(['/login']);
    return false;
  }
};