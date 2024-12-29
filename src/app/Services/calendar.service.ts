import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { mealModel } from '../Models/meal.model';
import { TrainingModel } from '../Models/training.model';
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

  addTraining(training: TrainingModel): void {
    if (!training.id) {
      training.id = this.client.createId(); // Generowanie nowego ID, jeśli nie zostało przekazane
    }
  
    this.afAuth.currentUser
      .then((user) => {
        const uid = user?.uid;
        if (uid) {
          this.client
            .collection('Training')
            .doc(training.id)  // Użycie wygenerowanego ID do zapisania treningu
            .set({
              ...training,
              uid,
              date: training.date.toISOString(), // Konwersja daty na odpowiedni format
            })
            .then(() => console.log('Training added/updated successfully'))
            .catch((err) => console.error('Error adding/updating training:', err));
        }
      })
      .catch((err) => console.error('Error getting user:', err));
  }

  addMeal(meal: mealModel): void {
    if (!meal.id) {
      meal.id = this.client.createId(); 
    }
  
    this.afAuth.currentUser.then(user => {
      if (user) {
        const mealId = meal.id || this.client.createId(); 
        this.client.collection('Meal').doc(mealId).set({
          ...meal,
          uid: user.uid,
          date: meal.date.toISOString() 
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
  updateTraining(training: TrainingModel): Promise<void> {
    return this.afAuth.currentUser.then((user) => {
      if (user) {
        return this.client.collection('Training').doc(training.id).update({
          ...training,
          date: training.date.toISOString(),
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
  deleteTraining(trainingId: string): Promise<void> {
    return this.afAuth.currentUser
      .then((user) => {
        const uid = user?.uid;
        if (uid) {
          return this.client.collection('Training').doc(trainingId).delete()
            .then(() => console.log('Training deleted successfully'))
            .catch((err) => console.error('Error deleting training:', err));
        } else {
          return Promise.reject('User not authenticated');
        }
      })
      .catch((err) => {
        console.error('Error getting user:', err);
        return Promise.reject(err);
      });
  }
  deleteMeal(mealId: string): Promise<void> {
    return this.afAuth.currentUser
      .then((user) => {
        const uid = user?.uid;
        if (uid) {
          return this.client.collection('Meal').doc(mealId).delete()
            .then(() => console.log('Meal deleted successfully'))
            .catch((err) => console.error('Error deleting meal:', err));
        } else {
          return Promise.reject('User not authenticated');
        }
      })
      .catch((err) => {
        console.error('Error getting user:', err);
        return Promise.reject(err);
      });
  }
}

