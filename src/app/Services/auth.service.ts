import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { ThemeService } from './theme.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }
  private afAuth = inject(AngularFireAuth);
  private currentUserSubject = new BehaviorSubject<any>(null);
  private themeService: ThemeService = inject(ThemeService);
  constructor() {
    this.afAuth.authState.subscribe((user) => {
      this.currentUserSubject.next(user);
      if (user) {
        this.themeService.loadUserTheme(user.uid);
      }
    });
  }

  register(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.afAuth.signOut();
  }

  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }
}
