export interface CorrelationDataPoint {
  day: string;
  [key: string]: any;
}

export type CorrelationCalculationInput = CorrelationDataPoint[][];
