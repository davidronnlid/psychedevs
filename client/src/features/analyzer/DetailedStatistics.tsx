import React, { useState } from "react";
import { Box, Typography, Collapse, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { CorrelationDataType } from "../../typeModels/correlationModel";

interface StatisticsComponentProps {
  correlationData: CorrelationDataType;
}

const StatisticsComponent: React.FC<StatisticsComponentProps> = ({
  correlationData,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Box
        sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        onClick={() => setOpen(!open)}
      >
        <Typography variant="subtitle2" sx={{ mt: 3 }}>
          View exact statistics
        </Typography>
        <IconButton sx={{ mt: 3 }}>
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      <Collapse in={open}>
        <Box>
          <Typography>
            <b>
              Analyzed <i>logs</i> per <i>log type</i>:
            </b>{" "}
            {correlationData.existingSampleSize}
          </Typography>
          <Typography>
            <b>Correlation (Pearson's R):</b> {correlationData.correlation ?? 0}
          </Typography>
          <Typography>
            <b>P-value:</b>{" "}
            {correlationData.pValue === 0
              ? "Approaching " + correlationData.pValue
              : correlationData.pValue}
          </Typography>
        </Box>
      </Collapse>
    </Box>
  );
};

export default StatisticsComponent;
