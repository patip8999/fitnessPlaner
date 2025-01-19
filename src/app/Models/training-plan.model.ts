export interface TrainingPlanModel {
  readonly description: string;
  readonly id: string;           
  readonly name: string;          
  readonly  days: TrainingPlanDay[];
  readonly uid: string;         
  
}

export interface TrainingPlanDay {
  readonly date: string;        
  readonly  videoLink: string;     
  readonly time: string;      
  readonly burnedKcal: number;    
  readonly name?: string; 
}
