"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { ExportOptions } from "./export-options";
import { MonthlySummary } from "./monthly-summary";
import { WorkEntryForm } from "./work-entry-form";
import { WorkEntriesList } from "./work-entries-list";
import {
  useAddEntries,
  useDeleteEntry,
  useGetEntries,
  useUpdateEntry,
} from "@/hooks/useWorkEntries";
import { TWorkEntry } from "@/models/workEntries.model";
import { LucideLoader } from "lucide-react";

export function WorkCalendar() {
  const { data: workEntries, isLoading: entriesLoading } = useGetEntries();
  const { mutate: addEntries } = useAddEntries();
  const { mutate: updateEntry } = useUpdateEntry();
  const { mutate: deleteEntry } = useDeleteEntry();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TWorkEntry | null>(null);

  const entriesForSelectedDate = selectedDate
    ? workEntries?.filter(
        (entry) => entry.date.toDateString() === selectedDate.toDateString()
      )
    : [];

  const handleAddEntry = (entry: TWorkEntry) => {
    console.log("hello");
    addEntries(entry);
    setIsAddingEntry(false);
  };

  const handleUpdateEntry = (updatedEntry: TWorkEntry) => {
    const dataToUpdate = {
      id: updatedEntry._id,
      entry: updatedEntry,
    };
    updateEntry(dataToUpdate);

    setEditingEntry(null);
  };

  const handleDeleteEntry = (id: string) => {
    console.log("🚀 ~ handleDeleteEntry ~ id:", id);

    deleteEntry(id);
  };

  // Function to highlight dates with work entries
  const isDayWithEntry = (date: Date) => {
    if (!workEntries) return;

    return workEntries.some(
      (entry) => entry.date.toDateString() === date.toDateString()
    );
  };

  if (entriesLoading) {
    return <LucideLoader className="animate-spin" />;
  } else {
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
                workDay: (date) => isDayWithEntry(date) ?? false,
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
                <ExportOptions entries={workEntries ?? []} />
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
                      entries={entriesForSelectedDate ?? []}
                      onAddEntry={() => setIsAddingEntry(true)}
                      onEditEntry={setEditingEntry}
                      onDeleteEntry={handleDeleteEntry}
                    />
                  )}
                </>
              )}
            </CardContent>
          </Card>
          <MonthlySummary entries={workEntries ?? []} />
        </div>
      </div>
    );
  }
}
