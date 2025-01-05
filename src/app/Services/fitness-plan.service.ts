import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { TrainingPlanModel } from '../Models/training-plan.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class FitnessPlanService {
   client = inject(AngularFirestore);
    private afAuth = inject(AngularFireAuth);
    getAllFitnessPlans(): Observable<TrainingPlanModel[]> {
      return this.client.collection<TrainingPlanModel>('FitnessPlans').valueChanges();
    }
  
  // Stwórz nowy plan fitness
  createFitnessPlan(plan: TrainingPlanModel): void {
    const newPlan = { ...plan }; // Nie przypisujemy UID na tym etapie
    this.client
      .collection('FitnessPlans')
      .add(newPlan)
      .then(() => console.log('Plan fitness dodany'))
      .catch((err) => console.error('Błąd przy dodawaniu planu fitness', err));
  }

  
  // Pobierz plan fitness na podstawie jego ID
  getFitnessPlanById(planId: string): Observable<TrainingPlanModel | undefined> {
    return this.client.doc<TrainingPlanModel>(`FitnessPlans/${planId}`).valueChanges();
  }

  // Zaktualizuj plan fitness
  // Zaktualizuj plan fitness
  updateFitnessPlan(plan: TrainingPlanModel): void {
    this.client
      .doc(`FitnessPlans/${plan.id}`)
      .update(plan)
      .then(() => console.log('Plan fitness zaktualizowany'))
      .catch((err) => console.error('Błąd przy aktualizacji planu fitness', err));
  }
}