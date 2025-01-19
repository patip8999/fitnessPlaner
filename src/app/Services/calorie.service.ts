import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { CalorieCalculation } from '../Models/calorie-calculation.model';

@Injectable({
  providedIn: 'root',
})
export class CalorieService {
  client = inject(AngularFirestore);
  private afAuth = inject(AngularFireAuth);
  saveTdee(calorieData: {
    tdee: number;
    gender: string;
    age: number;
    height: number;
    weight: number;
    activityLevel: number;
  }): Promise<void> {
    return this.afAuth.currentUser.then((user) => {
      if (user) {
        return this.client
          .collection('calorie-calculations')
          .add({
            ...calorieData,
            uid: user.uid,
            date: new Date().toISOString(),
          })
          .then(() => console.log('Calorie calculation saved'))
          .catch((err) =>
            console.error('Error saving calorie calculation:', err)
          );
      } else {
        return Promise.reject('User not authenticated');
      }
    });
  }

  loadTdee(): Observable<CalorieCalculation | null> {
    return new Observable((observer) => {
      this.afAuth.currentUser.then((user) => {
        if (user) {
          this.client
            .collection('calorie-calculations', (ref) =>
              ref.where('uid', '==', user.uid).orderBy('date', 'desc').limit(1)
            )
            .get()
            .subscribe((querySnapshot) => {
              if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0].data() as CalorieCalculation;
                observer.next(doc);
              } else {
                observer.next(null);
              }
            });
        } else {
          observer.error('User not authenticated');
        }
      });
    });
  }
}
