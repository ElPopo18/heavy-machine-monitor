import { format, parseISO, startOfDay, isValid } from "date-fns";

export const isFutureOrToday = (date: string) => {
  const today = startOfDay(new Date());
  const eventDate = startOfDay(parseISO(date));
  return eventDate >= today;
};

export const formatDate = (date: string) => {
  // Parse the input date string
  const parsedDate = parseISO(date);
  
  if (!isValid(parsedDate)) {
    throw new Error("Invalid date");
  }
  
  // Format to YYYY-MM-DD
  return format(parsedDate, "yyyy-MM-dd");
};

export const getTodayFormatted = () => {
  return format(new Date(), "yyyy-MM-dd");
};