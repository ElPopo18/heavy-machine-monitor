import { format, isAfter, startOfDay, isSameDay } from "date-fns";

export const isFutureOrToday = (date: string) => {
  const today = startOfDay(new Date());
  const eventDate = startOfDay(new Date(date));
  return isAfter(eventDate, today) || isSameDay(eventDate, today);
};

export const formatDate = (date: string) => {
  return format(new Date(date), "yyyy-MM-dd");
};