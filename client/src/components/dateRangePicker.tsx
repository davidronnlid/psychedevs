import React, { useState, useEffect } from "react";
import styled from "styled-components";

interface DateRangePickerProps {
  onStartDateChange: (newStartDate: string) => void;
  onEndDateChange: (newEndDate: string) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onStartDateChange,
  onEndDateChange,
}) => {
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const today = new Date();
  const formattedToday = formatDate(today);

  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(today.getDate() - 90);
  const formattedTwoWeeksAgo = formatDate(twoWeeksAgo);

  const [startDate, setStartDate] = useState(formattedTwoWeeksAgo);
  const [endDate, setEndDate] = useState(formattedToday);

  useEffect(() => {
    onStartDateChange(formattedTwoWeeksAgo);
    onEndDateChange(formattedToday);
  }, [
    formattedTwoWeeksAgo,
    formattedToday,
    onStartDateChange,
    onEndDateChange,
  ]);

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
    <Container>
      <Label htmlFor="start-date">Start Date:</Label>
      <Input
        type="date"
        id="start-date"
        value={startDate}
        onChange={handleStartDateChange}
      />
      <Label htmlFor="end-date">End Date:</Label>
      <Input
        type="date"
        id="end-date"
        value={endDate}
        onChange={handleEndDateChange}
      />
    </Container>
  );
};

export default DateRangePicker;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: #001219;
  padding: 1rem;
  border-radius: 0.5rem;
  color: #fff;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;

const Input = styled.input`
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #26ace2;
  border-radius: 0.25rem;
  background-color: #0a9396;
  color: #fff;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #94d2bd;
  }
`;
