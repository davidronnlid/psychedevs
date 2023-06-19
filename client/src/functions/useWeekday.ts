import { useState, useEffect } from "react";

const useWeekday = (dayOfWeekToday: number) => {
  const [weekday, setWeekday] = useState("");

  useEffect(() => {
    const weekdays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    // adjust for dayOfWeekToday starting from 0 = Monday
    const index = (dayOfWeekToday - 1 + 7) % 7;
    setWeekday(weekdays[index]);
  }, [dayOfWeekToday]);

  return weekday;
};

export default useWeekday;
