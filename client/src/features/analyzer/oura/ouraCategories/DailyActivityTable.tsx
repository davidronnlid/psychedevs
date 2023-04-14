import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Collapse,
  Box,
} from "@mui/material";
import { DailyActivity } from "../../../../typeModels/ouraModel";

interface DailyActivityTableProps {
  dailyActivities: DailyActivity[];
}

const DailyActivityTable: React.FC<DailyActivityTableProps> = ({
  dailyActivities,
}) => {
  const [showDailyActivity, setShowDailyActivity] = useState(false);
  const [openRow, setOpenRow] = useState<string | null>(null);

  const handleRowClick = (id: string) => {
    if (openRow === id) {
      setOpenRow(null);
    } else {
      setOpenRow(id);
    }
  };

  return (
    <TableContainer component={Paper} style={{ border: "1px solid green" }}>
      <Typography
        variant="h5"
        onClick={() => setShowDailyActivity((prev) => !prev)}
        style={{ cursor: "pointer" }}
      >
        Daily Activity
      </Typography>
      {showDailyActivity && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Day</TableCell>
              <TableCell align="right">Active Calories</TableCell>
              <TableCell align="right">Average MET Minutes</TableCell>
              <TableCell align="right">High Activity Time</TableCell>
              <TableCell align="right">Low Activity Time</TableCell>
              <TableCell align="right">Medium Activity Time</TableCell>
              <TableCell align="right">Steps</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dailyActivities.map((row) => (
              <React.Fragment key={row.id}>
                <TableRow
                  onClick={() => handleRowClick(row.id)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell component="th" scope="row">
                    {row.day}
                  </TableCell>
                  <TableCell align="right">{row.active_calories}</TableCell>
                  <TableCell align="right">{row.average_met_minutes}</TableCell>
                  <TableCell align="right">{row.high_activity_time}</TableCell>
                  <TableCell align="right">{row.low_activity_time}</TableCell>
                  <TableCell align="right">
                    {row.medium_activity_time}
                  </TableCell>
                  <TableCell align="right">{row.steps}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={7}
                  >
                    <Collapse
                      in={openRow === row.id}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box margin={1}>
                        <Typography variant="h6" gutterBottom component="div">
                          Additional Details
                        </Typography>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>High Activity MET Minutes</TableCell>
                              <TableCell>Low Activity MET Minutes</TableCell>
                              <TableCell>Medium Activity MET Minutes</TableCell>
                              <TableCell>Total Calories</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                {row.high_activity_met_minutes}
                              </TableCell>
                              <TableCell>
                                {row.low_activity_met_minutes}
                              </TableCell>
                              <TableCell>
                                {row.medium_activity_met_minutes}
                              </TableCell>
                              <TableCell>{row.total_calories}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default DailyActivityTable;
