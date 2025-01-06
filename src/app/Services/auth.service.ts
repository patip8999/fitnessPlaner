import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { GoogleAuthProvider } from 'firebase/auth';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }
  private afAuth = inject(AngularFireAuth);
  private currentUserSubject = new BehaviorSubject<any>(null);

  constructor() {
    this.afAuth.authState.subscribe((user) => {
      this.currentUserSubject.next(user);
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
