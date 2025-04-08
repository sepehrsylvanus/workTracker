import { TWorkEntry } from "@/models/workEntries.model";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format work entries for export
export function formatWorkEntriesForExport(entries: TWorkEntry[]) {
  return entries.map((entry) => ({
    Date: entry.date.toLocaleDateString(),
    Type: entry.isFullTime ? "Full-time" : "Part-time",
    "Start Time": entry.startTime,
    "End Time": entry.endTime,
    "Hours Worked": calculateHoursWorked(entry.startTime, entry.endTime),
  }));
}

// Calculate hours worked as a decimal for reporting
export function calculateHoursWorked(start: string, end: string): number {
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  // Handle cases where end time is on the next day
  const totalMinutes =
    endMinutes >= startMinutes
      ? endMinutes - startMinutes
      : 24 * 60 - startMinutes + endMinutes;

  return Number.parseFloat((totalMinutes / 60).toFixed(2));
}

// Format hours for display
export function formatHoursDisplay(start: string, end: string): string {
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  // Handle cases where end time is on the next day
  const totalMinutes =
    endMinutes >= startMinutes
      ? endMinutes - startMinutes
      : 24 * 60 - startMinutes + endMinutes;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
}
