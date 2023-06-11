import { Box, Typography, LinearProgress } from "@mui/material";
import { CorrelationDataType } from "../../typeModels/correlationModel";
import DetailedStatistics from "./DetailedStatistics";

interface CorrelationComponentProps {
  correlationData: CorrelationDataType;
  selectedLogTypes: string[];
}

export const CorrelationComponent = ({
  correlationData,
  selectedLogTypes,
}: CorrelationComponentProps) => {
  const existingLogs = correlationData?.existingSampleSize ?? 0;
  const requiredLogs = correlationData?.requiredSampleSize ?? 0;

  // calculate the percentage of progress
  const progress =
    existingLogs && requiredLogs ? (existingLogs / requiredLogs) * 100 : 0;

  return (
    <>
      <Box sx={{ height: "0.5rem" }} />
      {correlationData &&
      selectedLogTypes[0] !== "" &&
      selectedLogTypes[1] !== "" &&
      (correlationData?.existingSampleSize ?? 0) >=
        (correlationData?.requiredSampleSize ?? 1100) &&
      (correlationData?.pValue ?? 1) <= 0.1 ? (
        <>
          <Box sx={{ p: 2, bgcolor: "success.light", borderRadius: 1 }}>
            <Typography variant="h6">A correlation was found!</Typography>

            <Typography>
              <b>Effect Size:</b>{" "}
              {(Math.abs(correlationData.correlation ?? 0) < 0.1
                ? "Very Small"
                : Math.abs(correlationData.correlation ?? 0) < 0.3
                ? "Small"
                : Math.abs(correlationData.correlation ?? 0) < 0.5
                ? "Medium"
                : "Large") +
                (correlationData.correlation ?? 0 > 0
                  ? " negative"
                  : " positive")}
            </Typography>
            <Typography>
              <b>Certainty:</b>{" "}
              {correlationData.pValue < 0.01
                ? "Very strong"
                : correlationData.pValue < 0.05
                ? "Strong"
                : "Weak"}
            </Typography>
            <DetailedStatistics correlationData={correlationData} />
          </Box>
        </>
      ) : (
        <Box sx={{ p: 2, bgcolor: "error.light", borderRadius: 1 }}>
          <Typography variant="h6" sx={{ textDecoration: "underline" }}>
            No correlation was found.
          </Typography>
          {(correlationData?.existingSampleSize ?? 0) <=
          (correlationData?.requiredSampleSize ?? 0) ? (
            <Box>
              <Typography variant="h6">
                You need to collect more logs for these log types to find
                possible correlations between them.
              </Typography>
              <Typography>
                <b>
                  Existing <i>logs</i> per <i>log type</i>:
                </b>{" "}
                {correlationData.existingSampleSize}
              </Typography>
              <Typography>
                <b>
                  Estimated required <i>logs</i> per <i>log type</i>:
                </b>{" "}
                {correlationData.requiredSampleSize}
              </Typography>{" "}
              <Typography variant="body1" sx={{ mt: 2 }}>
                <b>Progress towards required log count:</b>
              </Typography>
              <Box
                sx={{
                  width: "80%",
                  position: "relative", // To place the text over the bar
                  display: "flex",
                  alignItems: "center", // To align the text vertically
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    position: "absolute",
                    left: "0.5rem",
                    color: "white",
                    zIndex: 1, // To bring the text to front
                  }}
                >
                  {`${Math.round(progress)}%`}
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    width: "300px",
                    height: "1.5rem",
                    bgcolor: "#001219",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "limegreen",
                    },
                  }}
                />
              </Box>
            </Box>
          ) : correlationData?.existingSampleSize === 0 ? (
            <Typography variant="h6">
              One of these log types has no logs.
            </Typography>
          ) : (
            <Box sx={{ p: 2, bgcolor: "error.light", borderRadius: 1 }}>
              <Typography variant="h6">
                Enough logs have been collected for these log types in the
                selected date range to conclude with a high degree of certainty
                that no correlation exists between these log types in the
                selected date range.
              </Typography>
              <Typography>
                <b>
                  Existing <i>logs</i> per <i>log type</i>:
                </b>{" "}
                {correlationData.existingSampleSize}
              </Typography>
              <Typography>
                <b>
                  Estimated required <i>logs</i> per <i>log type</i>:
                </b>{" "}
                {correlationData.requiredSampleSize}
              </Typography>
            </Box>
          )}
        </Box>
      )}
      <Box sx={{ p: 2, bgcolor: "warning.light", borderRadius: 1, mt: 2 }}>
        <Typography variant="h6" component="div">
          Beta correlation feature.
        </Typography>
        <Typography variant="body1">
          This correlation feature is currently under development. Validity and
          reliability for the correlation equations have not yet been fully
          established.
        </Typography>
      </Box>
    </>
  );
};
