import { Log } from "../typeModels/logTypeModel";

export const calculateCorrelation = (logs: Log[][]) => {
  // Filter logs with matching dates
  const filteredLogs0 = logs[0].filter((log0) =>
    logs[1].some((log1) => log1.date === log0.date)
  );

  const filteredLogs1 = logs[1].filter((log1) =>
    logs[0].some((log0) => log0.date === log1.date)
  );

  // Get arrays of values
  const values1 = filteredLogs0.map((log) => log.value);
  const values2 = filteredLogs1.map((log) => log.value);

  // Ensure both value arrays have the same length
  if (values1.length !== values2.length) {
    console.error("The value arrays must have the same length.");
    return NaN;
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

  return correlation;
};
