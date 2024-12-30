import { format, isAfter, startOfDay } from "date-fns";

export const isFutureOrToday = (date: string) => {
  const today = startOfDay(new Date());
  const eventDate = startOfDay(new Date(date));
  return isAfter(eventDate, today) || format(eventDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
};

export const formatDate = (date: string) => {
  return format(new Date(date), "yyyy-MM-dd");
};