import { Log } from "../typeModels/logTypeModel";

export const calculateCorrelation = (logs: Log[][]) => {
  // Sort logs by date
  logs[0].sort((a, b) => a.date.getTime() - b.date.getTime());
  logs[1].sort((a, b) => a.date.getTime() - b.date.getTime());

  // Get arrays of dates and values
  const dates1 = logs[0].map((log) => log.date);
  const values1 = logs[0].map((log) => log.value);
  const values2 = logs[1].map((log) => log.value);

  // Calculate correlation using Pearson correlation coefficient
  const n = dates1.length;
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
