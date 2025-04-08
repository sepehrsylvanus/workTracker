"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExportOptions } from "./export-options";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WorkEntry } from "./work-calendar";
import { calculateHoursWorked } from "@/lib/utils";

interface MonthlySummaryProps {
  entries: WorkEntry[];
}

export function MonthlySummary({ entries }: MonthlySummaryProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    getCurrentYearMonth()
  );

  function getCurrentYearMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  }

  // Get all available year-months from entries
  const availableMonths = [
    ...new Set(
      entries.map((entry) => {
        const date = new Date(entry.date);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
      })
    ),
  ]
    .sort()
    .reverse();

  // Filter entries by selected month
  const filteredEntries = entries.filter((entry) => {
    const date = new Date(entry.date);
    return (
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}` === selectedMonth
    );
  });

  // Calculate statistics
  const totalHours = filteredEntries.reduce(
    (sum, entry) => sum + calculateHoursWorked(entry.startTime, entry.endTime),
    0
  );

  const fullTimeDays = filteredEntries.filter(
    (entry) => entry.isFullTime
  ).length;
  const partTimeDays = filteredEntries.filter(
    (entry) => !entry.isFullTime
  ).length;

  // Format month name for display
  const formatMonthDisplay = (yearMonth: string) => {
    const [year, month] = yearMonth.split("-");
    const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, 1);
    return `${date.toLocaleString("default", { month: "long" })} ${year}`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Monthly Summary</CardTitle>
        <div className="flex items-center gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {availableMonths.length > 0 ? (
                availableMonths.map((month) => (
                  <SelectItem key={month} value={month}>
                    {formatMonthDisplay(month)}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-data" disabled>
                  No data available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <ExportOptions
            entries={filteredEntries}
            month={
              selectedMonth
                ? new Date(
                    Number.parseInt(selectedMonth.split("-")[0]),
                    Number.parseInt(selectedMonth.split("-")[1]) - 1,
                    1
                  )
                : undefined
            }
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{filteredEntries.length}</div>
            <div className="text-sm text-muted-foreground">Total Work Days</div>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">Total Hours</div>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">
              {fullTimeDays} / {partTimeDays}
            </div>
            <div className="text-sm text-muted-foreground">
              Full / Part Time
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
