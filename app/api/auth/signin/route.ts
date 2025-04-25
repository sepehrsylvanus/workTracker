import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/lib/connectToDB";
export const POST = async (req: Request) => {
  if (
    req.headers.get("authorization")?.split(" ")[1] !==
    process.env.NEXT_PUBLIC_API_KEY
  ) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { email, password } = await req.json();
  try {
    await connectToDB();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
    const token = jwt.sign({ id: user._id }, process.env.NEXT_PUBLIC_API_KEY!);
    delete user.password;
    const res = NextResponse.json({ user, token }, { status: 200 });
    res.cookies.set("token", token);
    return res;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
