import { format, parseISO, isValid } from "date-fns";

export const isFutureOrToday = (date: string) => {
  // Get current date in UTC
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  
  // Parse and set input date to UTC midnight
  const eventDate = parseISO(date);
  eventDate.setUTCHours(0, 0, 0, 0);
  
  console.log('Comparing dates:', {
    today: today.toISOString(),
    eventDate: eventDate.toISOString(),
    isValid: eventDate >= today
  });
  
  return eventDate >= today;
};

export const formatDate = (date: string) => {
  // Parse the input date string
  const parsedDate = parseISO(date);
  
  if (!isValid(parsedDate)) {
    throw new Error("Invalid date");
  }
  
  // Format to YYYY-MM-DD without modifying the timezone
  const formatted = format(parsedDate, "yyyy-MM-dd");
  console.log('Formatted date:', {
    input: date,
    parsed: parsedDate.toISOString(),
    formatted
  });
  return formatted;
};

export const getTodayFormatted = () => {
  // Get today's date in local timezone
  const today = new Date();
  // Format to YYYY-MM-DD
  const formatted = format(today, "yyyy-MM-dd");
  console.log('Today formatted:', formatted);
  return formatted;
};