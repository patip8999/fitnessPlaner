import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { mealModel } from '../Models/meal.model';
@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private client = inject(AngularFirestore);
  private afAuth = inject(AngularFireAuth);

  getTrainings(): Observable<any[]> {
    return new Observable<any[]>((observer) => {
      this.afAuth.currentUser
        .then((user) => {
          const uid = user?.uid;
          if (uid) {
            this.client
              .collection('Training', (ref) => ref.where('uid', '==', uid))
              .valueChanges()
              .subscribe((trainings) => {
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
    return new Observable<any[]>((observer) => {
      this.afAuth.currentUser
        .then((user) => {
          const uid = user?.uid;
          if (uid) {
            this.client
              .collection('Meal', (ref) => ref.where('uid', '==', uid))
              .valueChanges()
              .subscribe((meals) => {
                console.log('Pobrane posiłki:', meals);
                observer.next(meals);
              });
          } else {
            observer.next([]);
          }
        })
        .catch((err) => {
          console.error('Błąd podczas pobierania posiłków:', err);
          observer.next([]);
        });
    });
  }

  addTraining(
    name: string,
    burnedKcal: number,
    time: string,
    date: Date
  ): void {
    this.afAuth.currentUser
      .then((user) => {
        const uid = user?.uid;
        if (uid) {
          this.client
            .collection('Training')
            .add({
              date: date.toISOString(),
              name,
              burnedKcal,
              time,
              uid,
            })
            .then(() => console.log('Training added successfully'))
            .catch((err) => console.error('Error adding training:', err));
        }
      })
      .catch((err) => console.error('Error getting user:', err));
  }

  addMeal(meal: mealModel): void {
    if (!meal.id) {
      meal.id = this.client.createId(); // Tworzymy nowe ID, jeśli nie jest ustawione
    }
  
    this.afAuth.currentUser.then(user => {
      if (user) {
        const mealId = meal.id || this.client.createId(); // Jeśli ID nie istnieje, utwórz nowe
        this.client.collection('Meal').doc(mealId).set({
          ...meal,
          uid: user.uid,
          date: meal.date.toISOString() // Zamieniamy datę na string w odpowiednim formacie
        })
        .then(() => console.log('Meal added/updated successfully'))
        .catch(err => console.error('Error adding/updating meal:', err));
      }
    })
    .catch(err => console.error('Error getting user:', err));
  }
  updateMeal(meal: mealModel): Promise<void> {
    return this.afAuth.currentUser.then((user) => {
      if (user) {
        return this.client.collection('Meal').doc(meal.id).update({
          ...meal,
          date: meal.date.toISOString(),
        });
      } else {
        return Promise.reject('User not authenticated');
      }
    });
  }
  getTrainingsByDate(date: Date): Observable<any[]> {
    console.log('Pobieranie treningów dla daty:', date);
    return new Observable<any[]>((observer) => {
      this.afAuth.currentUser
        .then((user) => {
          const uid = user?.uid;
          if (uid) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            console.log('Start dnia:', startOfDay);
            console.log('Koniec dnia:', endOfDay);

            this.client
              .collection('Training', (ref) =>
                ref
                  .where('uid', '==', uid)
                  .where('date', '>=', startOfDay.toISOString())
                  .where('date', '<=', endOfDay.toISOString())
              )
              .valueChanges()
              .subscribe(
                (trainings) => {
                  console.log('Pobrane treningi:', trainings);
                  observer.next(trainings);
                },
                (error) => {
                  console.error('Błąd podczas pobierania treningów:', error);
                  observer.next([]);
                }
              );
          } else {
            observer.next([]);
          }
        })
        .catch(() => observer.next([]));
    });
  }

  getMealsByDate(date: Date): Observable<any[]> {
    console.log('Pobieranie posiłków dla daty:', date);
    return new Observable<any[]>((observer) => {
      this.afAuth.currentUser
        .then((user) => {
          const uid = user?.uid;
          if (uid) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            console.log('Start dnia:', startOfDay);
            console.log('Koniec dnia:', endOfDay);

            this.client
              .collection('Meal', (ref) =>
                ref
                  .where('uid', '==', uid)
                  .where('date', '>=', startOfDay.toISOString())
                  .where('date', '<=', endOfDay.toISOString())
              )
              .valueChanges()
              .subscribe(
                (meals) => {
                  console.log('Pobrane posiłki:', meals);
                  observer.next(meals);
                },
                (error) => {
                  console.error('Błąd podczas pobierania posiłków:', error);
                  observer.next([]);
                }
              );
          } else {
            observer.next([]);
          }
        })
        .catch(() => observer.next([]));
    });
  }
  getMealsByDateRange(startDate: Date, endDate: Date): Observable<any[]> {
    return new Observable<any[]>((observer) => {
      this.afAuth.currentUser
        .then((user) => {
          const uid = user?.uid;
          if (uid) {
            this.client
              .collection('Meal', (ref) =>
                ref
                  .where('uid', '==', uid)
                  .where('date', '>=', startDate.toISOString())
                  .where('date', '<=', endDate.toISOString())
              )
              .valueChanges()
              .subscribe(
                (meals) => {
                  observer.next(meals);
                },
                (error) => {
                  console.error('Błąd podczas pobierania posiłków:', error);
                  observer.next([]);
                }
              );
          } else {
            observer.next([]);
          }
        })
        .catch(() => observer.next([]));
    });
  }

  getTrainingsByDateRange(startDate: Date, endDate: Date): Observable<any[]> {
    return new Observable<any[]>((observer) => {
      this.afAuth.currentUser
        .then((user) => {
          const uid = user?.uid;
          if (uid) {
            this.client
              .collection('Training', (ref) =>
                ref
                  .where('uid', '==', uid)
                  .where('date', '>=', startDate.toISOString())
                  .where('date', '<=', endDate.toISOString())
              )
              .valueChanges()
              .subscribe(
                (trainings) => {
                  observer.next(trainings);
                },
                (error) => {
                  console.error('Błąd podczas pobierania treningów:', error);
                  observer.next([]);
                }
              );
          } else {
            observer.next([]);
          }
        })
        .catch(() => observer.next([]));
    });
  }
 
}

