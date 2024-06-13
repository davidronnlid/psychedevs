const getTodayDate = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return today;
};

// Helper function to get yesterday's date
const getYesterdayDate = (): Date => {
  const today = new Date();
  today.setDate(today.getDate() - 1);
  return today;
};

export default getTodayDate;
