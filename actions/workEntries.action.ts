"use server";

import { connectToDB } from "@/lib/connectToDB";
import WorkEntry, { TWorkEntry } from "@/models/workEntries.model";

export const AddEntries = async ({
  date,
  isFullTime,
  startTime,
  endTime,
}: TWorkEntry) => {
  try {
    await connectToDB();
    await WorkEntry.create({
      date,
      isFullTime,
      startTime,
      endTime,
    });
    return "Work Entry added successfully";
  } catch (error: any) {
    console.error(error.message);
    throw new Error(error.message);
  }
};
export const getWorkEntries = async () => {
  try {
    await connectToDB();

    const workEntriesRaw = await WorkEntry.find({})
      .select("_id date isFullTime startTime endTime")

      .sort({ date: -1 })
      .lean<TWorkEntry[]>();
    console.log("🚀 ~ getWorkEntries ~ workEntriesRaw:", workEntriesRaw);
    const workEntries = workEntriesRaw.map((entry) => ({
      _id: entry._id.toString(),
      date: entry.date,
      isFullTime: entry.isFullTime,
      startTime: entry.startTime,
      endTime: entry.endTime,
    }));
    console.log("🚀 ~ workEntries ~ workEntries:", workEntries);

    return workEntries;
  } catch (error: any) {
    console.error(error.message);
    throw new Error(error.message);
  }
};

export const updateEntry = async ({
  id,
  entry,
}: {
  id: string;
  entry: TWorkEntry;
}) => {
  try {
    await connectToDB();

    await WorkEntry.findByIdAndUpdate(id, entry, {
      new: true,
      overwrite: true,
    });
  } catch (error: any) {
    console.error(error.message);
    throw new Error(error.message);
  }
};

export const deleteEntry = async (id: string) => {
  try {
    console.log("delete");
    await connectToDB();

    await WorkEntry.findByIdAndDelete(id);
  } catch (error: any) {
    console.error(error.message);
    throw new Error(error.message);
  }
};
