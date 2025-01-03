import { format, parseISO, startOfDay } from "date-fns";

export const isFutureOrToday = (date: string) => {
  const today = startOfDay(new Date());
  const eventDate = startOfDay(parseISO(date));
  return eventDate >= today;
};

export const formatDate = (date: string) => {
  return format(new Date(date), "yyyy-MM-dd");
};