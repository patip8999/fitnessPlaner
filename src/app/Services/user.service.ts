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
                if (userData.exists) {
                  observer.next(userData.data()); 
                } else {
                  observer.next(null); 
                }
              },
              error: (error) => {
                observer.error(error); 
              },
            });
        } else {
          observer.next(null); 
        }
      });
    });
  }
  updateAvatarInFirestore(avatarURL: string, userId: string): void {
    // Upewniamy się, że zapisujemy dane w kolekcji 'users' dla konkretnego użytkownika
    this.client
      .collection('users')
      .doc(userId)
      .update({
        photoURL: avatarURL, // Zapisujemy URL awatara w Firestore
      })
      .then(() => {
        console.log('Avatar updated successfully');
      })
      .catch((error) => {
        console.error('Error updating avatar:', error);
      });
  }
  updateUserData(userId: string, displayName: string): Observable<void> {
    return new Observable((observer) => {
      this.client
        .collection('users')
        .doc(userId)
        .update({
          displayName: displayName, // Zapisanie nowego nicku
        })
        .then(() => {
          observer.next(); // Zakończenie operacji
        })
        .catch((error) => {
          observer.error(error); // Obsługuje błędy
        });
    });
  }

}