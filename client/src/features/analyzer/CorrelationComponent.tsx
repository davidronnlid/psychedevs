import { Box, Typography } from "@mui/material";
import { CorrelationDataType } from "../../typeModels/correlationModel";

interface CorrelationComponentProps {
  correlationData: CorrelationDataType;
  selectedLogTypes: string[];
}

export const CorrelationComponent = ({
  correlationData,
  selectedLogTypes,
}: CorrelationComponentProps) => (
  <>
    <Box sx={{ p: 2, bgcolor: "warning.light", borderRadius: 1 }}>
      <Typography variant="h6" component="div">
        Beta correlation feature.
      </Typography>
      <Typography variant="body1">
        This correlation feature is currently under development. Validity and
        reliability for the correlation equations have not yet been fully
        established.
      </Typography>
    </Box>
    <Box sx={{ height: "0.5rem" }} /> {/* A box can be used as a spacer */}
    <Typography variant="h5" component="div">
      Result of correlation calculation:
    </Typography>
    {correlationData &&
    selectedLogTypes[0] !== "" &&
    selectedLogTypes[1] !== "" &&
    (correlationData?.existingSampleSize ?? 0) >=
      (correlationData?.requiredSampleSize ?? 1100) &&
    (correlationData?.pValue ?? 1) <= 0.05 ? (
      <Box>
        <Typography variant="h6">A correlation was found!</Typography>
        <Typography>Correlation: {correlationData.correlation}</Typography>
        <Typography>P-value: {correlationData.pValue}</Typography>
        <Typography>
          Existing <i>logs</i> per <i>log type</i> analyzed:{" "}
          {correlationData.existingSampleSize}
        </Typography>
      </Box>
    ) : (
      <Box>
        <Typography variant="h6" sx={{ textDecoration: "underline" }}>
          No correlation was found.
        </Typography>
        {(correlationData?.existingSampleSize ?? 0) <=
        (correlationData?.requiredSampleSize ?? 0) ? (
          <Box>
            <Typography variant="h6">
              You need to collect more logs for these log types to find possible
              correlations between them.
            </Typography>
            <Typography>
              Existing <i>logs</i> per <i>log type</i>:{" "}
              {correlationData.existingSampleSize}
            </Typography>
            <Typography>
              Estimated required <i>logs</i> per <i>log type</i>:{" "}
              {correlationData.requiredSampleSize}
            </Typography>
          </Box>
        ) : correlationData?.existingSampleSize === 0 ? (
          <Typography variant="h6">
            One of these log types has no logs.
          </Typography>
        ) : (
          <Box>
            <Typography variant="h6">
              Enough logs have been collected for these log types in the
              selected date range to conclude with a high degree of certainty
              that no correlation exists between these log types in the selected
              date range.
            </Typography>
            <Typography>
              Existing <i>logs</i> per <i>log type</i>:{" "}
              {correlationData.existingSampleSize}
            </Typography>
            <Typography>
              Estimated required <i>logs</i> per <i>log type</i>:{" "}
              {correlationData.requiredSampleSize}
            </Typography>
          </Box>
        )}
      </Box>
    )}
  </>
);
