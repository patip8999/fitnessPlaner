import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private afAuth = inject(AngularFireAuth); // Wstrzykiwanie AngularFireAuth
  private currentUserSubject = new BehaviorSubject<any>(null);

  constructor() {
    this.afAuth.authState.subscribe(user => {
      this.currentUserSubject.next(user);
    });
  }
  // Rejestracja użytkownika
  register(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  // Logowanie użytkownika
  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Wylogowanie użytkownika
  logout() {
    return this.afAuth.signOut();
  }
 
  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

}
