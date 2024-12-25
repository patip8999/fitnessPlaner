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

  getMeals(): Observable<any[]> {
    return new Observable<any[]>(observer => {
      this.afAuth.currentUser
        .then(user => {
          const uid = user?.uid;
          if (uid) {
            this.client.collection('Meal', ref => ref.where('uid', '==', uid)).valueChanges()
              .subscribe(meals => {
                console.log('Pobrane posiłki:', meals); // Debugowanie
                observer.next(meals);
              });
          } else {
            observer.next([]);
          }
        })
        .catch(err => {
          console.error('Błąd podczas pobierania posiłków:', err);
          observer.next([]);
        });
    });
  }
 
  addTraining(day: number, name: string, burnedKcal: string, time: string, date: Date): void {
    this.afAuth.currentUser
      .then(user => {
        const uid = user?.uid;
        if (uid) {
          this.client.collection('Training').add({
            date: date.toISOString(),
            name,
            burnedKcal,
            time,
            uid,
            day,
          }).then(() => console.log('Training added successfully'))
            .catch(err => console.error('Error adding training:', err));
        }
      })
      .catch(err => console.error('Error getting user:', err));
  }

  // Dodanie posiłku do kolekcji 'Meal' w Firebase
  addMeal(day: number, name: string, calories: string, weight: string, date: Date): void {
    this.afAuth.currentUser
      .then(user => {
        const uid = user?.uid;
        if (uid) {
          this.client.collection('Meal').add({
            date: date.toISOString(),
            name,
            calories,
            weight,
            uid,
            day,
          }).then(() => console.log('Meal added successfully'))
            .catch(err => console.error('Error adding meal:', err));
        }
      })
      .catch(err => console.error('Error getting user:', err));
  }
}