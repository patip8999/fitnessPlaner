import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import {  Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { DocumentData, DocumentReference, Timestamp } from 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MeasurementModel } from '../Models/measurements.model';

@Injectable({
  providedIn: 'root'
})
export class MeasurementsService {
 private client = inject(AngularFirestore);
  private afAuth = inject(AngularFireAuth);

// measurements.service.ts
addMeasurement(measurement: MeasurementModel): Promise<void> {
  return new Promise((resolve, reject) => {
    // Zakładając, że używasz Firebase
    this.afAuth.currentUser.then(user => {
      const uid = user?.uid;
      if (uid) {
        this.client
          .collection('measurements')
          .add({
            ...measurement,
            uid,
            date: measurement.date.toString(),
          })
          .then(() => {
            console.log('Measurement added successfully');
            resolve(); // Powiadomienie, że dodawanie zakończyło się sukcesem
          })
          .catch((err) => {
            console.error('Error adding measurement:', err);
            reject(err); // Powiadomienie o błędzie
          });
      } else {
        reject(new Error('No user found'));
      }
    }).catch(err => {
      console.error('Error getting user:', err);
      reject(err);
    });
  });
}

  getMeasurements(): Observable<any[]> {
    return new Observable<any[]>((observer) => {
      this.afAuth.currentUser
        .then((user) => {
          const uid = user?.uid;
          if (uid) {
            this.client
              .collection('measurements', (ref) => ref.where('uid', '==', uid))
              .valueChanges()
              .subscribe((measurements) => {
                observer.next(measurements);
              });
          } else {
            observer.next([]);
          }
        })
        .catch(() => observer.next([]));
    });
  }
}
