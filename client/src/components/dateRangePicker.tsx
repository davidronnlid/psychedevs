import React, { ChangeEvent, useState } from "react";

interface DateRangePickerProps {
  onStartDateChange: (newStartDate: string) => void;
  onEndDateChange: (newEndDate: string) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onStartDateChange,
  onEndDateChange,
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newStartDate = event.target.value;
    setStartDate(newStartDate);
    onStartDateChange(newStartDate);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = event.target.value;
    setEndDate(newEndDate);
    onEndDateChange(newEndDate);
  };

  return (
    <div>
      <label htmlFor="start-date">Start Date:</label>
      <input
        type="date"
        id="start-date"
        value={startDate}
        onChange={handleStartDateChange}
      />
      <br />
      <label htmlFor="end-date">End Date:</label>
      <input
        type="date"
        id="end-date"
        value={endDate}
        onChange={handleEndDateChange}
      />
    </div>
  );
};

export default DateRangePicker;
