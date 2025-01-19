import { inject, Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { ThemeService } from './theme.service';

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  private themeService: ThemeService = inject(ThemeService);

  constructor() {
    const auth = getAuth();

    auth.onAuthStateChanged((user) => {
      this.currentUserSubject.next(user);
      if (user) {
        this.themeService.loadUserTheme(user.uid);
      }
    });
  }

  register(email: string, password: string) {
    const auth = getAuth();
    return createUserWithEmailAndPassword(auth, email, password);
  }

  login(email: string, password: string) {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password);
  }

  loginWithGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider).then((result) => {
      const user = result.user;
      if (user) {
        this.themeService.loadUserTheme(user.uid);
      }
    });
  }
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  logout() {
    const auth = getAuth();
    return signOut(auth);
  }

  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }
}
