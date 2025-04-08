"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TWorkEntry } from "@/models/workEntries.model";

interface WorkEntryFormProps {
  date: Date;
  entry?: TWorkEntry | null;
  onSave: (entry: TWorkEntry) => void;
  onCancel: () => void;
}

export function WorkEntryForm({
  date,
  entry,
  onSave,
  onCancel,
}: WorkEntryFormProps) {
  const [isFullTime, setIsFullTime] = useState(entry?.isFullTime ?? true);
  const [startTime, setStartTime] = useState(entry?.startTime ?? "09:00");
  const [endTime, setEndTime] = useState(entry?.endTime ?? "17:00");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEntry: TWorkEntry = {
      _id: entry?._id ?? "",
      date: date,
      isFullTime,
      startTime,
      endTime,
    };

    onSave(newEntry);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Work Type</Label>
        <RadioGroup
          defaultValue={isFullTime ? "full-time" : "part-time"}
          onValueChange={(value) => setIsFullTime(value === "full-time")}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="full-time" id="full-time" />
            <Label htmlFor="full-time">Full-time</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="part-time" id="part-time" />
            <Label htmlFor="part-time">Part-time</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-time">Start Time</Label>
          <Input
            id="start-time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-time">End Time</Label>
          <Input
            id="end-time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{entry ? "Update" : "Save"} Entry</Button>
      </div>
    </form>
  );
}
