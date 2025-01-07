export interface TrainingPlanModel {
<<<<<<< HEAD
  description: string;
  id: string;            // ID planu
  name: string;          // Nazwa planu
  days: TrainingPlanDay[]; // Lista dni w planie
  uid: string;           // UID użytkownika, który stworzył plan
=======
  id: string;            
  name: string;          
  days: TrainingPlanDay[]; 
  uid: string;           
>>>>>>> df169bdb9b84beecfcc25e58a2ec9d811049cb3d
  
}

export interface TrainingPlanDay {
  date: string;        
  videoLink: string;     
  time: string;      
  burnedKcal: number;    
  name?: string; 
}
