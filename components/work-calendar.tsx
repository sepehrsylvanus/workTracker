"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { ExportOptions } from "./export-options";
import { MonthlySummary } from "./monthly-summary";
import { WorkEntryForm } from "./work-entry-form";
import { WorkEntriesList } from "./work-entries-list";

export type WorkEntry = {
  date: Date;
  isFullTime: boolean;
  startTime: string;
  endTime: string;
  id: string;
};

export function WorkCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [workEntries, setWorkEntries] = useState<WorkEntry[]>([]);
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [editingEntry, setEditingEntry] = useState<WorkEntry | null>(null);

  const entriesForSelectedDate = selectedDate
    ? workEntries.filter(
        (entry) => entry.date.toDateString() === selectedDate.toDateString()
      )
    : [];

  const handleAddEntry = (entry: WorkEntry) => {
    console.log("🚀 ~ handleAddEntry ~ entry:", entry);

    setWorkEntries([...workEntries, entry]);
    setIsAddingEntry(false);
  };

  const handleUpdateEntry = (updatedEntry: WorkEntry) => {
    setWorkEntries(
      workEntries.map((entry) =>
        entry.id === updatedEntry.id ? updatedEntry : entry
      )
    );
    setEditingEntry(null);
  };

  const handleDeleteEntry = (id: string) => {
    setWorkEntries(workEntries.filter((entry) => entry.id !== id));
  };

  // Function to highlight dates with work entries
  const isDayWithEntry = (date: Date) => {
    return workEntries.some(
      (entry) => entry.date.toDateString() === date.toDateString()
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardContent className="pt-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            modifiers={{
              workDay: (date) => isDayWithEntry(date),
            }}
            modifiersClassNames={{
              workDay: "bg-green-100 font-bold text-green-800",
            }}
          />
        </CardContent>
      </Card>

      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {selectedDate ? (
                  <>Work Entries for {selectedDate.toLocaleDateString()}</>
                ) : (
                  <>Select a date</>
                )}
              </h2>
              <ExportOptions entries={workEntries} />
            </div>

            {selectedDate && (
              <>
                {isAddingEntry ? (
                  <WorkEntryForm
                    date={selectedDate}
                    onSave={handleAddEntry}
                    onCancel={() => setIsAddingEntry(false)}
                  />
                ) : editingEntry ? (
                  <WorkEntryForm
                    date={selectedDate}
                    entry={editingEntry}
                    onSave={handleUpdateEntry}
                    onCancel={() => setEditingEntry(null)}
                  />
                ) : (
                  <WorkEntriesList
                    entries={entriesForSelectedDate}
                    onAddEntry={() => setIsAddingEntry(true)}
                    onEditEntry={setEditingEntry}
                    onDeleteEntry={handleDeleteEntry}
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>
        <MonthlySummary entries={workEntries} />
      </div>
    </div>
  );
}
