import { model, models, Schema } from "mongoose";
import { TWorkEntry } from "./workEntries.model";

export interface TUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  workEntries: TWorkEntry[];
}

const userSchema = new Schema<TUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  workEntries: [
    {
      type: Schema.Types.ObjectId,
      ref: "WorkEntry",
    },
  ],
});

const User = models.User || model<TUser>("User", userSchema);

export default User;
