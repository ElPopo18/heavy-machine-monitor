import { format, parseISO, startOfDay } from "date-fns";

export const isFutureOrToday = (date: string) => {
  const today = startOfDay(new Date());
  const eventDate = startOfDay(parseISO(date));
  return eventDate >= today;
};

export const formatDate = (date: string) => {
  // Ensure we're working with a valid date string
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date");
  }
  // Format to YYYY-MM-DD
  return format(parsedDate, "yyyy-MM-dd");
};