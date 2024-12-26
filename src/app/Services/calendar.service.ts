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
 
  addTraining( name: string, burnedKcal: string, time: string, date: Date): void {
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
           
          }).then(() => console.log('Training added successfully'))
            .catch(err => console.error('Error adding training:', err));
        }
      })
      .catch(err => console.error('Error getting user:', err));
  }

  // Dodanie posiłku do kolekcji 'Meal' w Firebase
// Dodanie posiłku do kolekcji 'Meal' w Firebase
addMeal(day: number, name: string, calories: any, weight: any, date: any): void {
  this.afAuth.currentUser
    .then(user => {
      if (!user) {
        console.error('Brak zalogowanego użytkownika');
        return;
      }

      const uid = user.uid;

      // Obsługa daty
      let mealDate: Date;
      if (date instanceof Date) {
        mealDate = date;
      } else {
        mealDate = new Date(date + 'T00:00:00'); // Dodanie czasu, aby utworzyć poprawny obiekt Date
      }

      const mealData = {
        date: mealDate.toISOString(),
        name: name.trim(),
        calories: calories.toString().trim(),
        weight: weight.toString().trim(),
        uid: uid,
        day: day,
      };

      this.client.collection('Meal').add(mealData)
        .then(() => console.log('Meal added successfully:', mealData))
        .catch(err => console.error('Błąd podczas dodawania posiłku:', err));
    })
    .catch(err => {
      console.error('Błąd podczas pobierania użytkownika:', err);
    });
}
}