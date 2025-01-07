export interface TrainingPlanModel {
  description: string;
  id: string;            // ID planu
  name: string;          // Nazwa planu
  days: TrainingPlanDay[]; // Lista dni w planie
  uid: string;           // UID użytkownika, który stworzył plan
  
}

export interface TrainingPlanDay {
  date: string;          // Data
  videoLink: string;     // Link do YouTube
  time: string;      // Czas trwania w minutach
  burnedKcal: number;    // Spalone kalorie
  name?: string; 
}