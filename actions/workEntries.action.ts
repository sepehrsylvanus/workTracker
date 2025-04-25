"use server";

import { connectToDB } from "@/lib/connectToDB";
import { verifyToken } from "@/lib/helperFunctions";
import User from "@/models/user.model";
import WorkEntry, { TWorkEntry } from "@/models/workEntries.model";
import mongoose from "mongoose";
import { cookies } from "next/headers";

export const AddEntries = async ({
  date,
  isFullTime,
  startTime,
  endTime,
}: Omit<TWorkEntry, "user">) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const tokenPayload = (await verifyToken(token!)) as { id: string };

    await connectToDB();
    const newWorkEntry = await WorkEntry.create({
      date,
      isFullTime,
      startTime,
      endTime,
    });
    await User.findByIdAndUpdate(tokenPayload.id, {
      $push: {
        workEntries: newWorkEntry._id,
      },
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
  entry: Omit<TWorkEntry, "user">;
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
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const tokenPayload = (await verifyToken(token!)) as { id: string };
    await User.findByIdAndUpdate(tokenPayload.id, {
      $pull: {
        workEntries: new mongoose.Types.ObjectId(id),
      },
    });
    await WorkEntry.findByIdAndDelete(id);
  } catch (error: any) {
    console.error(error.message);
    throw new Error(error.message);
  }
};
export const deleteAllEntries = async () => {
  try {
    await connectToDB();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const tokenPayload = (await verifyToken(token!)) as { id: string };
    await User.findByIdAndUpdate(tokenPayload.id, {
      $set: {
        workEntries: [],
      },
    });
    await WorkEntry.deleteMany({});
  } catch (error: any) {
    console.error(error.message);
    throw new Error(error.message);
  }
};
