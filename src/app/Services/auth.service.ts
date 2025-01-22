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
  User,
} from 'firebase/auth';

import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  private themeService: ThemeService = inject(ThemeService);

  private db = getFirestore();
  constructor() {
    const auth = getAuth();

    auth.onAuthStateChanged((user) => {
      if (user) {
        this.saveUserToFirestore(user);
        this.currentUserSubject.next({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });
        this.themeService.loadUserTheme(user.uid);
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  register(email: string, password: string) {
    const auth = getAuth();
    return createUserWithEmailAndPassword(auth, email, password).then(
      (result) => {
        if (result.user) {
          this.saveUserToFirestore(result.user);
        }
      }
    );
  }

  login(email: string, password: string) {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password).then((result) => {
      if (result.user) {
        this.saveUserToFirestore(result.user);
      }
    });
  }

  loginWithGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider).then((result) => {
      const user = result.user;
      if (user) {
        this.saveUserToFirestore(user);
        this.themeService.loadUserTheme(user.uid);
        this.currentUserSubject.next({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });
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

  private saveUserToFirestore(user: User) {
    const db = getFirestore();
    const userRef = doc(db, 'users', user.uid);

    return setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      createdAt: new Date().toISOString(),
    }, { merge: true }).catch((error) => {
      console.error('Błąd zapisu użytkownika do Firestore:', error);
    });
  }


}
