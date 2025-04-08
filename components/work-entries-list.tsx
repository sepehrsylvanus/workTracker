"use client";

import { Button } from "@/components/ui/button";
import { Clock, Edit, Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatHoursDisplay } from "@/lib/utils";
import { TWorkEntry } from "@/models/workEntries.model";

interface WorkEntriesListProps {
  entries: TWorkEntry[];
  onAddEntry: () => void;
  onEditEntry: (entry: TWorkEntry) => void;
  onDeleteEntry: (id: string) => void;
}

export function WorkEntriesList({
  entries,
  onAddEntry,
  onEditEntry,
  onDeleteEntry,
}: WorkEntriesListProps) {
  console.log("🚀 ~ entries:", entries);

  return (
    <div className="space-y-4">
      {entries.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No work entries for this date.
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <Card key={entry._id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Badge variant={entry.isFullTime ? "default" : "outline"}>
                      {entry.isFullTime ? "Full-time" : "Part-time"}
                    </Badge>
                    <div className="flex items-center text-sm">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>
                        {entry.startTime} - {entry.endTime}
                        <span className="ml-2 text-muted-foreground">
                          ({formatHoursDisplay(entry.startTime, entry.endTime)})
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditEntry(entry)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteEntry(entry._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-center pt-2">
        <Button onClick={onAddEntry} className="flex items-center">
          <Plus className="mr-1 h-4 w-4" />
          Add Work Entry
        </Button>
      </div>
    </div>
  );
}
