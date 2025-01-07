export interface TrainingPlanModel {
  id: string;            
  name: string;          
  days: TrainingPlanDay[]; 
  uid: string;           
  
}

export interface TrainingPlanDay {
  date: string;        
  videoLink: string;     
  time: string;      
  burnedKcal: number;    
  name?: string; 
}
