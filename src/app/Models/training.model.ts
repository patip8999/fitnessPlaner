// Updated TrainingModel interface
export interface TrainingModel {
  name: string;
  burnedKcal: number;
  time: string;
  date: Date;
  id: string;
}

// Add weight or calories properties separately if needed, but don't add them to TrainingModel unless required.
