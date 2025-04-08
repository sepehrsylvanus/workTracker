import { Schema, models, model, ObjectId } from "mongoose";

export interface TWorkEntry {
  _id: string;
  date: Date;
  isFullTime: boolean;
  startTime: string;
  endTime: string;
}

const workEntrySchema = new Schema<TWorkEntry>({
  date: { type: Date, required: true },
  isFullTime: { type: Boolean, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

const WorkEntry =
  models.WorkEntry || model<TWorkEntry>("WorkEntry", workEntrySchema);

export default WorkEntry;
