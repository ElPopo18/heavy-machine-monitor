import { format, parseISO, startOfDay, isValid } from "date-fns";

export const isFutureOrToday = (date: string) => {
  // Convert dates to UTC to avoid timezone issues
  const today = startOfDay(new Date());
  const eventDate = startOfDay(parseISO(date));
  
  // Set both dates to midnight UTC for comparison
  today.setUTCHours(0, 0, 0, 0);
  eventDate.setUTCHours(0, 0, 0, 0);
  
  console.log('Comparing dates:', {
    today: today.toISOString(),
    eventDate: eventDate.toISOString(),
    isValid: eventDate >= today
  });
  return eventDate >= today;
};

export const formatDate = (date: string) => {
  // Parse the input date string and ensure UTC
  const parsedDate = parseISO(date);
  
  if (!isValid(parsedDate)) {
    throw new Error("Invalid date");
  }
  
  // Set to midnight UTC
  parsedDate.setUTCHours(0, 0, 0, 0);
  
  // Format to YYYY-MM-DD
  const formatted = format(parsedDate, "yyyy-MM-dd");
  console.log('Formatted date:', {
    input: date,
    parsed: parsedDate.toISOString(),
    formatted
  });
  return formatted;
};

export const getTodayFormatted = () => {
  // Get today's date in UTC
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const formatted = format(today, "yyyy-MM-dd");
  console.log('Today formatted:', formatted);
  return formatted;
};