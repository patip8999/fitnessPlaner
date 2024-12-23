import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  
  private client = inject(AngularFirestore);
  private afAuth = inject(AngularFireAuth);

  // Pobranie treningów dla zalogowanego użytkownika
  getTrainings(): Observable<any[]> {
    return new Observable<any[]>(observer => {
      this.afAuth.currentUser
        .then(user => {
          const uid = user?.uid;
          if (uid) {
            this.client.collection('Training', ref => ref.where('uid', '==', uid)).valueChanges()
              .subscribe(trainings => {
                observer.next(trainings);
              });
          } else {
            observer.next([]);
          }
        })
        .catch(() => observer.next([]));
    });
  }

  // Pobranie posiłków dla zalogowanego użytkownika
  getMeals(): Observable<any[]> {
    return new Observable<any[]>(observer => {
      this.afAuth.currentUser
        .then(user => {
          const uid = user?.uid;
          if (uid) {
            this.client.collection('Meal', ref => ref.where('uid', '==', uid)).valueChanges()
              .subscribe(meals => {
                observer.next(meals);
              });
          } else {
            observer.next([]);
          }
        })
        .catch(() => observer.next([]));
    });
  }

  // Dodanie treningu do kolekcji 'Training' w Firebase
  addTraining(day: number, name: string, burnedKcal: string, time: string): void {
    this.afAuth.currentUser
      .then(user => {
        const uid = user?.uid;
        if (uid) {
          const docRef = this.client.collection('Training').doc(`${day}`);
          docRef.set({
            day,
            Name: name,
            'Burned kcal': burnedKcal,
            Time: time,
            uid,  // Dodanie uid do dokumentu
          }, { merge: true });
        }
      });
  }

  // Dodanie posiłku do kolekcji 'Meal' w Firebase
  addMeal(day: number, name: string, calories: string, weight: string): void {
    this.afAuth.currentUser
      .then(user => {
        const uid = user?.uid;
        if (uid) {
          const docRef = this.client.collection('Meal').doc(`${day}`);
          docRef.set({
            day,
            Name: name,
            calories,
            weight,
            uid,  // Dodanie uid do dokumentu
          }, { merge: true });
        }
      });
  }
}