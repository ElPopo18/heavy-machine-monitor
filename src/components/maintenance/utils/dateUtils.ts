import { format, parseISO, startOfDay, isValid } from "date-fns";

export const isFutureOrToday = (date: string) => {
  const today = startOfDay(new Date());
  const eventDate = startOfDay(parseISO(date));
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
  const today = format(new Date(), "yyyy-MM-dd");
  console.log('Today formatted:', today);
  return today;
};