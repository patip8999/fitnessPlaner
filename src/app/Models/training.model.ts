export interface TrainingModel {
  readonly name: string;
  readonly burnedKcal: number;
  readonly time: string;
  date: Date;
  id: string;
  readonly videoLink: string;
  readonly isDone: boolean;
}
