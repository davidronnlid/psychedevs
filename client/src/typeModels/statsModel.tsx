export interface CorrelationDataPoint {
  day: string | null;
  value: any;
}

export type CorrelationCalculationInput = CorrelationDataPoint[][];
