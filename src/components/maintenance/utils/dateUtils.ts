import { format, parseISO, startOfDay, isValid, addDays } from "date-fns";

export const isFutureOrToday = (date: string) => {
  const today = startOfDay(new Date());
  const eventDate = startOfDay(parseISO(date));
  return eventDate >= today;
};

export const formatDate = (date: string) => {
  // First try to parse as ISO date
  let parsedDate = parseISO(date);
  
  // If invalid, try regular Date parsing
  if (!isValid(parsedDate)) {
    parsedDate = new Date(date);
    if (!isValid(parsedDate)) {
      throw new Error("Invalid date");
    }
  }
  
  // Format to YYYY-MM-DD
  return format(parsedDate, "yyyy-MM-dd");
};

export const getTodayFormatted = () => {
  return format(new Date(), "yyyy-MM-dd");
};