import { CorrelationCalculationInput } from "../typeModels/statsModel";

// Helper function to approximate the inverse normal cumulative distribution function (quantile function)
const inverseNormalCDF = (p: number): number | undefined => {
  const a1 = -3.969683028665376e1;
  const a2 = 2.209460984245205e2;
  const a3 = -2.759285104469687e2;
  const a4 = 1.38357751867269e2;
  const a5 = -3.066479806614716e1;
  const a6 = 2.506628277459239;

  const b1 = -5.447609879822406e1;
  const b2 = 1.615858368580409e2;
  const b3 = -1.556989798598866e2;
  const b4 = 6.680131188771972e1;
  const b5 = -1.328068155288572e1;

  const c1 = -7.784894002430293e-3;
  const c2 = -3.223964580411365e1;
  const c3 = -2.400758277161838e2;
  const c4 = -2.549732539343734e2;
  const c5 = 4.374664141464968e1;
  const c6 = 2.938163982698783;

  const d1 = 7.784695709041462e-3;
  const d2 = 3.224671290700398e1;
  const d3 = 2.445134137142996e2;
  const d4 = 3.754408661907416e2;

  let q, r;

  if (p < 0.02425) {
    q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
      ((((d1 * q + d2) * q + d3) * q + d4) * q + 1)
    );
  } else if (p <= 0.97575) {
    q = p - 0.5;
    r = q * q;
    return (
      ((((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q) /
      (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1)
    );
  } else if (p > 0.97575) {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return (
      (-1 * (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6)) /
      ((((d1 * q + d2) * q + d3) * q + d4) * q + 1)
    );
  } else {
    return 0;
  }
};

export const calculateCorrelation = (logs: CorrelationCalculationInput) => {
  //Filter logs with matching days
  const filteredLogs0 = logs[0].filter((log0) =>
    logs[1].some((log1) => log1.day === log0.day)
  );

  const filteredLogs1 = logs[1].filter((log1) =>
    logs[0].some((log0) => log0.day === log1.day)
  );

  // Get arrays of values
  const values1 = filteredLogs0.map((log) => {
    const logValue = Object.keys(log).find((key) => key !== "day");
    return logValue ? log[logValue] : undefined;
  });

  const values2 = filteredLogs1.map((log) => {
    const logValue = Object.keys(log).find((key) => key !== "day");
    return logValue ? log[logValue] : undefined;
  });

  // Ensure both value arrays have the same length
  if (values1.length !== values2.length) {
    console.error("The value arrays must have the same length.");
    return { correlation: NaN, pValue: NaN };
  }

  // Calculate correlation using Pearson correlation coefficient
  const n = values1.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  let sumY2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += values1[i];
    sumY += values2[i];
    sumXY += values1[i] * values2[i];
    sumX2 += values1[i] ** 2;
    sumY2 += values2[i] ** 2;
  }
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt(
    (n * sumX2 - sumX ** 2) * (n * sumY2 - sumY ** 2)
  );
  const correlation = numerator / denominator;

  // Calculate degrees of freedom, t-score, and p-value
  const tScore = correlation * Math.sqrt((n - 2) / (1 - correlation ** 2));

  // Calculate the p-value using the t-score and degrees of freedom (n - 2)
  // This requires the CDF (Cumulative Distribution Function) of the t-distribution
  // Implementing the CDF from scratch is complex, but you can use an approximation
  // This approximation is for large sample sizes (n > 30)
  const zScore = Math.abs(tScore) / Math.sqrt(n);
  const pValue = Math.exp(-1 * zScore * (Math.PI / Math.sqrt(6 * n)));

  // Calculating requiredSampleSize
  const zAlpha = inverseNormalCDF(1 - 0.05 / 2);
  const zBeta = inverseNormalCDF(0.8);

  let requiredSampleSize;
  if (zAlpha && zBeta) {
    requiredSampleSize = Math.ceil(Math.pow((zAlpha + zBeta) / correlation, 2));
  } else requiredSampleSize = 1100;

  const existingSampleSize = n;

  return { correlation, pValue, requiredSampleSize, existingSampleSize };
};
