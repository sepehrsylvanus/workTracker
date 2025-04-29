"use server";

import { serializeMongoId, verifyToken } from "@/lib/helperFunctions";
import User, { TUser } from "@/models/user.model";
import WorkEntry from "@/models/workEntries.model";
import { cookies } from "next/headers";

export const getUser = async () => {
  // GET TOKEN
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const tokenPayload = (await verifyToken(token!)) as { id: string };

  // GET USER

  if (!tokenPayload) return null;
  const user = await User.findById(tokenPayload.id)
    .populate({
      path: "workEntries",
      model: WorkEntry,
    })
    .lean<TUser>();
  const safeUser = serializeMongoId(user);
  return safeUser;
};
