import React, { useState } from "react";

import { SleepData } from "../../../../typeModels/ouraModel";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
interface SleepDataTableProps {
  sleepData: SleepData[];
}

const SleepDataTable: React.FC<SleepDataTableProps> = ({ sleepData }) => {
  const [showSleepData, setShowSleepData] = useState(false);
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [openHrvDialog, setOpenHrvDialog] = useState(false);
  const [openTimeInBedDialog, setOpenTimeInBedDialog] = useState(false);
  const [openSleepDurationDialog, setOpenSleepDurationDialog] = useState(false);

  const [selectedHrv, setSelectedHrv] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleHrvDialogOpen = (hrv: number, date: string) => {
    setSelectedHrv(hrv);
    setSelectedDate(date);
    setOpenHrvDialog(true);
  };

  const handleHrvDialogClose = () => {
    setOpenHrvDialog(false);
  };

  const handleTimeInBedDialogOpen = (rowData: SleepData) => {
    setSelectedRowData(rowData);
    setOpenTimeInBedDialog(true);
  };

  const handleTimeInBedDialogClose = () => {
    setOpenTimeInBedDialog(false);
  };

  const handleSleepDurationDialogOpen = (rowData: SleepData) => {
    setSelectedRowData(rowData);
    setOpenSleepDurationDialog(true);
  };

  const handleSleepDurationDialogClose = () => {
    setOpenSleepDurationDialog(false);
  };

  const filterSleepDataByDateRange = (
    sleepData: SleepData[],
    dateRange: [Date | null, Date | null]
  ) => {
    if (dateRange[0] === null || dateRange[1] === null) {
      return sleepData;
    }

    return sleepData.filter((row) => {
      const sleepDate = new Date(row.day);
      return sleepDate >= dateRange[0]! && sleepDate <= dateRange[1]!;
    });
  };
  const [selectedRowData, setSelectedRowData] = useState<SleepData | null>(
    null
  );
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleString(undefined, options);
  };

  const secondsToHoursMinutes = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const hoursText = `${hours} ${hours === 1 ? "hour" : "hours"}`;
    const minutesText = `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;

    return `${hoursText} and ${minutesText}`;
  };

  return (
    <>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item>
          <DatePicker
            selected={dateRange[0]}
            onChange={(date: Date | null) => setDateRange([date, dateRange[1]])}
            selectsStart
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            placeholderText="Start date"
          />
        </Grid>
        <Grid item>
          <DatePicker
            selected={dateRange[1]}
            onChange={(date: Date | null) => setDateRange([dateRange[0], date])}
            selectsEnd
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            minDate={dateRange[0]}
            placeholderText="End date"
          />
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Typography
          variant="h5"
          onClick={() => setShowSleepData((prev) => !prev)}
          style={{ cursor: "pointer" }}
        >
          Sleep Data
        </Typography>
        {showSleepData && (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Day</TableCell>
                  <TableCell>Average Breath Rate</TableCell>
                  <TableCell>Average Heart Rate</TableCell>
                  <TableCell>Time in Bed</TableCell>
                  <TableCell>Total Sleep Duration</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterSleepDataByDateRange(sleepData, dateRange)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <b>{row.day}</b>
                      </TableCell>

                      <TableCell>{row.average_breath}</TableCell>
                      <TableCell
                        onClick={() =>
                          handleHrvDialogOpen(row.average_hrv, row.day)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <Box display="flex" alignItems="center">
                          {row.average_heart_rate}
                          <IconButton
                            size="small"
                            edge="end"
                            color="primary"
                            aria-label="more info"
                          >
                            <InfoOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>

                      <TableCell
                        onClick={() => handleTimeInBedDialogOpen(row)}
                        style={{ cursor: "pointer" }}
                      >
                        <Box display="flex" alignItems="center">
                          {secondsToHoursMinutes(row.time_in_bed)}
                          <IconButton
                            size="small"
                            edge="end"
                            color="primary"
                            aria-label="more info"
                          >
                            <InfoOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell
                        onClick={() => handleSleepDurationDialogOpen(row)}
                        style={{ cursor: "pointer" }}
                      >
                        <Box display="flex" alignItems="center">
                          {secondsToHoursMinutes(row.total_sleep_duration)}
                          <IconButton
                            size="small"
                            edge="end"
                            color="primary"
                            aria-label="more info"
                          >
                            <InfoOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15]}
              component="div"
              count={sleepData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </TableContainer>{" "}
      <Dialog open={openHrvDialog} onClose={handleHrvDialogClose}>
        <DialogTitle>
          {selectedDate && selectedHrv
            ? `Heart rate details for ${selectedDate}`
            : ""}
        </DialogTitle>
        <DialogContent>
          {selectedHrv && (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="h5">Log type</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h5">Log</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Average HRV (Heart Rate Variability)</TableCell>
                  <TableCell>{selectedHrv}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleHrvDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openTimeInBedDialog} onClose={handleTimeInBedDialogClose}>
        <DialogTitle>
          {selectedDate && selectedRowData
            ? `Time in bed details for ${selectedDate}`
            : ""}
        </DialogTitle>
        <DialogContent>
          {selectedRowData && (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="h5">Log type</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h5">Log</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <TableCell>Bedtime</TableCell>
                  <TableCell>
                    {formatDate(selectedRowData.bedtime_start)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Wake-up time</TableCell>

                  <TableCell>
                    {formatDate(selectedRowData.bedtime_end)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Awake Time</TableCell>
                  <TableCell>
                    {secondsToHoursMinutes(selectedRowData.awake_time)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Sleep Duration</TableCell>
                  <TableCell>
                    {secondsToHoursMinutes(
                      selectedRowData.total_sleep_duration
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <b>Time in Bed</b>
                  </TableCell>
                  <TableCell>
                    <b>{secondsToHoursMinutes(selectedRowData.time_in_bed)}</b>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTimeInBedDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openSleepDurationDialog}
        onClose={handleSleepDurationDialogClose}
      >
        <DialogTitle>
          {selectedDate && selectedRowData
            ? `Sleep duration details for ${selectedDate}`
            : ""}
        </DialogTitle>
        <DialogContent>
          {selectedRowData && (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="h5">Log type</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h5">Log</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Light Sleep Duration</TableCell>
                  <TableCell>
                    {secondsToHoursMinutes(
                      selectedRowData.light_sleep_duration
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>REM Sleep Duration</TableCell>
                  <TableCell>
                    {secondsToHoursMinutes(selectedRowData.rem_sleep_duration)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Deep Sleep Duration</TableCell>
                  <TableCell>
                    {secondsToHoursMinutes(selectedRowData.deep_sleep_duration)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <b>Total Sleep Duration</b>
                  </TableCell>
                  <TableCell>
                    <b>
                      {secondsToHoursMinutes(
                        selectedRowData.total_sleep_duration
                      )}
                    </b>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSleepDurationDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SleepDataTable;
