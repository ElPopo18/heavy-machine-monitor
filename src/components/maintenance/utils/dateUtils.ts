import { format, isAfter, startOfDay, isSameDay } from "date-fns";

export const isFutureOrToday = (date: string) => {
  const today = new Date();
  const eventDate = new Date(date);
  return isAfter(eventDate, today) || isSameDay(eventDate, today);
};

export const formatDate = (date: string) => {
  return format(new Date(date), "yyyy-MM-dd");
};