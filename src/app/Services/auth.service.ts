import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { ThemeService } from './theme.service';
// Modularny import Firebase
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  private themeService: ThemeService = inject(ThemeService);

  constructor() {
    const auth = getAuth(); // Korzystamy z `getAuth()` zamiast bezpośrednio `AngularFireAuth`
    
    // Subskrybujemy stan użytkownika
    auth.onAuthStateChanged((user) => {
      this.currentUserSubject.next(user);
      if (user) {
        this.themeService.loadUserTheme(user.uid);
      }
    });
  }

  // Metoda rejestracji
  register(email: string, password: string) {
    const auth = getAuth();
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Metoda logowania
  login(email: string, password: string) {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Metoda logowania przez Google
  loginWithGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider).then((result) => {
      const user = result.user;
      if (user) {
        // Jeśli użytkownik jest zalogowany przez Google, załaduj jego motyw
        this.themeService.loadUserTheme(user.uid);
      }
    });
  }
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }
  // Metoda wylogowania
  logout() {
    const auth = getAuth();
    return signOut(auth);
  }

  // Zwracanie obserwatora dla bieżącego użytkownika
  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }
}
