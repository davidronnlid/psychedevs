export interface CorrelationDataType {
  correlation: number | null;
  pValue: number;
  requiredSampleSize?: number | null;
  existingSampleSize?: number | null;
}
