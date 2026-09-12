const MS_PER_DAY = 1000 * 60 * 60 * 24;

const parseDate = (date) => {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Invalid date");
  }

  return parsed;
};

const validateDateRange = (startDate, endDate) => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  if (start >= end) {
    throw new Error("End date must be after start date");
  }

  return { start, end };
};

const calculateRentalDays = (startDate, endDate) => {
  const { start, end } = validateDateRange(startDate, endDate);

  return Math.ceil((end - start) / MS_PER_DAY);
};

const datesOverlap = (
  existingStart,
  existingEnd,
  requestedStart,
  requestedEnd
) => {
  const existingStartDate = parseDate(existingStart);
  const existingEndDate = parseDate(existingEnd);
  const requestedStartDate = parseDate(requestedStart);
  const requestedEndDate = parseDate(requestedEnd);

  return (
    requestedStartDate < existingEndDate &&
    requestedEndDate > existingStartDate
  );
};

module.exports = {
  parseDate,
  validateDateRange,
  calculateRentalDays,
  datesOverlap,
};