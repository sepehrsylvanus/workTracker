import { connectToDB } from "@/lib/connectToDB";
import { serializeMongoId } from "@/lib/helperFunctions";
import User, { TUser } from "@/models/user.model";
import WorkEntry from "@/models/workEntries.model";
import { NextRequest, NextResponse } from "next/server";
interface PARAMS {
  id: string;
}
export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<PARAMS> }
) => {
  const { id } = await params;
  try {
    await connectToDB();
    const user = await User.findById(id)
      .populate({
        path: "workEntries",
        model: WorkEntry,
      })
      .lean<TUser>();
    const safeUser = serializeMongoId(user);
    return NextResponse.json({ safeUser }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
