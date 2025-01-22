import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private client: AngularFirestore = inject(AngularFirestore);
  private afAuth: AngularFireAuth = inject(AngularFireAuth);

  getUser(): Observable<any> {
    return new Observable((observer) => {
      this.afAuth.onAuthStateChanged((user) => {
        if (user) {
          this.client
            .collection('users')
            .doc(user.uid)
            .get()
            .subscribe({
              next: (userData) => {
                observer.next(userData.data()); // Zwraca dane użytkownika
              },
              error: (error) => {
                observer.error(error); // Obsługuje błędy
              },
            });
        } else {
          observer.next(null); // Obsługuje brak zalogowanego użytkownika
        }
      });
    });
  }
}