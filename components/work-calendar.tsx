"use client";

import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { ExportOptions } from "./export-options";
import { MonthlySummary } from "./monthly-summary";
import { WorkEntryForm } from "./work-entry-form";
import { WorkEntriesList } from "./work-entries-list";
import {
  useAddEntries,
  useDeleteAllEntries,
  useDeleteEntry,
  useGetEntries,
  useUpdateEntry,
} from "@/hooks/useWorkEntries";
import { TWorkEntry } from "@/models/workEntries.model";
import { LucideLoader } from "lucide-react";
import { DeleteAllButton } from "./delete-all-button";
import Cookies from "js-cookie";
import { verifyToken } from "@/lib/helperFunctions";
import { WORK_API } from "@/lib/AXIOS";
import { TUser } from "@/models/user.model";
import { toast } from "react-toastify";
export function WorkCalendar() {
  const token = Cookies.get("token");
  const [user, setUser] = useState<TUser>();
  const [userLoading, setUserLoading] = useState(true);
  useEffect(() => {
    const func = async () => {
      const tokenPayload = await verifyToken(token!);
      console.log("🚀 ~ func ~ tokenPayload:", tokenPayload);
      if (!tokenPayload) return null;
      WORK_API.get(`/user/${tokenPayload.id}`)
        .then((res) => {
          setUser(res.data.safeUser);
          setUserLoading(false);
        })
        .catch((err) => {
          toast.error(err.response.data);
          setUserLoading(false);
        });
    };
    func();
  }, []);

  console.log("🚀 ~ WorkCalendar ~ token:", token);

  console.log("🚀 ~ WorkCalendar ~ user:", user);
  const { mutate: addEntries } = useAddEntries();
  const { mutate: updateEntry } = useUpdateEntry();
  const { mutate: deleteEntry } = useDeleteEntry();
  const { mutate: handleDeleteAll } = useDeleteAllEntries();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TWorkEntry | null>(null);

  const entriesForSelectedDate = selectedDate
    ? user?.workEntries?.filter((entry) => {
        return (
          new Date(entry.date).toDateString() === selectedDate.toDateString()
        );
      })
    : [];

  const handleAddEntry = (entry: Omit<TWorkEntry, "user">) => {
    console.log("hello");
    addEntries(entry);
    setIsAddingEntry(false);
  };

  const handleUpdateEntry = (updatedEntry: Omit<TWorkEntry, "user">) => {
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
    if (!user?.workEntries) return;

    return user.workEntries.some(
      (entry) => new Date(entry.date).toDateString() === date.toDateString()
    );
  };

  if (userLoading) {
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
                <ExportOptions entries={user?.workEntries ?? []} />
                <DeleteAllButton
                  onDeleteAll={handleDeleteAll}
                  disabled={user?.workEntries?.length === 0}
                />
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
          <MonthlySummary entries={user?.workEntries ?? []} />
        </div>
      </div>
    );
  }
}
